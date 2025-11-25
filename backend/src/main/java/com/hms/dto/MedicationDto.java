package com.hms.dto;

import jakarta.validation.constraints.NotBlank;

public class MedicationDto {
  @NotBlank
  private String name;
  private String dosage;
  private String frequency;
  private String duration;
  private String notes;

  public MedicationDto() {}

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getDosage() { return dosage; }
  public void setDosage(String dosage) { this.dosage = dosage; }
  public String getFrequency() { return frequency; }
  public void setFrequency(String frequency) { this.frequency = frequency; }
  public String getDuration() { return duration; }
  public void setDuration(String duration) { this.duration = duration; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
}