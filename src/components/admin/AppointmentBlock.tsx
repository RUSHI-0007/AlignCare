// src/components/admin/AppointmentBlock.tsx
'use client';

import { Phone, Trash2 } from 'lucide-react';
import { AppointmentStatus, ServiceType } from '@/types/appointment.types';
import { formatSlotDisplay } from '@/core/services/appointment.service';
import { cancelAppointmentAction } from '@/core/actions/admin.actions';
import { useState } from 'react';

interface AppointmentBlockProps {
    appointment: {
        id: string;
        appointment_time: string;
        status: AppointmentStatus;
        service_type: ServiceType;
        visit_type: string;
        notes?: string;
        patients?: { full_name: string; phone: string };
    };
}

export default function AppointmentBlock({ appointment }: AppointmentBlockProps) {
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancel = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to cancel ${appointment.patients?.full_name}'s appointment?`)) {
            setIsCancelling(true);
            await cancelAppointmentAction(appointment.id);
            setIsCancelling(false);
        }
    };

    const isConfirmed = appointment.status === 'CONFIRMED';
    const isWalkIn = appointment.status === 'WALK_IN';
    const isCompleted = appointment.status === 'COMPLETED';

    let containerClasses = "relative flex flex-col p-4 rounded-xl border transition-all duration-300 group h-full ";
    if (isConfirmed) containerClasses += "bg-[#111827] border-white/20 hover:border-white/30 hover:bg-[#111827]/90";
    else if (isWalkIn) containerClasses += "bg-[#2DD4BF]/5 border-[#2DD4BF]/20 hover:border-[#2DD4BF]/40";
    else if (isCompleted) containerClasses += "bg-white/5 border-white/10 opacity-60";
    else containerClasses += "bg-white/5 border-white/10"; // Fallback

    const serviceColors: Record<string, string> = {
        PHYSIOTHERAPY: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        CANCER_REHAB: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        HOME_VISIT: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };

    return (
        <div className={containerClasses}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-[#F8FAFC] font-medium">
                        {formatSlotDisplay(appointment.appointment_time)}
                    </span>
                    {isWalkIn && (
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#2DD4BF]/20 text-[#2DD4BF]">
                            Walk-in
                        </span>
                    )}
                </div>

                {/* Action Button - Reveal on hover */}
                {(isConfirmed || isWalkIn) && (
                    <button
                        onClick={handleCancel}
                        disabled={isCancelling}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#94A3B8] hover:text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                        title="Cancel Appointment"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex-1">
                <h4 className="text-[#F8FAFC] font-medium mb-1 truncate">
                    {appointment.patients?.full_name || 'Unknown Patient'}
                </h4>
                <div className="flex items-center space-x-2 mb-2">
                    {appointment.patients?.phone && (
                        <a
                            href={`tel:${appointment.patients.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-[#94A3B8] flex items-center space-x-1 hover:text-[#2DD4BF] transition-colors"
                        >
                            <Phone className="w-3 h-3" />
                            <span>{appointment.patients.phone}</span>
                        </a>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mt-2 pt-1">
                    <span className={`text-[10px] uppercase font-semibold px-2 py-1 rounded-md border ${serviceColors[appointment.service_type] || 'bg-white/10 text-white'}`}>
                        {appointment.service_type.replace('_', ' ')}
                    </span>
                    {appointment.visit_type === 'HOME' && (
                        <span className="text-[10px] uppercase font-semibold px-2 py-1 rounded-md border bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20">
                            Home Visit
                        </span>
                    )}
                </div>
            </div>

            {appointment.notes && (
                <div className="mt-3 pt-3 border-t border-white/5 text-xs text-[#94A3B8] line-clamp-2">
                    {appointment.notes}
                </div>
            )}
        </div>
    );
}
