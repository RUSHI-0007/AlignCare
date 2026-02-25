'use client';

import { useBookingStore } from '@/store/useBookingStore';
import { ServiceType, VisitType } from '@/types/appointment.types';
import { Activity, HeartPulse, Stethoscope, Home, Building2, LucideIcon } from 'lucide-react';

export default function ServiceSelect() {
    const { serviceType, setServiceType, visitType, setVisitType, nextStep } = useBookingStore();

    const services: { id: ServiceType; title: string; icon: LucideIcon; color: string }[] = [
        { id: 'PHYSIOTHERAPY', title: 'Physiotherapy', icon: Activity, color: 'from-blue-500/20 to-blue-500/5' },
        { id: 'CANCER_REHAB', title: 'Cancer Rehab', icon: HeartPulse, color: 'from-healing-teal/20 to-healing-teal/5' },
        { id: 'HOME_VISIT', title: 'Home Care', icon: Stethoscope, color: 'from-purple-500/20 to-purple-500/5' },
    ];

    const visits: { id: VisitType; title: string; icon: LucideIcon; desc: string }[] = [
        { id: 'CLINIC', title: 'Clinic Visit', icon: Building2, desc: 'Visit our state-of-the-art facility' },
        { id: 'HOME', title: 'Home Visit', icon: Home, desc: 'Premium care at your doorstep' },
    ];

    const isFormValid = serviceType && visitType;

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold mb-4 text-white">Select Treatment Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {services.map((service) => {
                        const Icon = service.icon;
                        const isSelected = serviceType === service.id;
                        return (
                            <button
                                key={service.id}
                                onClick={() => setServiceType(service.id)}
                                className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 border ${isSelected
                                    ? 'border-healing-teal bg-healing-teal/10 shadow-[0_0_20px_rgba(45,212,191,0.2)]'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <div className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-healing-teal/20 text-healing-teal' : 'bg-white/5 text-slate-400'}`}>
                                    <Icon size={24} />
                                </div>
                                <h4 className={`font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>{service.title}</h4>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4 text-white">Select Visit Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {visits.map((visit) => {
                        const Icon = visit.icon;
                        const isSelected = visitType === visit.id;
                        return (
                            <button
                                key={visit.id}
                                onClick={() => setVisitType(visit.id)}
                                className={`relative flex items-center gap-4 rounded-2xl p-6 text-left transition-all duration-300 border ${isSelected
                                    ? 'border-trust-blue bg-trust-blue/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-trust-blue/20 text-trust-blue' : 'bg-white/5 text-slate-400'}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h4 className={`font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>{visit.title}</h4>
                                    <p className="text-sm text-slate-400 mt-1">{visit.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    onClick={nextStep}
                    disabled={!isFormValid}
                    className={`px-8 py-3 rounded-full font-semibold transition-all shadow-lg flex items-center gap-2 ${isFormValid
                        ? 'bg-healing-teal hover:bg-[#20b8a5] text-primary-background shadow-[0_0_20px_rgba(45,212,191,0.3)]'
                        : 'bg-white/10 text-slate-500 cursor-not-allowed hidden'
                        }`}
                >
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}
