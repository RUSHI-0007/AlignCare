// src/store/useAdminStore.ts
// Role: Admin UI state — modal visibility, selected date, search query.
// NOT the source of truth for bookings.

import { create } from 'zustand';
import { getTodayIST } from '@/core/services/appointment.service';

interface AdminState {
    selectedDate: string;
    isWalkInModalOpen: boolean;
    preSelectedTimeForWalkIn: string | null;
    searchQuery: string;

    setSelectedDate: (date: string) => void;
    openWalkInModal: (preSelectedTime?: string) => void;
    closeWalkInModal: () => void;
    setSearchQuery: (q: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    selectedDate: getTodayIST(),
    isWalkInModalOpen: false,
    preSelectedTimeForWalkIn: null,
    searchQuery: '',

    setSelectedDate: (date) => set({ selectedDate: date }),
    openWalkInModal: (time) => set({ isWalkInModalOpen: true, preSelectedTimeForWalkIn: time ?? null }),
    closeWalkInModal: () => set({ isWalkInModalOpen: false, preSelectedTimeForWalkIn: null }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
