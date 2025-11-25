package com.hms.controller;

import com.hms.dto.BookAppointmentRequest;
import com.hms.model.Appointment;
import com.hms.model.AppointmentStatus;
import com.hms.model.Doctor;
import com.hms.model.Prescription;
// removed to avoid ambiguity with org.springframework.security.core.userdetails.User
import com.hms.dto.DoctorDto;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PrescriptionRepository;
import com.hms.service.AppointmentService;
import com.hms.service.SlotService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@RestController
@RequestMapping("/patient")
public class PatientController {
  private final DoctorRepository doctorRepository;
  private final SlotService slotService;
  private final AppointmentService appointmentService;
  private final AppointmentRepository appointmentRepository;
  private final PrescriptionRepository prescriptionRepository;
  private final com.hms.repository.UserRepository userRepository;
  private final com.hms.repository.PatientRepository patientRepository;

  public PatientController(DoctorRepository doctorRepository, SlotService slotService, AppointmentService appointmentService, AppointmentRepository appointmentRepository, PrescriptionRepository prescriptionRepository, com.hms.repository.UserRepository userRepository, com.hms.repository.PatientRepository patientRepository) {
    this.doctorRepository = doctorRepository;
    this.slotService = slotService;
    this.appointmentService = appointmentService;
    this.appointmentRepository = appointmentRepository;
    this.prescriptionRepository = prescriptionRepository;
    this.userRepository = userRepository;
    this.patientRepository = patientRepository;
  }

  @GetMapping("/doctors")
  public ResponseEntity<List<DoctorDto>> listDoctors() {
    List<Doctor> docs = doctorRepository.findAll();
    List<DoctorDto> out = docs.stream().map(d -> {
      DoctorDto dto = new DoctorDto();
      dto.setId(d.getId());
      dto.setUserId(d.getUserId());
      com.hms.model.User u = userRepository.findById(d.getUserId()).orElse(null);
      dto.setName(u != null ? u.getName() : null);
      dto.setEmail(u != null ? u.getEmail() : null);
      dto.setSpecialization(d.getSpecialization());
      dto.setExperienceYears(d.getExperienceYears());
      dto.setSlotDuration(d.getSlotDuration());
      dto.setWorkingHours(d.getWorkingHours());
      return dto;
    }).toList();
    return ResponseEntity.ok(out);
  }

  @GetMapping("/doctors/{id}")
  public ResponseEntity<DoctorDto> getDoctor(@PathVariable String id) {
    Doctor d = doctorRepository.findById(id).orElseThrow();
    com.hms.model.User u = userRepository.findById(d.getUserId()).orElse(null);
    DoctorDto dto = new DoctorDto();
    dto.setId(d.getId());
    dto.setUserId(d.getUserId());
    dto.setName(u != null ? u.getName() : null);
    dto.setEmail(u != null ? u.getEmail() : null);
    dto.setSpecialization(d.getSpecialization());
    dto.setExperienceYears(d.getExperienceYears());
    dto.setSlotDuration(d.getSlotDuration());
    dto.setWorkingHours(d.getWorkingHours());
    return ResponseEntity.ok(dto);
  }

  @GetMapping("/doctors/{id}/slots")
  public ResponseEntity<List<Instant>> getSlots(@PathVariable String id, @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    return ResponseEntity.ok(slotService.getAvailableSlots(id, date));
  }

  @PostMapping("/appointments")
  public ResponseEntity<Appointment> book(@AuthenticationPrincipal User principal, @Valid @RequestBody BookAppointmentRequest request) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String patientId = patientRepository.findAll().stream().filter(p -> p.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    return ResponseEntity.ok(appointmentService.book(patientId, request));
  }

  @GetMapping("/appointments")
  public ResponseEntity<List<Appointment>> upcoming(@AuthenticationPrincipal User principal) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String patientId = patientRepository.findAll().stream().filter(p -> p.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    List<Appointment> list = appointmentRepository.findByPatientIdAndStatusIn(patientId, List.of(AppointmentStatus.PENDING, AppointmentStatus.ACCEPTED));
    return ResponseEntity.ok(list);
  }

  @GetMapping("/appointments/history")
  public ResponseEntity<List<com.hms.dto.AppointmentHistoryItem>> history(@AuthenticationPrincipal User principal) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String patientId = patientRepository.findAll().stream().filter(p -> p.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    List<Appointment> list = appointmentRepository.findByPatientIdAndEndTimeBefore(patientId, Instant.now());
    List<com.hms.dto.AppointmentHistoryItem> out = list.stream().map(a -> {
      com.hms.model.Doctor d = doctorRepository.findById(a.getDoctorId()).orElse(null);
      com.hms.model.User u = d != null ? userRepository.findById(d.getUserId()).orElse(null) : null;
      com.hms.dto.AppointmentHistoryItem dto = new com.hms.dto.AppointmentHistoryItem();
      dto.setId(a.getId());
      dto.setStartTime(a.getStartTime());
      dto.setEndTime(a.getEndTime());
      dto.setStatus(a.getStatus());
      dto.setReason(a.getReason());
      dto.setDoctorName(u != null ? u.getName() : null);
      return dto;
    }).toList();
    return ResponseEntity.ok(out);
  }

  @GetMapping("/prescriptions")
  public ResponseEntity<List<com.hms.dto.PrescriptionWithDoctorDto>> prescriptions(@AuthenticationPrincipal User principal) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String patientId = patientRepository.findAll().stream().filter(p -> p.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    List<Prescription> pres = prescriptionRepository.findByPatientId(patientId);
    List<com.hms.dto.PrescriptionWithDoctorDto> out = pres.stream().map(p -> {
      com.hms.model.Doctor d = doctorRepository.findById(p.getDoctorId()).orElse(null);
      com.hms.model.User u = d != null ? userRepository.findById(d.getUserId()).orElse(null) : null;
      com.hms.dto.PrescriptionWithDoctorDto dto = new com.hms.dto.PrescriptionWithDoctorDto();
      dto.setId(p.getId());
      dto.setAppointmentId(p.getAppointmentId());
      dto.setPatientId(p.getPatientId());
      dto.setMedications(p.getMedications());
      dto.setNotes(p.getNotes());
      dto.setCreatedAt(p.getCreatedAt());
      dto.setDoctorName(u != null ? u.getName() : null);
      dto.setDoctorSpecialization(d != null ? d.getSpecialization() : null);
      return dto;
    }).toList();
    return ResponseEntity.ok(out);
  }

  @GetMapping("/prescriptions/{id}")
  public ResponseEntity<Prescription> prescription(@PathVariable String id) { return ResponseEntity.ok(prescriptionRepository.findById(id).orElseThrow()); }

  @PutMapping("/appointments/{id}/accept-reschedule")
  public ResponseEntity<Appointment> acceptReschedule(@AuthenticationPrincipal User principal, @PathVariable String id) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String patientId = patientRepository.findAll().stream().filter(p -> p.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    return ResponseEntity.ok(appointmentService.patientAcceptReschedule(patientId, id));
  }

  @PutMapping("/appointments/{id}/reject-reschedule")
  public ResponseEntity<Appointment> rejectReschedule(@AuthenticationPrincipal User principal, @PathVariable String id) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String patientId = patientRepository.findAll().stream().filter(p -> p.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    return ResponseEntity.ok(appointmentService.patientRejectReschedule(patientId, id));
  }
}
