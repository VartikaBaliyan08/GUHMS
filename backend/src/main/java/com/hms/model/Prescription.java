package com.hms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "prescriptions")
public class Prescription {
  @Id
  private String id;
  private String appointmentId;
  private String doctorId;
  private String patientId;
  private List<Medication> medications;
  private String notes;
  private Instant createdAt;

  public Prescription() {}

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getAppointmentId() { return appointmentId; }
  public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }
  public String getDoctorId() { return doctorId; }
  public void setDoctorId(String doctorId) { this.doctorId = doctorId; }
  public String getPatientId() { return patientId; }
  public void setPatientId(String patientId) { this.patientId = patientId; }
  public List<Medication> getMedications() { return medications; }
  public void setMedications(List<Medication> medications) { this.medications = medications; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}