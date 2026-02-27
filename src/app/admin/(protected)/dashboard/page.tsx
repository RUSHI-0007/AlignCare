// src/app/(admin)/dashboard/page.tsx
export const dynamic = 'force-dynamic';

import { getDashboardStatsAction, getAppointmentsForDateAction } from '@/core/actions/admin.actions';
import { getTodayIST } from '@/core/services/appointment.service';
import { getAvailableSlotsForDate } from '@/core/services/appointment_db.service';
import StatCard from '@/components/admin/StatCard';
import DailyTimeline from '@/components/admin/DailyTimeline';
import WalkInModal from '@/components/admin/WalkInModal';

export default async function DashboardPage() {
    const today = getTodayIST();

    const [stats, appointmentsResult, slotData] = await Promise.all([
        getDashboardStatsAction(),
        getAppointmentsForDateAction(today),
        getAvailableSlotsForDate(today),
    ]);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {new Date().toLocaleDateString('en-IN', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            timeZone: 'Asia/Kolkata',
                        })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Today's Appointments"
                    value={stats.todayTotal}
                    subtext={`${stats.todayConfirmed} confirmed · ${stats.todayWalkIns} walk-ins`}
                    accent="teal"
                    icon="calendar"
                />
                <StatCard
                    title="Upcoming Home Visits"
                    value={stats.upcomingHomeVisits}
                    subtext="Next 7 days"
                    accent="blue"
                    icon="home"
                />
                <StatCard
                    title="Available Slots Today"
                    value={stats.availableSlotsToday}
                    subtext="of 14 total clinic slots"
                    accent={stats.availableSlotsToday > 3 ? 'green' : stats.availableSlotsToday > 0 ? 'amber' : 'red'}
                    icon="clock"
                />
            </div>

            <DailyTimeline
                dateStr={today}
                appointments={appointmentsResult.data ?? []}
                allSlots={slotData.all}
                bookedTimes={slotData.booked}
                blockedTimes={slotData.blocked}
            />

            {/* WalkInModal is client-side, reads from useAdminStore */}
            <WalkInModal bookedTimes={slotData.booked} blockedTimes={slotData.blocked} dateStr={today} />
        </div>
    );
}
