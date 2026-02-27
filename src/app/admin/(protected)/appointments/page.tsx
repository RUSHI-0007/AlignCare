// src/app/admin/(protected)/appointments/page.tsx
export const dynamic = 'force-dynamic';

import { createAdminClient } from '@/core/db/supabase-server';
import { AppointmentStatus, ServiceType } from '@/types/appointment.types';
import { formatSlotDisplay } from '@/core/services/appointment.service';

interface AppointmentType {
    id: string;
    appointment_date: string;
    appointment_time: string;
    status: AppointmentStatus;
    service_type: ServiceType;
    visit_type: string;
    notes?: string;
    patients?: { full_name: string; phone: string };
}

export default async function AppointmentsPage() {
    const supabase = createAdminClient();

    // Fetch upcoming appointments (today and future) using exact IST matching
    const { getTodayIST } = await import('@/core/services/appointment.service');
    const todayStr = getTodayIST();

    const { data: appointments } = await supabase
        .from('appointments')
        .select(`
            id,
            appointment_date,
            appointment_time,
            status,
            service_type,
            visit_type,
            notes,
            patients!inner (
                full_name,
                phone
            )
        `)
        .gte('appointment_date', todayStr)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(50) as { data: AppointmentType[] | null, error: any };

    // We don't have access to the raw error directly via destructuring `data: appointments` safely here, 
    // so just log the data for now. We can capture error if we don't destructure.

    const serviceColors: Record<string, string> = {
        PHYSIOTHERAPY: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        CANCER_REHAB: 'bg-rose-50 text-rose-700 border-rose-200',
        HOME_VISIT: 'bg-blue-50 text-blue-700 border-blue-200',
    };

    const statusColors: Record<string, string> = {
        CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
        CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
        COMPLETED: 'bg-slate-100 text-slate-700 border-slate-200',
        WALK_IN: 'bg-teal-50 text-teal-700 border-teal-200',
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage all upcoming clinic and home visits</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {appointments && appointments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Patient Data</th>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {appointments.map((appt) => {
                                    const dateObj = new Date(appt.appointment_date);
                                    const formattedDate = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

                                    return (
                                        <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{formattedDate}</div>
                                                <div className="text-slate-500 font-mono text-xs mt-1">{formatSlotDisplay(appt.appointment_time)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{appt.patients?.full_name || 'Unknown'}</div>
                                                <div className="text-slate-500 text-xs mt-1">{appt.patients?.phone || 'No Phone'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border ${serviceColors[appt.service_type] || 'bg-slate-100 text-slate-700'}`}>
                                                    {appt.service_type.replace('_', ' ')}
                                                </span>
                                                {appt.visit_type === 'HOME' && (
                                                    <span className="ml-2 text-[10px] uppercase font-bold px-2 py-1 rounded-md border bg-blue-50 text-blue-700 border-blue-200">
                                                        Home Visit
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${statusColors[appt.status] || 'bg-slate-100 text-slate-700'}`}>
                                                    {appt.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <p className="text-slate-500">No upcoming appointments found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
