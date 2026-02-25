// src/core/actions/booking.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import {
    validateSlotOrThrow,
    getShiftForTime
} from '@/core/services/appointment.service';
import { getAvailableSlotsForDate, getBookedTimesFromDB, getBlockedTimesFromDB } from '@/core/services/appointment_db.service';
import { createClient } from '@/core/db/supabase-server';

export async function getAvailableSlots(dateString: string) {
    try {
        const slots = (await getAvailableSlotsForDate(dateString)).available;
        return { success: true, slots };
    } catch (error) {
        console.error("Error fetching slots:", error);
        return { success: false, slots: [] };
    }
}

export async function createAppointmentAction(formData: {
    dateStr: string;
    timeStr: string;
    serviceType: 'PHYSIOTHERAPY' | 'CANCER_REHAB' | 'HOME_VISIT';
    visitType: 'CLINIC' | 'HOME';
    patientDetails: { name: string; phone: string; email?: string; notes?: string };
}) {
    const { dateStr, timeStr, serviceType, visitType, patientDetails } = formData;

    try {
        // Step 1: Fetch current DB state — never trust client
        const [bookedTimes, blockedTimes] = await Promise.all([
            getBookedTimesFromDB(dateStr),
            getBlockedTimesFromDB(dateStr),
        ]);

        // Step 2: Server-side validation — the real gate
        // No skipPastCheck here → 2-hour buffer enforced for public bookings
        validateSlotOrThrow(dateStr, timeStr, bookedTimes, blockedTimes);

        const supabase = createClient();

        // Step 3: Upsert patient by phone (deduplication)
        const { data: patient, error: patientError } = await supabase
            .from('patients')
            .upsert(
                { phone: patientDetails.phone, full_name: patientDetails.name, email: patientDetails.email },
                { onConflict: 'phone', ignoreDuplicates: false }
            )
            .select('id')
            .single();

        if (patientError) throw new Error(patientError.message);

        // Step 4: Insert appointment
        const { data: appointment, error: apptError } = await supabase
            .from('appointments')
            .insert({
                patient_id: patient.id,
                service_type: serviceType,
                visit_type: visitType,
                appointment_date: dateStr,
                appointment_time: timeStr,
                shift: getShiftForTime(timeStr),
                status: 'CONFIRMED',
                notes: patientDetails.notes,
                created_by: 'PATIENT',
            })
            .select('id')
            .single();

        // error code 23505 = unique constraint violation = double booking caught at DB
        if (apptError?.code === '23505') {
            return { success: false, error: 'SLOT_JUST_TAKEN' };
        }
        if (apptError) throw new Error(apptError.message);

        // Step 5: Force ALL clients to refetch
        revalidatePath('/book');
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/appointments');

        return { success: true, appointmentId: appointment.id };

    } catch (err: unknown) {
        if (err instanceof Error && (
            err.message?.startsWith('INVALID_SLOT') ||
            err.message?.startsWith('PAST_SLOT') ||
            err.message?.startsWith('BUFFER_VIOLATION') ||
            err.message?.startsWith('SLOT_TAKEN')
        )) {
            return { success: false, error: err.message };
        }
        console.error('[createAppointmentAction]', err);
        return { success: false, error: 'SERVER_ERROR' };
    }
}

// Ensure the old confirmBooking works using the new internal API
export async function confirmBooking(data: { date: string, time: string, serviceType: string, visitType: string, patient: { name: string, phone: string, email?: string, issue?: string } }) {
    return createAppointmentAction({
        dateStr: data.date,
        timeStr: data.time,
        serviceType: (data.serviceType === 'post-surgery' ? 'PHYSIOTHERAPY' : (data.serviceType.toUpperCase().replace('-', '_'))) as 'PHYSIOTHERAPY' | 'CANCER_REHAB' | 'HOME_VISIT',
        visitType: data.visitType.toUpperCase() as 'CLINIC' | 'HOME',
        patientDetails: {
            name: data.patient.name,
            phone: data.patient.phone,
            email: data.patient.email,
            notes: data.patient.issue
        }
    });
}
