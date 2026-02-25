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
                <div className="w-full md:w-1/2 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-healing-teal/10 rounded-lg text-healing-teal">
                            <CalendarIcon size={20} />
                        </div>
                        <h3 className="text-xl font-medium text-white">Select a Date</h3>
                    </div>

                    <div className="flex justify-center calendar-container">
                        <DayPicker
                            mode="single"
                            selected={pickerDate}
                            onSelect={setPickerDate}
                            disabled={{ before: new Date() }} // Disable past dates
                            className="text-white"
                            modifiersClassNames={{
                                selected: 'bg-healing-teal text-primary-background font-bold',
                                today: 'text-trust-blue font-bold',
                                disabled: 'text-slate-600 cursor-not-allowed hidden',
                            }}
                        />
                    </div>
                </div>

                {/* Time Slots */}
                <div className="w-full md:w-1/2 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-trust-blue/10 rounded-lg text-trust-blue">
                            <Clock size={20} />
                        </div>
                        <h3 className="text-xl font-medium text-white">Select a Time</h3>
                    </div>

                    <div className="flex-grow">
                        {!pickerDate ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 py-12">
                                <CalendarIcon size={48} className="opacity-20" />
                                <p>Please select a date first</p>
                            </div>
                        ) : loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-healing-teal space-y-4 py-12">
                                <div className="w-8 h-8 border-t-2 border-b-2 border-healing-teal rounded-full animate-spin"></div>
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
                                                    ? "bg-healing-teal border-healing-teal text-primary-background shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                                                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-healing-teal/50 hover:text-white"
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

            <div className="flex justify-between pt-6 border-t border-white/10">
                <button
                    onClick={prevStep}
                    className="px-6 py-3 rounded-full font-medium transition-all border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white"
                >
                    Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={!isValid}
                    className={`px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${isValid
                        ? 'bg-healing-teal hover:bg-[#20b8a5] text-primary-background shadow-[0_0_20px_rgba(45,212,191,0.3)]'
                        : 'bg-white/10 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}
