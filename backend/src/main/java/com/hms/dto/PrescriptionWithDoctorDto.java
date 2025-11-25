package com.hms.dto;

import com.hms.model.Medication;
import java.time.Instant;
import java.util.List;

public class PrescriptionWithDoctorDto {
  private String id;
  private String appointmentId;
  private String patientId;
  private List<Medication> medications;
  private String notes;
  private Instant createdAt;
  private String doctorName;
  private String doctorSpecialization;

  public PrescriptionWithDoctorDto() {}

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getAppointmentId() { return appointmentId; }
  public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }
  public String getPatientId() { return patientId; }
  public void setPatientId(String patientId) { this.patientId = patientId; }
  public List<Medication> getMedications() { return medications; }
  public void setMedications(List<Medication> medications) { this.medications = medications; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public String getDoctorName() { return doctorName; }
  public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
  public String getDoctorSpecialization() { return doctorSpecialization; }
  public void setDoctorSpecialization(String doctorSpecialization) { this.doctorSpecialization = doctorSpecialization; }
}
