// src/core/services/appointment.service.ts
// ============================================================
// AI-READY SERVICE LAYER
// Called by: Web UI, Admin Dashboard, AI Webhooks
// All business rules live here. Nothing else needs to know them.
// ============================================================

// ─── CLINIC CONSTANTS ─────────────────────────────────────────────────────

const MORNING_SHIFT_HOURS = [9, 10, 11, 12];
const EVENING_SHIFT_HOURS = [16, 17, 18];
const IST_OFFSET_MINUTES = 330; // UTC+5:30

// ✅ CORRECTED: Named constant — never hardcode 120 anywhere else in the codebase.
// Change this one value to update the buffer platform-wide.
export const BOOKING_LEAD_TIME_MINUTES = 120; // 2-hour minimum buffer for public bookings

// ─── IST TIME UTILITIES ───────────────────────────────────────────────────

/**
 * getNowIST()
 * Returns current time as a Date normalized to IST.
 * MUST be used for all time comparisons — Vercel/Node servers run UTC.
 * Using new Date() directly will produce wrong slot filtering for Indian users.
 */
export function getNowIST(): Date {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utcMs + IST_OFFSET_MINUTES * 60000);
}

/**
 * getTodayIST()
 * Returns today's date string in YYYY-MM-DD format, normalized to IST.
 */
export function getTodayIST(): string {
    const ist = getNowIST();
    const y = ist.getFullYear();
    const m = String(ist.getMonth() + 1).padStart(2, '0');
    const d = String(ist.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * slotToMinutes()
 * Converts "HH:MM" to total minutes since midnight for arithmetic comparison.
 */
function slotToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

// ─── SLOT GENERATION ──────────────────────────────────────────────────────

/**
 * generateRawSlots()
 * ------------------
 * Produces all valid 30-min clinic slots for any date.
 *
 * DEAD ZONE RULE: Hours 13, 14, 15 are NEVER in the shift arrays.
 * The loop never generates them. It is mathematically impossible
 * for a 1 PM, 2 PM, or 3 PM slot to appear. No filtering needed.
 *
 * Returns: ['09:00','09:30','10:00','10:30','11:00','11:30',
 *           '12:00','12:30','16:00','16:30','17:00','17:30','18:00','18:30']
 */
export function generateRawSlots(): string[] {
    const slots: string[] = [];
    for (const hour of [...MORNING_SHIFT_HOURS, ...EVENING_SHIFT_HOURS]) {
        slots.push(`${String(hour).padStart(2, '0')}:00`);
        slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
    return slots;
}

/**
 * filterPastSlots()
 * -----------------
 * For same-day bookings: strips slots that are in the past or within the
 * booking lead time buffer.
 *
 * ✅ CORRECTED: Default is BOOKING_LEAD_TIME_MINUTES (120), not 30.
 * Public booking wizard gets the 2-hour buffer automatically.
 * Pass bufferMinutes = 0 only when doing exact past-time validation.
 *
 * SERVER RULE: This runs AGAIN in validateSlotOrThrow before every DB write.
 * Client-side filtering is UX convenience only — not the security gate.
 *
 * @param slots         - Array of "HH:MM" strings to filter
 * @param dateStr       - Target date "YYYY-MM-DD"
 * @param bufferMinutes - Lead time required (default: BOOKING_LEAD_TIME_MINUTES)
 */
export function filterPastSlots(
    slots: string[],
    dateStr: string,
    bufferMinutes = BOOKING_LEAD_TIME_MINUTES // ✅ CORRECTED default
): string[] {
    const todayIST = getTodayIST();
    if (dateStr !== todayIST) return slots; // Future date — nothing to filter

    const nowIST = getNowIST(); // ✅ Always IST, never new Date()
    const currentMinutes = nowIST.getHours() * 60 + nowIST.getMinutes();
    const cutoff = currentMinutes + bufferMinutes;

    return slots.filter(slot => slotToMinutes(slot) > cutoff);
}

/**
 * getAvailableSlots()
 * -------------------
 * Pure function — no DB calls. Used internally and for unit testing.
 * Returns slots that are: valid clinic hours + beyond buffer + not booked + not blocked.
 *
 * @param dateStr      - Target date
 * @param bookedTimes  - "HH:MM" strings already in DB as booked
 * @param blockedTimes - "HH:MM" strings manually blocked by admin
 */
export function getAvailableSlots(
    dateStr: string,
    bookedTimes: string[],
    blockedTimes: string[]
): string[] {
    const rawSlots = generateRawSlots();
    const futureOnly = filterPastSlots(rawSlots, dateStr); // Uses 120-min buffer by default
    const takenSet = new Set([...bookedTimes, ...blockedTimes]);
    return futureOnly.filter(slot => !takenSet.has(slot));
}

/**
 * validateSlotOrThrow()
 * ---------------------
 * ✅ CORRECTED: Includes options.skipPastCheck for admin walk-in bypass.
 *
 * SERVER-SIDE GATE — called in every Server Action before any DB write.
 * Throws typed error strings. Never silently fails.
 *
 * Public booking:  options = {} (default) → 2-hour buffer enforced
 * Admin walk-in:   options = { skipPastCheck: true } → buffer bypassed
 *                  (Admin can book current slot — patient is physically present)
 *
 * @param dateStr      - Target date "YYYY-MM-DD"
 * @param timeStr      - Target time "HH:MM"
 * @param bookedTimes  - Current bookings from DB
 * @param blockedTimes - Current blocks from DB
 * @param options      - { skipPastCheck?: boolean }
 */
export function validateSlotOrThrow(
    dateStr: string,
    timeStr: string,
    bookedTimes: string[],
    blockedTimes: string[],
    options: { skipPastCheck?: boolean } = {}
): void {
    const validSlots = generateRawSlots();

    // Rule 1: Must be a real clinic slot (dead zone + shift validation)
    if (!validSlots.includes(timeStr)) {
        throw new Error(`INVALID_SLOT: "${timeStr}" is not a valid clinic slot on ${dateStr}`);
    }

    // Rule 2: Must not be in the past or within the lead time buffer
    // Skipped entirely for admin walk-ins (skipPastCheck: true)
    if (!options.skipPastCheck) {
        // Pass bufferMinutes = 0 here — we use the exact moment, 
        // not the default 120-min buffer, because we want to check
        // against the raw current time at submission moment.
        const remaining = filterPastSlots([timeStr], dateStr, 0);
        if (remaining.length === 0) {
            throw new Error(`PAST_SLOT: "${timeStr}" on ${dateStr} has already passed`);
        }
        // Also enforce the 2-hour lead time buffer for public bookings
        const withBuffer = filterPastSlots([timeStr], dateStr, BOOKING_LEAD_TIME_MINUTES);
        if (withBuffer.length === 0) {
            throw new Error(`BUFFER_VIOLATION: "${timeStr}" is within the ${BOOKING_LEAD_TIME_MINUTES}-minute booking window`);
        }
    }

    // Rule 3: Must not already be taken
    if (new Set([...bookedTimes, ...blockedTimes]).has(timeStr)) {
        throw new Error(`SLOT_TAKEN: "${timeStr}" on ${dateStr} is not available`);
    }
}

/**
 * getShiftForTime()
 * Returns 'MORNING' or 'EVENING' for a given "HH:MM" string.
 * Used to denormalize shift into the appointments table for fast queries.
 */
export function getShiftForTime(timeStr: string): 'MORNING' | 'EVENING' | null {
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (MORNING_SHIFT_HOURS.includes(hour)) return 'MORNING';
    if (EVENING_SHIFT_HOURS.includes(hour)) return 'EVENING';
    return null;
}

/**
 * formatSlotDisplay()
 * Converts "HH:MM" 24hr to "H:MM AM/PM" for UI display.
 * e.g. "16:30" → "4:30 PM"
 */
export function formatSlotDisplay(timeStr: string): string {
    const [h, m] = timeStr.split(':').map(Number);
    const period = h < 12 ? 'AM' : 'PM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

// ─── END OF FILE ───────────────────────────────────────────────

