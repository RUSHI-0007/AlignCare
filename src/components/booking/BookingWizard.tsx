'use client';

import { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/useBookingStore';
import { motion, AnimatePresence } from 'framer-motion';

import ServiceSelect from './steps/ServiceSelect';
import TimePicker from './steps/TimePicker';
import PatientForm from './steps/PatientForm';
import BookingConfirmation from './steps/BookingConfirmation';

const steps = [
    { id: 1, title: 'Service' },
    { id: 2, title: 'Date & Time' },
    { id: 3, title: 'Details' },
    { id: 4, title: 'Done' }
];

export default function BookingWizard() {
    const { step } = useBookingStore();
    const [isClient, setIsClient] = useState(false);

    // prevent hydration mismatch since store initializes on client
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div className="w-full max-w-4xl mx-auto">

            {/* Progress Bar */}
            <div className="mb-12">
                <div className="flex justify-between items-center relative z-10 px-4 md:px-12">
                    {steps.map((s, idx) => {
                        const isActive = step === s.id;
                        const isCompleted = step > s.id;
                        return (
                            <div key={s.id} className="flex flex-col items-center gap-3 relative z-10">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-2 ${isActive
                                        ? 'bg-primary-background border-healing-teal text-healing-teal shadow-[0_0_15px_rgba(45,212,191,0.5)]'
                                        : isCompleted
                                            ? 'bg-healing-teal border-healing-teal text-primary-background'
                                            : 'bg-secondary-card border-white/10 text-slate-500'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg>
                                    ) : (
                                        s.id
                                    )}
                                </div>
                                <span className={`text-xs md:text-sm font-medium absolute top-14 whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                    {s.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Connecting Lines */}
                <div className="h-1 bg-white/10 absolute top-[112px] md:top-[128px] left-[10%] right-[10%] -z-0 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-healing-teal shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(step - 1) * 33.33}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </div>

            {/* Form Content Area */}
            <div className="relative overflow-hidden min-h-[500px] mt-20 md:mt-16 w-full">
                <AnimatePresence mode="wait" initial={false}>
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-100%', opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="absolute inset-0"
                        >
                            <ServiceSelect />
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-100%', opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="absolute inset-0"
                        >
                            <TimePicker />
                        </motion.div>
                    )}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-100%', opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="absolute inset-0 z-10" // need z-10 here for inputs to be clickable above absolutely positioned wrappers
                        >
                            <PatientForm />
                        </motion.div>
                    )}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="absolute inset-0"
                        >
                            <BookingConfirmation />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
