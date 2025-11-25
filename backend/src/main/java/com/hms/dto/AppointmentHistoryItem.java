package com.hms.dto;

import com.hms.model.AppointmentStatus;
import java.time.Instant;

public class AppointmentHistoryItem {
  private String id;
  private Instant startTime;
  private Instant endTime;
  private AppointmentStatus status;
  private String reason;
  private String doctorName;

  public AppointmentHistoryItem() {}

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public Instant getStartTime() { return startTime; }
  public void setStartTime(Instant startTime) { this.startTime = startTime; }
  public Instant getEndTime() { return endTime; }
  public void setEndTime(Instant endTime) { this.endTime = endTime; }
  public AppointmentStatus getStatus() { return status; }
  public void setStatus(AppointmentStatus status) { this.status = status; }
  public String getReason() { return reason; }
  public void setReason(String reason) { this.reason = reason; }
  public String getDoctorName() { return doctorName; }
  public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
}
