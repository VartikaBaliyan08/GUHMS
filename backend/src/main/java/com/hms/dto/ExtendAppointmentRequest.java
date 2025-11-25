package com.hms.dto;

import jakarta.validation.constraints.NotNull;

public class ExtendAppointmentRequest {
  @NotNull
  private Integer extraMinutes;

  public ExtendAppointmentRequest() {}

  public Integer getExtraMinutes() { return extraMinutes; }
  public void setExtraMinutes(Integer extraMinutes) { this.extraMinutes = extraMinutes; }
}