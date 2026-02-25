// src/app/api/webhooks/ai-agent/route.ts
// Future WhatsApp bot / AI assistant entry point.
// The AI calls the SAME service layer as the web UI.
// It is IMPOSSIBLE for the AI to book a 2 PM slot or bypass the 9-1 / 4-7 rules.

import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { formatSlotDisplay } from '@/core/services/appointment.service';
import { getAvailableSlotsForDate } from '@/core/services/appointment_db.service';
import { createAppointmentAction } from '@/core/actions/booking.actions';

function verifySignature(body: string, signature: string): boolean {
    if (!process.env.WEBHOOK_SECRET) {
        if (process.env.NODE_ENV === 'development') {
            console.warn("⚠️ WEBHOOK_SECRET is not set. Allowing request in development mode.");
            return true;
        }
        return false; // MUST fail in production if no secret is established
    }

    const expected = `sha256=${createHmac('sha256', process.env.WEBHOOK_SECRET).update(body).digest('hex')}`;
    return expected === signature;
}

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        if (!verifySignature(rawBody, req.headers.get('x-webhook-signature') ?? '')) {
            return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
        }

        const body = JSON.parse(rawBody);

        if (body.intent === 'CHECK_AVAILABILITY') {
            const slots = await getAvailableSlotsForDate(body.date);
            return NextResponse.json({
                available: slots.available,
                available_display: slots.available.map(formatSlotDisplay),
                morning: slots.available.filter(s => parseInt(s) < 13).map(formatSlotDisplay),
                evening: slots.available.filter(s => parseInt(s) >= 16).map(formatSlotDisplay),
            });
        }

        if (body.intent === 'BOOK_APPOINTMENT') {
            const result = await createAppointmentAction({
                dateStr: body.date,
                timeStr: body.time,
                serviceType: body.service_type ?? 'PHYSIOTHERAPY',
                visitType: 'CLINIC',
                patientDetails: { name: body.patient_name, phone: body.patient_phone },
            });
            return NextResponse.json(result);
        }

        return NextResponse.json({ error: 'UNKNOWN_INTENT' }, { status: 400 });

    } catch (err) {
        console.error('[ai-webhook]', err);
        return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
    }
}
