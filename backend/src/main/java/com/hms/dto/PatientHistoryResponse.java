package com.hms.dto;

import com.hms.model.Appointment;
import com.hms.model.Prescription;

import java.util.List;

public class PatientHistoryResponse {
  private List<Appointment> appointments;
  private List<Prescription> prescriptions;

  public PatientHistoryResponse() {}

  public PatientHistoryResponse(List<Appointment> appointments, List<Prescription> prescriptions) {
    this.appointments = appointments;
    this.prescriptions = prescriptions;
  }

  public List<Appointment> getAppointments() { return appointments; }
  public void setAppointments(List<Appointment> appointments) { this.appointments = appointments; }
  public List<Prescription> getPrescriptions() { return prescriptions; }
  public void setPrescriptions(List<Prescription> prescriptions) { this.prescriptions = prescriptions; }
}