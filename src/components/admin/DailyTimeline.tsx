// src/components/admin/DailyTimeline.tsx
'use client';

import { motion } from 'framer-motion';
import { formatSlotDisplay } from '@/core/services/appointment.service';
import { useAdminStore } from '@/store/useAdminStore';
import AppointmentBlock from './AppointmentBlock';
import { Plus, Lock } from 'lucide-react';
import { AppointmentStatus, ServiceType } from '@/types/appointment.types';
import { useMemo } from 'react';

interface AppointmentType {
    id: string;
    appointment_time: string;
    status: AppointmentStatus;
    service_type: ServiceType;
    visit_type: string;
    notes?: string;
    patients?: { full_name: string; phone: string };
}

interface DailyTimelineProps {
    dateStr: string;
    appointments: AppointmentType[];
    allSlots: string[];
    bookedTimes: string[];
    blockedTimes: string[];
}

export default function DailyTimeline({ dateStr, appointments, allSlots, bookedTimes, blockedTimes }: DailyTimelineProps) {
    const openWalkInModal = useAdminStore((state) => state.openWalkInModal);

    // O(1) Lookups exactly as required by architecture
    const apptByTime = useMemo(() => {
        // DB returns '12:00:00' but slots are '12:00'
        return Object.fromEntries(appointments.map(a => [a.appointment_time.substring(0, 5), a]));
    }, [appointments]);

    const blockedSet = useMemo(() => new Set(blockedTimes), [blockedTimes]);

    const isSlotPast = (timeStr: string) => {
        const isoString = `${dateStr}T${timeStr}:00+05:30`;
        return new Date(isoString).getTime() < Date.now();
    };

    const morningSlots = allSlots.filter(s => parseInt(s.split(':')[0]) < 13);
    const eveningSlots = allSlots.filter(s => parseInt(s.split(':')[0]) >= 16);

    const validMorningSlots = morningSlots.filter(s => !isSlotPast(s) || apptByTime[s]);
    const validEveningSlots = eveningSlots.filter(s => !isSlotPast(s) || apptByTime[s]);

    const renderSlot = (timeStr: string, index: number) => {
        const isBlocked = blockedSet.has(timeStr);
        const appt = apptByTime[timeStr];

        if (isBlocked) {
            return (
                <motion.div
                    key={timeStr}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="flex flex-col justify-center items-center h-[160px] bg-rose-50 border border-rose-100 rounded-xl"
                >
                    <Lock className="w-5 h-5 text-rose-400 mb-2" />
                    <span className="text-slate-500 font-mono text-sm">{formatSlotDisplay(timeStr)}</span>
                    <span className="text-rose-600 text-xs font-medium uppercase tracking-wider mt-1">Blocked</span>
                </motion.div>
            );
        }

        if (appt) {
            return (
                <motion.div
                    key={timeStr}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="h-[160px]"
                >
                    <AppointmentBlock appointment={appt} />
                </motion.div>
            );
        }

        // Available State
        return (
            <motion.div
                key={timeStr}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => openWalkInModal(timeStr)}
                className="group cursor-pointer flex flex-col justify-center items-center h-[160px] bg-slate-50 border border-slate-200 rounded-xl hover:bg-teal-50 hover:border-teal-200 transition-all duration-300"
            >
                <span className="text-slate-700 font-mono text-sm mb-2 group-hover:text-teal-700 transition-colors">{formatSlotDisplay(timeStr)}</span>
                <div className="flex items-center space-x-1 text-slate-400 group-hover:text-teal-600 transition-colors">
                    <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-5 group-hover:ml-0" />
                    <span className="text-xs font-medium uppercase tracking-wider">Available</span>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900">Daily Timeline</h2>
                <button
                    onClick={() => openWalkInModal()}
                    className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors font-medium text-sm border border-indigo-200"
                >
                    <Plus className="w-4 h-4" />
                    <span>Quick Walk-in</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Morning Column */}
                <div>
                    <h3 className="text-slate-500 font-medium mb-6 flex items-center uppercase tracking-wider text-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-400 mr-2" />
                        Morning Shift
                    </h3>
                    {validMorningSlots.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {validMorningSlots.map((slot, i) => renderSlot(slot, i))}
                        </div>
                    ) : (
                        <div className="h-[160px] flex items-center justify-center bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                            <span className="text-slate-400 text-sm">No remaining slots</span>
                        </div>
                    )}
                </div>

                {/* Evening Column */}
                <div className="relative">
                    {/* Vertical Divider for Desktop */}
                    <div className="hidden lg:block absolute -left-6 top-0 bottom-0 w-px bg-slate-200" />

                    <h3 className="text-slate-500 font-medium mb-6 flex items-center uppercase tracking-wider text-sm">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2" />
                        Evening Shift
                    </h3>
                    {validEveningSlots.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {validEveningSlots.map((slot, i) => renderSlot(slot, i))}
                        </div>
                    ) : (
                        <div className="h-[160px] flex items-center justify-center bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                            <span className="text-slate-400 text-sm">No remaining slots</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
