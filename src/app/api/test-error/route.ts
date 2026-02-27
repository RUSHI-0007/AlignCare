import { NextResponse } from 'next/server';
import { createAppointmentAction } from '@/core/actions/booking.actions';

export async function GET() {
    const res = await createAppointmentAction({
        dateStr: '2026-03-01',
        timeStr: '10:00',
        serviceType: 'PHYSIOTHERAPY',
        visitType: 'CLINIC',
        patientDetails: {
            name: 'june',
            phone: '1234567890',
            email: 'june@123',
            notes: 'back pain'
        }
    });

    return NextResponse.json(res);
}
