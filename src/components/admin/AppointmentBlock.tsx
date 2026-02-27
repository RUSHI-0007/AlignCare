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

    let containerClasses = "relative flex flex-col p-4 rounded-xl border transition-all duration-300 group h-full shadow-sm hover:shadow-md ";
    if (isConfirmed) containerClasses += "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg";
    else if (isWalkIn) containerClasses += "bg-teal-50 border-teal-200 hover:border-teal-300";
    else if (isCompleted) containerClasses += "bg-slate-50 border-slate-200 opacity-60";
    else containerClasses += "bg-white border-slate-200"; // Fallback

    const serviceColors: Record<string, string> = {
        PHYSIOTHERAPY: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        CANCER_REHAB: 'bg-rose-50 text-rose-700 border-rose-200',
        HOME_VISIT: 'bg-blue-50 text-blue-700 border-blue-200',
    };

    return (
        <div className={containerClasses}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-slate-900 font-medium">
                        {formatSlotDisplay(appointment.appointment_time)}
                    </span>
                    {isWalkIn && (
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 border border-teal-200">
                            Walk-in
                        </span>
                    )}
                </div>

                {/* Action Button - Reveal on hover */}
                {(isConfirmed || isWalkIn) && (
                    <button
                        onClick={handleCancel}
                        disabled={isCancelling}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                        title="Cancel Appointment"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex-1">
                <h4 className="text-slate-900 font-medium mb-1 truncate">
                    {appointment.patients?.full_name || 'Unknown Patient'}
                </h4>
                <div className="flex items-center space-x-2 mb-2">
                    {appointment.patients?.phone && (
                        <a
                            href={`tel:${appointment.patients.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-slate-500 flex items-center space-x-1 hover:text-indigo-600 transition-colors"
                        >
                            <Phone className="w-3 h-3" />
                            <span>{appointment.patients.phone}</span>
                        </a>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mt-2 pt-1">
                    <span className={`text-[10px] uppercase font-semibold px-2 py-1 rounded-md border ${serviceColors[appointment.service_type] || 'bg-slate-100 text-slate-700'}`}>
                        {appointment.service_type.replace('_', ' ')}
                    </span>
                    {appointment.visit_type === 'HOME' && (
                        <span className="text-[10px] uppercase font-semibold px-2 py-1 rounded-md border bg-blue-50 text-blue-700 border-blue-200">
                            Home Visit
                        </span>
                    )}
                </div>
            </div>

            {appointment.notes && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 line-clamp-2">
                    {appointment.notes}
                </div>
            )}
        </div>
    );
}
