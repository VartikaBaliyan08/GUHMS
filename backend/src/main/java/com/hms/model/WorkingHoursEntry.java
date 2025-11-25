package com.hms.model;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class WorkingHoursEntry {
  private DayOfWeek day;
  private LocalTime startTime;
  private LocalTime endTime;

  public WorkingHoursEntry() {}

  public DayOfWeek getDay() { return day; }
  public void setDay(DayOfWeek day) { this.day = day; }
  public LocalTime getStartTime() { return startTime; }
  public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
  public LocalTime getEndTime() { return endTime; }
  public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
}