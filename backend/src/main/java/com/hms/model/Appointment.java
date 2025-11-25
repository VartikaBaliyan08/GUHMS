package com.hms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "appointments")
public class Appointment {
  @Id
  private String id;
  private String doctorId;
  private String patientId;
  private Instant startTime;
  private Instant endTime;
  private AppointmentStatus status;
  private String reason;
  private Instant rescheduledFrom;
  private Instant proposedStartTime;
  private Instant proposedEndTime;
  private Instant createdAt;
  private Instant updatedAt;

  public Appointment() {}

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getDoctorId() { return doctorId; }
  public void setDoctorId(String doctorId) { this.doctorId = doctorId; }
  public String getPatientId() { return patientId; }
  public void setPatientId(String patientId) { this.patientId = patientId; }
  public Instant getStartTime() { return startTime; }
  public void setStartTime(Instant startTime) { this.startTime = startTime; }
  public Instant getEndTime() { return endTime; }
  public void setEndTime(Instant endTime) { this.endTime = endTime; }
  public AppointmentStatus getStatus() { return status; }
  public void setStatus(AppointmentStatus status) { this.status = status; }
  public String getReason() { return reason; }
  public void setReason(String reason) { this.reason = reason; }
  public Instant getRescheduledFrom() { return rescheduledFrom; }
  public void setRescheduledFrom(Instant rescheduledFrom) { this.rescheduledFrom = rescheduledFrom; }
  public Instant getProposedStartTime() { return proposedStartTime; }
  public void setProposedStartTime(Instant proposedStartTime) { this.proposedStartTime = proposedStartTime; }
  public Instant getProposedEndTime() { return proposedEndTime; }
  public void setProposedEndTime(Instant proposedEndTime) { this.proposedEndTime = proposedEndTime; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}