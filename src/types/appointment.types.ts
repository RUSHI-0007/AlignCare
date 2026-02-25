// src/types/appointment.types.ts

export type AppointmentStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'WALK_IN' | 'BLOCKED';
export type ServiceType = 'PHYSIOTHERAPY' | 'CANCER_REHAB' | 'HOME_VISIT';
export type VisitType = 'CLINIC' | 'HOME';
export type ShiftType = 'MORNING' | 'EVENING';
export type CreatedByType = 'PATIENT' | 'ADMIN' | 'AI_AGENT';

export interface Patient {
    id: string;
    full_name: string;
    phone: string;
    email?: string;
    created_at: string;
    updated_at: string;
}

export interface Appointment {
    id: string;
    patient_id: string;
    service_type: ServiceType;
    visit_type: VisitType;
    appointment_date: string;   // YYYY-MM-DD
    appointment_time: string;   // HH:MM (24hr IST)
    shift: ShiftType;
    status: AppointmentStatus;
    notes?: string;
    created_by: CreatedByType;
    created_at: string;
    updated_at: string;
    patients?: Pick<Patient, 'full_name' | 'phone'>;
}

export interface BlockedSlot {
    id: string;
    slot_date: string;
    slot_time: string;
    reason?: string;
    created_by?: string;
    created_at: string;
}

export interface BookingFormData {
    dateStr: string;
    timeStr: string;
    serviceType: ServiceType;
    visitType: VisitType;
    patientDetails: {
        name: string;
        phone: string;
        email?: string;
        notes?: string;
    };
}

export interface DashboardStats {
    todayTotal: number;
    todayConfirmed: number;
    todayWalkIns: number;
    upcomingHomeVisits: number;
    availableSlotsToday: number;
}

export interface PatientWithStats extends Patient {
    lastVisit?: string | null;
    treatmentCategory?: ServiceType | null;
}
