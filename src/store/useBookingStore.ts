// src/store/useBookingStore.ts
// Role: LOCAL UI STATE ONLY.
// Not the source of truth for availability — the database is.

import { create } from 'zustand';

interface PatientDetails {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
    issue?: string; // Phase 3 compatibility
}

interface BookingState {
    step: number;        // backwards compatibility with Phase 3
    currentStep: 1 | 2 | 3 | 4;
    serviceType: 'PHYSIOTHERAPY' | 'CANCER_REHAB' | 'HOME_VISIT' | null;
    visitType: 'CLINIC' | 'HOME' | null;
    selectedDate: string | null;
    selectedTime: string | null;
    patientDetails: PatientDetails;

    nextStep: () => void; // Phase 3 compat
    prevStep: () => void; // Phase 3 compat
    resetBooking: () => void;

    setStep: (step: 1 | 2 | 3 | 4) => void;
    setServiceType: (type: 'PHYSIOTHERAPY' | 'CANCER_REHAB' | 'HOME_VISIT') => void;
    setVisitType: (type: 'CLINIC' | 'HOME') => void;
    setSelectedDate: (date: string | null) => void;
    setSelectedTime: (time: string | null) => void;
    setDate: (date: string) => void;
    setTime: (time: string) => void;
    setPatientDetails: (details: Partial<PatientDetails>) => void;
    canAdvance: () => boolean;
    reset: () => void;
}

const initialPatientDetails = { name: '', phone: '', email: '', issue: '', notes: '' };

export const useBookingStore = create<BookingState>((set, get) => ({
    step: 1, // Phase 3 compat
    currentStep: 1,
    serviceType: null,
    visitType: null,
    selectedDate: null,
    selectedTime: null,
    patientDetails: initialPatientDetails,

    nextStep: () => set((state) => {
        const next = Math.min(state.step + 1, 4);
        return { step: next, currentStep: next as 1 | 2 | 3 | 4 };
    }),
    prevStep: () => set((state) => {
        const prev = Math.max(state.step - 1, 1);
        return { step: prev, currentStep: prev as 1 | 2 | 3 | 4 };
    }),
    resetBooking: () => set({
        step: 1,
        currentStep: 1,
        serviceType: null,
        visitType: null,
        selectedDate: null,
        selectedTime: null,
        patientDetails: initialPatientDetails,
    }),

    setStep: (step) => set({ currentStep: step, step }),
    setServiceType: (serviceType) => set({ serviceType }),
    setVisitType: (visitType) => set({ visitType }),
    setSelectedDate: (date) => set({ selectedDate: date, selectedTime: null }),
    setSelectedTime: (time) => set({ selectedTime: time }),
    setDate: (date) => set({ selectedDate: date, selectedTime: null }), // Reset time on date change
    setTime: (time) => set({ selectedTime: time }),
    setPatientDetails: (details) => set((state) => ({
        patientDetails: { ...state.patientDetails, ...details }
    })),

    canAdvance: () => {
        const { currentStep, serviceType, visitType, selectedDate, selectedTime } = get();
        if (currentStep === 1) return !!(serviceType && visitType);
        if (currentStep === 2) return !!(selectedDate && selectedTime);
        if (currentStep === 3) return true;
        return false;
    },

    reset: () => set({
        currentStep: 1,
        step: 1,
        serviceType: null,
        visitType: null,
        selectedDate: null,
        selectedTime: null,
        patientDetails: initialPatientDetails,
    }),
}));
