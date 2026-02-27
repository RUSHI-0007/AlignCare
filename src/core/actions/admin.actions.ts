// src/core/actions/admin.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import {
    validateSlotOrThrow,
    getShiftForTime,
    generateRawSlots,
} from '@/core/services/appointment.service';
import { getBookedTimesFromDB, getBlockedTimesFromDB } from '@/core/services/appointment_db.service';
import { createAdminClient } from '@/core/db/supabase-server';

// ─── WALK-IN ──────────────────────────────────────────────────────────────

export async function addWalkInAction(data: {
    dateStr: string;
    timeStr: string;
    patientName: string;
    patientPhone: string;
    serviceType?: 'PHYSIOTHERAPY' | 'CANCER_REHAB' | 'HOME_VISIT';
    notes?: string;
}) {
    const { dateStr, timeStr, patientName, patientPhone, serviceType = 'PHYSIOTHERAPY', notes } = data;

    try {
        const [bookedTimes, blockedTimes] = await Promise.all([
            getBookedTimesFromDB(dateStr),
            getBlockedTimesFromDB(dateStr),
        ]);

        // ✅ CORRECTED: skipPastCheck: true
        // Admin bypass — patient is physically at the clinic.
        // The 2-hour buffer does NOT apply to admin walk-ins.
        validateSlotOrThrow(dateStr, timeStr, bookedTimes, blockedTimes, { skipPastCheck: true });

        const supabase = createAdminClient();

        const { data: patient, error: patientError } = await supabase
            .from('patients')
            .upsert(
                { phone: patientPhone, full_name: patientName },
                { onConflict: 'phone', ignoreDuplicates: false }
            )
            .select('id')
            .single();

        if (patientError) throw new Error(patientError.message);

        const { error: apptError } = await supabase.from('appointments').insert({
            patient_id: patient.id,
            appointment_date: dateStr,
            appointment_time: timeStr,
            shift: getShiftForTime(timeStr),
            service_type: serviceType,
            visit_type: 'CLINIC',
            status: 'WALK_IN',
            notes: notes ?? 'Walk-in patient',
            created_by: 'ADMIN',
        });

        if (apptError?.code === '23505') return { success: false, error: 'SLOT_JUST_TAKEN' };
        if (apptError) throw new Error(apptError.message);

        // Propagate to ALL clients
        revalidatePath('/book');
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/appointments');

        return { success: true };

    } catch (err: unknown) {
        if (err instanceof Error && (
            err.message?.startsWith('SLOT_TAKEN') ||
            err.message?.startsWith('INVALID_SLOT')
        )) {
            return { success: false, error: err.message };
        }
        console.error('[addWalkInAction]', err);
        return { success: false, error: 'SERVER_ERROR' };
    }
}

// ─── BLOCK SLOT ───────────────────────────────────────────────────────────

export async function blockSlotAction(data: {
    dateStr: string;
    timeStr: string;
    reason?: string;
}) {
    const supabase = createAdminClient();
    const allSlots = generateRawSlots();

    if (!allSlots.includes(data.timeStr)) {
        return { success: false, error: 'INVALID_SLOT' };
    }

    const { data: blocked, error } = await supabase
        .from('blocked_slots')
        .insert({ slot_date: data.dateStr, slot_time: data.timeStr, reason: data.reason })
        .select('id')
        .single();

    if (error?.code === '23505') return { success: false, error: 'ALREADY_BLOCKED' };
    if (error) return { success: false, error: error.message };

    revalidatePath('/book');
    revalidatePath('/admin/dashboard');

    return { success: true, blockedId: blocked.id };
}

// ─── UNBLOCK SLOT ─────────────────────────────────────────────────────────

export async function unblockSlotAction(blockedSlotId: string) {
    const supabase = createAdminClient();
    const { error } = await supabase.from('blocked_slots').delete().eq('id', blockedSlotId);
    if (error) return { success: false, error: error.message };

    revalidatePath('/book');
    revalidatePath('/admin/dashboard');

    return { success: true };
}

// ─── CANCEL APPOINTMENT ───────────────────────────────────────────────────

export async function cancelAppointmentAction(appointmentId: string) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('appointments')
        .update({ status: 'CANCELLED' })
        .eq('id', appointmentId);

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/appointments');
    revalidatePath('/book');

    return { success: true };
}

// ─── GET APPOINTMENTS FOR DATE (TIMELINE) ─────────────────────────────────

export async function getAppointmentsForDateAction(dateStr: string) {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('appointments')
        .select(`
      id,
      appointment_time,
      shift,
      status,
      service_type,
      visit_type,
      notes,
      created_by,
      patients (
        id,
        full_name,
        phone
      )
    `)
        .eq('appointment_date', dateStr)
        .not('status', 'eq', 'CANCELLED')
        .order('appointment_time', { ascending: true });

    if (error) return { success: false, error: error.message, data: [] };

    // Supabase nested relation returns patients either as object or array depending on schema.
    // We Map it properly for the DailyTimeline component:
    const normalizedData = (data ?? []).map((appt: any) => {
        let patientObj = appt.patients;
        if (Array.isArray(appt.patients)) {
            patientObj = appt.patients[0];
        }

        return {
            ...appt,
            patients: patientObj // Ensure it's not an array
        };
    });

    return { success: true, data: normalizedData as any[] };
}

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────

export async function getDashboardStatsAction() {
    const supabase = createAdminClient();
    const { getTodayIST } = await import('@/core/services/appointment.service');
    const { getAvailableSlotsForDate } = await import('@/core/services/appointment_db.service');
    const today = getTodayIST();
    const sevenDaysLater = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const [todayAppts, upcomingHomeVisits, slotData] = await Promise.all([
        supabase
            .from('appointments')
            .select('id, status', { count: 'exact' })
            .eq('appointment_date', today)
            .not('status', 'eq', 'CANCELLED'),

        supabase
            .from('appointments')
            .select('id', { count: 'exact' })
            .eq('visit_type', 'HOME')
            .gte('appointment_date', today)
            .lte('appointment_date', sevenDaysLater)
            .not('status', 'eq', 'CANCELLED'),

        getAvailableSlotsForDate(today),
    ]);

    return {
        todayTotal: todayAppts.count ?? 0,
        todayConfirmed: (todayAppts.data as { status: string }[])?.filter(a => a.status === 'CONFIRMED').length ?? 0,
        todayWalkIns: (todayAppts.data as { status: string }[])?.filter(a => a.status === 'WALK_IN').length ?? 0,
        upcomingHomeVisits: upcomingHomeVisits.count ?? 0,
        availableSlotsToday: slotData.available.length,
    };
}

// ─── PATIENT LIST ─────────────────────────────────────────────────────────

export async function getPatientsAction(search?: string) {
    const supabase = createAdminClient();

    let query = supabase
        .from('patients')
        .select(`
      id, full_name, phone, email, created_at,
      appointments (
        appointment_date,
        service_type,
        status
      )
    `)
        .order('created_at', { ascending: false });

    if (search) {
        query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error } = await query.limit(100);
    if (error) return { success: false, error: error.message, data: [] };

    const patients = (data ?? []).map(p => ({
        ...p,
        updated_at: p.created_at, // Map to required field
        lastVisit: p.appointments?.at(-1)?.appointment_date ?? null,
        treatmentCategory: p.appointments?.at(-1)?.service_type ?? null,
    }));

    return { success: true, data: patients };
}
