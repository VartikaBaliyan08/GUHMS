package com.hms.service;

import com.hms.dto.MedicationDto;
import com.hms.dto.PrescriptionRequest;
import com.hms.model.Appointment;
import com.hms.model.AppointmentStatus;
import com.hms.model.Medication;
import com.hms.model.Prescription;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {
  private final PrescriptionRepository prescriptionRepository;
  private final AppointmentRepository appointmentRepository;

  public PrescriptionService(PrescriptionRepository prescriptionRepository, AppointmentRepository appointmentRepository) {
    this.prescriptionRepository = prescriptionRepository;
    this.appointmentRepository = appointmentRepository;
  }

  public Prescription create(String doctorId, String appointmentId, PrescriptionRequest request) {
    Appointment a = appointmentRepository.findById(appointmentId).orElseThrow();
    if (!a.getDoctorId().equals(doctorId)) throw new RuntimeException("Forbidden");
    if (a.getStatus() != AppointmentStatus.VISITED) throw new RuntimeException("Only visited appointments");
    Prescription p = new Prescription();
    p.setAppointmentId(appointmentId);
    p.setDoctorId(doctorId);
    p.setPatientId(a.getPatientId());
    List<Medication> meds = request.getMedications().stream().map(this::toMedication).collect(Collectors.toList());
    p.setMedications(meds);
    p.setNotes(request.getNotes());
    p.setCreatedAt(Instant.now());
    return prescriptionRepository.save(p);
  }

  private Medication toMedication(MedicationDto dto) {
    Medication m = new Medication();
    m.setName(dto.getName());
    m.setDosage(dto.getDosage());
    m.setFrequency(dto.getFrequency());
    m.setDuration(dto.getDuration());
    m.setNotes(dto.getNotes());
    return m;
  }
}