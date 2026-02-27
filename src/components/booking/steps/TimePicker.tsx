'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useBookingStore } from '@/store/useBookingStore';
import { getAvailableSlots } from '@/core/actions/booking.actions';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import './daypicker.css'; // Add a custom css file for overriding default styles

export default function TimePicker() {
    const { selectedDate, setSelectedDate, selectedTime, setSelectedTime, nextStep, prevStep } = useBookingStore();
    const [slots, setSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Convert stored ISO string back to Date object for the picker
    const [pickerDate, setPickerDate] = useState<Date | undefined>(
        selectedDate ? new Date(selectedDate) : undefined
    );

    useEffect(() => {
        if (!pickerDate) return;

        const fetchSlots = async () => {
            setLoading(true);
            const formattedDate = format(pickerDate, 'yyyy-MM-dd');

            const res = await getAvailableSlots(formattedDate);
            if (res.success) {
                setSlots(res.slots);
            } else {
                setSlots([]);
            }
            setLoading(false);
        };

        fetchSlots();
        // Update store with new date
        setSelectedDate(pickerDate.toISOString());

        // If new date doesn't have the old time slot, clear time
        if (!slots.includes(selectedTime || '')) {
            setSelectedTime(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickerDate]);

    const isValid = selectedDate && selectedTime;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Calendar Picker */}
                <div className="w-full md:w-1/2 p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-clinic-blue-50 rounded-lg text-clinic-blue-600">
                            <CalendarIcon size={20} />
                        </div>
                        <h3 className="text-xl font-medium text-clinic-navy">Select a Date</h3>
                    </div>

                    <div className="flex justify-center calendar-container">
                        <DayPicker
                            mode="single"
                            selected={pickerDate}
                            onSelect={setPickerDate}
                            disabled={{ before: new Date() }} // Disable past dates
                            className="text-clinic-navy"
                            modifiersClassNames={{
                                selected: 'bg-clinic-blue-600 text-white font-bold',
                                today: 'text-clinic-blue-600 font-bold',
                                disabled: 'text-slate-300 cursor-not-allowed hidden',
                            }}
                        />
                    </div>
                </div>

                {/* Time Slots */}
                <div className="w-full md:w-1/2 p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-clinic-blue-50 rounded-lg text-clinic-blue-600">
                            <Clock size={20} />
                        </div>
                        <h3 className="text-xl font-medium text-clinic-navy">Select a Time</h3>
                    </div>

                    <div className="flex-grow">
                        {!pickerDate ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 py-12">
                                <CalendarIcon size={48} className="opacity-20" />
                                <p>Please select a date first</p>
                            </div>
                        ) : loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-clinic-blue-600 space-y-4 py-12">
                                <div className="w-8 h-8 border-t-2 border-b-2 border-clinic-blue-600 rounded-full animate-spin"></div>
                                <p>Finding available times...</p>
                            </div>
                        ) : slots.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12 text-center">
                                <p>No available times for this date.</p>
                                <p className="text-sm mt-2 opacity-60">Try selecting another day.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {slots.map((time) => {
                                    const isSelected = selectedTime === time;
                                    return (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={cn(
                                                "py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 border text-center",
                                                isSelected
                                                    ? "bg-clinic-blue-600 border-clinic-blue-600 text-white shadow-md"
                                                    : "bg-white border-[#E2E8F0] text-clinic-navy hover:border-clinic-blue-400 hover:shadow-sm"
                                            )}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-[#E2E8F0]">
                <button
                    onClick={prevStep}
                    className="px-6 py-3 rounded-full font-medium transition-all border border-[#E2E8F0] hover:bg-slate-50 text-clinic-muted hover:text-clinic-navy"
                >
                    Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={!isValid}
                    className={`px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${isValid
                        ? 'bg-clinic-blue-600 hover:bg-clinic-blue-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}
