package com.hms.dto;

import com.hms.model.WorkingHoursEntry;

import java.util.List;

public class DoctorDto {
  private String id;
  private String userId;
  private String name;
  private String email;
  private String specialization;
  private Integer experienceYears;
  private Integer slotDuration;
  private List<WorkingHoursEntry> workingHours;

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getSpecialization() { return specialization; }
  public void setSpecialization(String specialization) { this.specialization = specialization; }
  public Integer getExperienceYears() { return experienceYears; }
  public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
  public Integer getSlotDuration() { return slotDuration; }
  public void setSlotDuration(Integer slotDuration) { this.slotDuration = slotDuration; }
  public List<WorkingHoursEntry> getWorkingHours() { return workingHours; }
  public void setWorkingHours(List<WorkingHoursEntry> workingHours) { this.workingHours = workingHours; }
}
