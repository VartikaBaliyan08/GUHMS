import { z } from "zod";

// ============================================================================
// Auth Types & Schemas
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const patientSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z.number().min(1).max(150),
  gender: z.enum(["M", "F", "OTHER"]),
  contactInfo: z.string().min(10, "Contact info must be at least 10 characters"),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type PatientSignupRequest = z.infer<typeof patientSignupSchema>;

export interface AuthResponse {
  token: string;
  id: string;
  name: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
}

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
}

// ============================================================================
// Working Hours & Schedule
// ============================================================================

export interface WorkingHour {
  day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
}

export const workingHourSchema = z.object({
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format"),
});

// ============================================================================
// Doctor Types & Schemas
// ============================================================================

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experienceYears: number;
  slotDuration: number;
  workingHours: WorkingHour[];
}

export const createDoctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  specialization: z.string().min(2, "Specialization is required"),
  experienceYears: z.number().min(0).max(70),
  slotDuration: z.number().min(10).max(120),
  workingHours: z.array(workingHourSchema).min(1, "At least one working hour is required"),
});

export const updateDoctorSchema = z.object({
  specialization: z.string().optional(),
  experienceYears: z.number().min(0).max(70).optional(),
  slotDuration: z.number().min(10).max(120).optional(),
  workingHours: z.array(workingHourSchema).optional(),
});

export type CreateDoctorRequest = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorRequest = z.infer<typeof updateDoctorSchema>;

// ============================================================================
// Patient Types & Schemas
// ============================================================================

export interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: "M" | "F" | "OTHER";
  contactInfo: string;
}

export const updatePatientSchema = z.object({
  age: z.number().min(1).max(150).optional(),
  gender: z.enum(["M", "F", "OTHER"]).optional(),
  contactInfo: z.string().min(10).optional(),
});

export type UpdatePatientRequest = z.infer<typeof updatePatientSchema>;

// ============================================================================
// Appointment Types & Schemas
// ============================================================================

export type AppointmentStatus = 
  | "PENDING" 
  | "ACCEPTED" 
  | "REJECTED" 
  | "VISITED" 
  | "CANCELLED" 
  | "RESCHEDULE_PROPOSED" 
  | "RESCHEDULE_PENDING_PATIENT";

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  // Frontend uses these field names
  slotStartTime?: string; // ISO-8601 UTC
  slotEndTime?: string;   // ISO-8601 UTC
  // Backend returns these field names
  startTime?: string; // ISO-8601 UTC
  endTime?: string;   // ISO-8601 UTC
  status: AppointmentStatus;
  reason: string;
  doctorName?: string;
  patientName?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  proposedNewTime?: string;
  // Additional backend fields
  rescheduledFrom?: string;
  proposedStartTime?: string;
  proposedEndTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const createAppointmentSchema = z.object({
  doctorId: z.string(),
  slotStartTime: z.string(), // ISO-8601 UTC
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

export const markVisitedSchema = z.object({
  actualStartTime: z.string(), // ISO-8601 UTC
  actualEndTime: z.string(),   // ISO-8601 UTC
});

export const extendAppointmentSchema = z.object({
  extraMinutes: z.number().min(5).max(60),
});

export type CreateAppointmentRequest = z.infer<typeof createAppointmentSchema>;
export type MarkVisitedRequest = z.infer<typeof markVisitedSchema>;
export type ExtendAppointmentRequest = z.infer<typeof extendAppointmentSchema>;

// ============================================================================
// Prescription Types & Schemas
// ============================================================================

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  medications: Medication[];
  notes: string;
  createdAt: string;
  doctorName?: string;
  doctorSpecialization?: string;
  patientName?: string;
}

export const medicationSchema = z.object({
  name: z.string().min(2, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  notes: z.string().optional(),
});

export const createPrescriptionSchema = z.object({
  medications: z.array(medicationSchema).min(1, "At least one medication is required"),
  notes: z.string().optional(),
});

export type CreatePrescriptionRequest = z.infer<typeof createPrescriptionSchema>;

// ============================================================================
// Patient History
// ============================================================================

export interface PatientHistoryItem {
  appointmentId: string;
  date: string;
  reason: string;
  prescription?: Prescription;
}

// ============================================================================
// Admin Stats
// ============================================================================

export interface AdminStats {
  totalDoctors: number;
  totalPatients: number;
  todayAppointments: number;
}
