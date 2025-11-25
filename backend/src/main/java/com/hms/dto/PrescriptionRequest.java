package com.hms.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public class PrescriptionRequest {
  @NotNull
  private List<MedicationDto> medications;
  private String notes;

  public PrescriptionRequest() {}

  public List<MedicationDto> getMedications() { return medications; }
  public void setMedications(List<MedicationDto> medications) { this.medications = medications; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
}