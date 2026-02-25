'use client';

import { useState } from 'react';
import { useBookingStore } from '@/store/useBookingStore';
import { confirmBooking } from '@/core/actions/booking.actions';
import { User, Phone, Mail, FileText } from 'lucide-react';

export default function PatientForm() {
    const {
        patientDetails,
        setPatientDetails,
        nextStep,
        prevStep,
        serviceType,
        visitType,
        selectedDate,
        selectedTime
    } = useBookingStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPatientDetails({ [name]: value });
    };

    const isFormValid =
        patientDetails.name.length > 2 &&
        patientDetails.phone.length > 7 &&
        (patientDetails.email?.includes('@') ?? false);

    const handleSubmit = async () => {
        if (!isFormValid) return;

        if (!serviceType || !visitType || !selectedDate || !selectedTime) {
            setError('Missing required booking details. Please go back and select them.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        // Prepare full payload
        const payload = {
            serviceType,
            visitType,
            date: selectedDate,
            time: selectedTime,
            patient: patientDetails
        };

        try {
            const res = await confirmBooking(payload);
            if (res.success) {
                // Proceed to confirmation screen
                nextStep();
            } else {
                setError('Failed to secure appointment. Please try again.');
                setIsSubmitting(false);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <h3 className="text-2xl font-semibold mb-6 text-white text-center">Patient Details</h3>

                {error && (
                    <div className="p-4 mb-6 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-healing-teal transition-colors">
                            <User size={20} />
                        </div>
                        <input
                            type="text"
                            name="name"
                            value={patientDetails.name}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-healing-teal focus:ring-1 focus:ring-healing-teal transition-all placeholder:text-slate-500"
                            placeholder="Full Legal Name"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-trust-blue transition-colors">
                                <Phone size={20} />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                value={patientDetails.phone}
                                onChange={handleInputChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-trust-blue focus:ring-1 focus:ring-trust-blue transition-all placeholder:text-slate-500"
                                placeholder="Phone Number"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-healing-teal transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={patientDetails.email}
                                onChange={handleInputChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-healing-teal focus:ring-1 focus:ring-healing-teal transition-all placeholder:text-slate-500"
                                placeholder="Email Address"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute top-4 left-0 pl-4 pointer-events-none text-slate-400 group-focus-within:text-white transition-colors">
                            <FileText size={20} />
                        </div>
                        <textarea
                            name="issue"
                            value={patientDetails.issue}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-slate-500 resize-none custom-scrollbar"
                            placeholder="Briefly describe your symptoms or reason for visit (optional)"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-white/10">
                <button
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-full font-medium transition-all border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isSubmitting}
                    className={`px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${isFormValid && !isSubmitting
                        ? 'bg-healing-teal hover:bg-[#20b8a5] text-primary-background shadow-[0_0_20px_rgba(45,212,191,0.4)]'
                        : 'bg-white/10 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-t-2 border-primary-background rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        'Confirm Appointment'
                    )}
                </button>
            </div>
        </div>
    );
}
