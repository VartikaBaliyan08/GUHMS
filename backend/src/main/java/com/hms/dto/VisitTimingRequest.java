package com.hms.dto;

public class VisitTimingRequest {
  private String actualStartTime;
  private String actualEndTime;

  public VisitTimingRequest() {}

  public String getActualStartTime() { return actualStartTime; }
  public void setActualStartTime(String actualStartTime) { this.actualStartTime = actualStartTime; }
  public String getActualEndTime() { return actualEndTime; }
  public void setActualEndTime(String actualEndTime) { this.actualEndTime = actualEndTime; }
}