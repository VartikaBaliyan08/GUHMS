package com.hms.dto;

import com.hms.model.WorkingHoursEntry;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class CreateDoctorRequest {
  @NotBlank
  private String name;
  @Email
  @NotBlank
  private String email;
  @NotBlank
  private String password;
  @NotBlank
  private String specialization;
  @NotNull
  private Integer experienceYears;
  private Integer slotDuration;
  @NotNull
  private List<WorkingHoursEntry> workingHours;

  public CreateDoctorRequest() {}

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
  public String getSpecialization() { return specialization; }
  public void setSpecialization(String specialization) { this.specialization = specialization; }
  public Integer getExperienceYears() { return experienceYears; }
  public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
  public Integer getSlotDuration() { return slotDuration; }
  public void setSlotDuration(Integer slotDuration) { this.slotDuration = slotDuration; }
  public List<WorkingHoursEntry> getWorkingHours() { return workingHours; }
  public void setWorkingHours(List<WorkingHoursEntry> workingHours) { this.workingHours = workingHours; }
}