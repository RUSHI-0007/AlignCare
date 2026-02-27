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
                console.error("Booking failed:", res.error);

                if (res.error === 'SLOT_JUST_TAKEN') {
                    setError('That slot was just booked by someone else! Please go back and select a different time.');
                } else {
                    setError(res.error || 'Failed to secure appointment. Please try again.');
                }
                setIsSubmitting(false);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm">
                <h3 className="text-2xl font-semibold mb-6 text-clinic-navy text-center">Patient Details</h3>

                {error && (
                    <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-clinic-blue-600 transition-colors">
                            <User size={20} />
                        </div>
                        <input
                            type="text"
                            name="name"
                            value={patientDetails.name}
                            onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl py-4 pl-12 pr-4 text-clinic-navy focus:outline-none focus:border-clinic-blue-600 focus:ring-1 focus:ring-clinic-blue-600 transition-all placeholder:text-slate-400 focus:bg-white"
                            placeholder="Full Legal Name"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-clinic-blue-600 transition-colors">
                                <Phone size={20} />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                value={patientDetails.phone}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl py-4 pl-12 pr-4 text-clinic-navy focus:outline-none focus:border-clinic-blue-600 focus:ring-1 focus:ring-clinic-blue-600 transition-all placeholder:text-slate-400 focus:bg-white"
                                placeholder="Phone Number"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-clinic-blue-600 transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={patientDetails.email}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl py-4 pl-12 pr-4 text-clinic-navy focus:outline-none focus:border-clinic-blue-600 focus:ring-1 focus:ring-clinic-blue-600 transition-all placeholder:text-slate-400 focus:bg-white"
                                placeholder="Email Address"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute top-4 left-0 pl-4 pointer-events-none text-slate-400 group-focus-within:text-clinic-blue-600 transition-colors">
                            <FileText size={20} />
                        </div>
                        <textarea
                            name="issue"
                            value={patientDetails.issue}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl py-4 pl-12 pr-4 text-clinic-navy focus:outline-none focus:border-clinic-blue-600 focus:ring-1 focus:ring-clinic-blue-600 transition-all placeholder:text-slate-400 focus:bg-white resize-none custom-scrollbar"
                            placeholder="Briefly describe your symptoms or reason for visit (optional)"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-[#E2E8F0]">
                <button
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-full font-medium transition-all border border-[#E2E8F0] hover:bg-slate-50 text-clinic-muted hover:text-clinic-navy disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isSubmitting}
                    className={`px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${isFormValid && !isSubmitting
                        ? 'bg-clinic-blue-600 hover:bg-clinic-blue-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
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
