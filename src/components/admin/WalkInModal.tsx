// src/components/admin/WalkInModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/store/useAdminStore';
import { X, UserPlus, Loader2 } from 'lucide-react';
import { formatSlotDisplay } from '@/core/services/appointment.service';
import { addWalkInAction } from '@/core/actions/admin.actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { generateRawSlots } from '@/core/services/appointment.service';

interface WalkInModalProps {
    dateStr: string;
    bookedTimes: string[];
    blockedTimes: string[];
}

export default function WalkInModal({ dateStr, bookedTimes, blockedTimes }: WalkInModalProps) {
    const router = useRouter();
    const { isWalkInModalOpen, closeWalkInModal, preSelectedTimeForWalkIn } = useAdminStore();

    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [patientName, setPatientName] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [serviceType, setServiceType] = useState<'PHYSIOTHERAPY' | 'CANCER_REHAB' | 'HOME_VISIT'>('PHYSIOTHERAPY');

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Reset state when modal opens
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (isWalkInModalOpen) {
            const firstAvail = generateRawSlots().find(s => !bookedTimes.includes(s) && !blockedTimes.includes(s));
            setSelectedTime(preSelectedTimeForWalkIn || firstAvail || null);
            setPatientName('');
            setPatientPhone('');
            setNotes('');
            setServiceType('PHYSIOTHERAPY');
            setStatus('idle');
            setErrorMessage('');
        }
    }, [isWalkInModalOpen, preSelectedTimeForWalkIn, bookedTimes, blockedTimes]);

    // Derived from the array so we can show morning vs evening visually
    const allSlots = generateRawSlots(); // render all, disable unavailable
    const morningSlots = allSlots.filter(s => parseInt(s) < 13);
    const eveningSlots = allSlots.filter(s => parseInt(s) >= 16);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTime || patientName.length < 2 || patientPhone.length !== 10) return;

        setStatus('loading');

        const result = await addWalkInAction({
            dateStr,
            timeStr: selectedTime,
            patientName,
            patientPhone: `+91${patientPhone}`,
            serviceType,
            notes,
        });

        if (result.success) {
            setStatus('success');
            router.refresh();
            setTimeout(() => {
                closeWalkInModal();
            }, 1500);
        } else {
            setStatus('error');
            const errMap: Record<string, string> = {
                'SLOT_TAKEN': 'This slot is no longer available.',
                'SLOT_JUST_TAKEN': 'That slot was just taken — please select another.',
                'INVALID_SLOT': 'Invalid time slot selected.',
                'SERVER_ERROR': 'Something went wrong. Please try again.',
            };
            setErrorMessage(errMap[result.error as string] || result.error || 'Failed to add walk-in');
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length <= 10) setPatientPhone(val);
    };

    if (!isWalkInModalOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeWalkInModal}
                    className="absolute inset-0 bg-[#0B1120]/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 20, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Add Walk-in</h3>
                                <p className="text-xs text-slate-500">
                                    {new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={closeWalkInModal}
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        {status === 'success' ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6"
                                >
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2">Walk-in Confirmed</h4>
                                <p className="text-slate-500">Patient has been added to the timeline.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Slot Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Select Time Slot</label>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Morning</p>
                                            <div className="grid grid-cols-4 gap-2">
                                                {morningSlots.map(slot => {
                                                    const isAvail = !bookedTimes.includes(slot) && !blockedTimes.includes(slot);
                                                    const isSelected = selectedTime === slot;
                                                    return (
                                                        <button
                                                            key={slot}
                                                            type="button"
                                                            disabled={!isAvail}
                                                            onClick={() => setSelectedTime(slot)}
                                                            className={cn(
                                                                "py-2 text-xs font-mono font-medium rounded-lg border transition-all",
                                                                isSelected
                                                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                                                    : isAvail
                                                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                                                        : "bg-rose-50 border-rose-100 text-rose-400 cursor-not-allowed opacity-50"
                                                            )}
                                                        >
                                                            {formatSlotDisplay(slot)}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Evening</p>
                                            <div className="grid grid-cols-4 gap-2">
                                                {eveningSlots.map(slot => {
                                                    const isAvail = !bookedTimes.includes(slot) && !blockedTimes.includes(slot);
                                                    const isSelected = selectedTime === slot;
                                                    return (
                                                        <button
                                                            key={slot}
                                                            type="button"
                                                            disabled={!isAvail}
                                                            onClick={() => setSelectedTime(slot)}
                                                            className={cn(
                                                                "py-2 text-xs font-mono font-medium rounded-lg border transition-all",
                                                                isSelected
                                                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                                                    : isAvail
                                                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                                                        : "bg-rose-50 border-rose-100 text-rose-400 cursor-not-allowed opacity-50"
                                                            )}
                                                        >
                                                            {formatSlotDisplay(slot)}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="patientName"
                                            required
                                            value={patientName}
                                            onChange={(e) => setPatientName(e.target.value)}
                                            className="block w-full px-4 pt-6 pb-2 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-indigo-500 peer transition-colors"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="patientName"
                                            className="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-indigo-600"
                                        >
                                            Patient Full Name
                                        </label>
                                    </div>

                                    <div className="relative">
                                        <span className="absolute left-4 top-4 text-slate-400">+91</span>
                                        <input
                                            type="tel"
                                            id="patientPhone"
                                            required
                                            value={patientPhone}
                                            onChange={handlePhoneChange}
                                            className="block w-full pl-12 pr-4 pt-6 pb-2 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-indigo-500 peer transition-colors"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="patientPhone"
                                            className="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-indigo-600"
                                        >
                                            Phone Number
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Service Type</label>
                                        <select
                                            value={serviceType}
                                            onChange={(e) => setServiceType(e.target.value as any)}
                                            className="block w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                                        >
                                            <option value="PHYSIOTHERAPY" className="bg-white text-slate-900">Physiotherapy</option>
                                            <option value="CANCER_REHAB" className="bg-white text-slate-900">Cancer Rehab</option>
                                        </select>
                                    </div>

                                    <div className="relative">
                                        <textarea
                                            id="notes"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={2}
                                            className="block w-full px-4 pt-6 pb-2 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-indigo-500 peer transition-colors resize-none custom-scrollbar"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="notes"
                                            className="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-indigo-600"
                                        >
                                            Admin Notes (Optional)
                                        </label>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {status === 'error' && errorMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                                        >
                                            {errorMessage}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={status === 'loading' || !selectedTime || patientName.length < 2 || patientPhone.length !== 10}
                                        className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {status === 'loading' ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            'Confirm Walk-in Appointment'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
