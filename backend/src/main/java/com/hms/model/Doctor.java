package com.hms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "doctors")
public class Doctor {
  @Id
  private String id;
  private String userId;
  private String specialization;
  private Integer experienceYears;
  private Integer slotDuration;
  private List<WorkingHoursEntry> workingHours;

  public Doctor() {}

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
  public String getSpecialization() { return specialization; }
  public void setSpecialization(String specialization) { this.specialization = specialization; }
  public Integer getExperienceYears() { return experienceYears; }
  public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
  public Integer getSlotDuration() { return slotDuration; }
  public void setSlotDuration(Integer slotDuration) { this.slotDuration = slotDuration; }
  public List<WorkingHoursEntry> getWorkingHours() { return workingHours; }
  public void setWorkingHours(List<WorkingHoursEntry> workingHours) { this.workingHours = workingHours; }
}