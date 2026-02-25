// src/core/services/appointment_db.service.ts
import { createClient } from '@/core/db/supabase-server';
import { getAvailableSlots, generateRawSlots } from './appointment.service';

/**
 * getBookedTimesFromDB()
 * Fetches all non-cancelled appointment times for a date.
 * Returns array of "HH:MM" strings for fast Set comparison.
 */
export async function getBookedTimesFromDB(dateStr: string): Promise<string[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('appointment_date', dateStr)
        .not('status', 'eq', 'CANCELLED');

    if (error) throw new Error(`DB_ERROR getBooked: ${error.message}`);
    return (data ?? []).map((r: { appointment_time: string }) => r.appointment_time);
}

/**
 * getBlockedTimesFromDB()
 * Fetches all manually blocked slot times for a date.
 */
export async function getBlockedTimesFromDB(dateStr: string): Promise<string[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('blocked_slots')
        .select('slot_time')
        .eq('slot_date', dateStr);

    if (error) throw new Error(`DB_ERROR getBlocked: ${error.message}`);
    return (data ?? []).map((r: { slot_time: string }) => r.slot_time);
}

/**
 * getAvailableSlotsForDate()
 * --------------------------
 * THE PUBLIC COMPOSITE FUNCTION — used by booking wizard, admin dashboard, and AI webhook.
 * Returns a rich object with all slot categories for easy UI rendering.
 *
 * Admin view:  use `all` + `booked` + `blocked` to color each slot.
 * Client view: use `available` only.
 */
export async function getAvailableSlotsForDate(dateStr: string): Promise<{
    available: string[];
    booked: string[];
    blocked: string[];
    all: string[];
}> {
    const [bookedTimes, blockedTimes] = await Promise.all([
        getBookedTimesFromDB(dateStr),
        getBlockedTimesFromDB(dateStr),
    ]);

    return {
        available: getAvailableSlots(dateStr, bookedTimes, blockedTimes),
        booked: bookedTimes,
        blocked: blockedTimes,
        all: generateRawSlots(),
    };
}
