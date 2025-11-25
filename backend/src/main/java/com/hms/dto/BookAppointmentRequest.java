package com.hms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookAppointmentRequest {
  @NotBlank
  private String doctorId;
  @NotBlank
  private String slotStartTime;
  @NotBlank
  private String reason;

  public BookAppointmentRequest() {}

  public String getDoctorId() { return doctorId; }
  public void setDoctorId(String doctorId) { this.doctorId = doctorId; }
  public String getSlotStartTime() { return slotStartTime; }
  public void setSlotStartTime(String slotStartTime) { this.slotStartTime = slotStartTime; }
  public String getReason() { return reason; }
  public void setReason(String reason) { this.reason = reason; }
}