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

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-healing-teal/20 rounded-full flex items-center justify-center mb-8 relative"
            >
                <div className="absolute inset-0 bg-healing-teal blur-2xl opacity-20 rounded-full animate-pulse"></div>
                <CheckCircle size={48} className="text-healing-teal relative z-10" />
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-2 text-center">Booking Confirmed!</h2>
            <p className="text-slate-400 mb-10 text-center max-w-md">
                Thank you, {patientDetails.name.split(' ')[0]}. Your appointment has been successfully scheduled. We've sent a confirmation email with details.
            </p>

            <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl mb-10">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 pb-4 border-b border-white/10">
                    Appointment Summary
                </h3>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/5 rounded-xl text-trust-blue">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Date</p>
                            <p className="text-lg font-medium text-white">{format(new Date(selectedDate), 'EEEE, MMMM do, yyyy')}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/5 rounded-xl text-healing-teal">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Time</p>
                            <p className="text-lg font-medium text-white">{selectedTime}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/5 rounded-xl text-purple-400">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Location</p>
                            <p className="text-lg font-medium text-white capitalize">{visitType === 'HOME' ? 'Home Visit' : 'Aligncare Clinic'}</p>
                            <p className="text-sm text-slate-400 capitalize">{serviceType?.replace('_', ' ')} Treatment</p>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleReturnHome}
                className="px-8 py-3 rounded-full font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all w-full md:w-auto"
            >
                Return to Home
            </button>
        </div>
    );
}
