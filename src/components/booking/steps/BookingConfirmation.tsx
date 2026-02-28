'use client';

import { useBookingStore } from '@/store/useBookingStore';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function BookingConfirmation() {
    const { selectedDate, selectedTime, serviceType, visitType, patientDetails, resetBooking } = useBookingStore();
    const router = useRouter();

    const handleReturnHome = () => {
        resetBooking();
        router.push('/');
    };

    if (!selectedDate || !selectedTime) return null;

    // Parse securely to avoid timezone shifts when displaying the formatted string
    const getLocalDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 relative"
            >
                <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                <CheckCircle size={48} className="text-emerald-500 relative z-10" />
            </motion.div>

            <h2 className="text-3xl font-bold text-clinic-navy mb-2 text-center">Booking Confirmed!</h2>
            <p className="text-clinic-muted mb-10 text-center max-w-md">
                Thank you, {patientDetails.name.split(' ')[0]}. Your appointment has been successfully scheduled. We've sent a confirmation email with details.
            </p>

            <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-3xl p-6 mb-10">
                <h3 className="text-sm font-semibold text-clinic-muted uppercase tracking-wider mb-6 pb-4 border-b border-[#E2E8F0]">
                    Appointment Summary
                </h3>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-clinic-blue-50 rounded-xl text-clinic-blue-600">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-clinic-muted mb-1">Date</p>
                            <p className="text-lg font-medium text-clinic-navy">{format(getLocalDate(selectedDate), 'EEEE, MMMM do, yyyy')}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-clinic-muted mb-1">Time</p>
                            <p className="text-lg font-medium text-clinic-navy">{selectedTime}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-clinic-muted mb-1">Location</p>
                            <p className="text-lg font-medium text-clinic-navy capitalize">{visitType === 'HOME' ? 'Home Visit' : 'Aligncare Clinic'}</p>
                            <p className="text-sm text-clinic-muted capitalize">{serviceType?.replace('_', ' ')} Treatment</p>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleReturnHome}
                className="px-8 py-3 rounded-full font-semibold bg-white border border-[#E2E8F0] hover:bg-slate-50 text-clinic-navy transition-all shadow-sm hover:shadow-md w-full md:w-auto"
            >
                Return to Home
            </button>
        </div>
    );
}
