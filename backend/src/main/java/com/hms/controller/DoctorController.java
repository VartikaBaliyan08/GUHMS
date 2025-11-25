package com.hms.controller;

import com.hms.dto.ExtendAppointmentRequest;
import com.hms.dto.PrescriptionRequest;
import com.hms.dto.VisitTimingRequest;
import com.hms.model.Appointment;
import com.hms.model.AppointmentStatus;
import com.hms.model.Prescription;
import com.hms.repository.AppointmentRepository;
import com.hms.service.AppointmentService;
import com.hms.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@RestController
@RequestMapping("/doctor")
public class DoctorController {
  private final AppointmentRepository appointmentRepository;
  private final AppointmentService appointmentService;
  private final PrescriptionService prescriptionService;
  private final com.hms.repository.PrescriptionRepository prescriptionRepository;
  private final com.hms.repository.UserRepository userRepository;
  private final com.hms.repository.DoctorRepository doctorRepository;
  private final com.hms.repository.PatientRepository patientRepository;

  public DoctorController(AppointmentRepository appointmentRepository, AppointmentService appointmentService, PrescriptionService prescriptionService, com.hms.repository.PrescriptionRepository prescriptionRepository, com.hms.repository.UserRepository userRepository, com.hms.repository.DoctorRepository doctorRepository, com.hms.repository.PatientRepository patientRepository) {
    this.appointmentRepository = appointmentRepository;
    this.appointmentService = appointmentService;
    this.prescriptionService = prescriptionService;
    this.prescriptionRepository = prescriptionRepository;
    this.userRepository = userRepository;
    this.doctorRepository = doctorRepository;
    this.patientRepository = patientRepository;
  }

  @GetMapping("/appointments")
  public ResponseEntity<List<com.hms.dto.AppointmentWithPatientDto>> listAppointments(@AuthenticationPrincipal User principal, @RequestParam("date") String date) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String doctorId = doctorRepository.findAll().stream().filter(d -> d.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    LocalDate ld = LocalDate.parse(date);
    Instant start = ld.atStartOfDay(ZoneId.of("UTC")).toInstant();
    Instant end = ld.plusDays(1).atStartOfDay(ZoneId.of("UTC")).toInstant();
    List<Appointment> list = appointmentRepository.findByDoctorIdAndStartTimeBetween(doctorId, start, end);
    List<com.hms.dto.AppointmentWithPatientDto> out = list.stream().map(a -> {
      com.hms.dto.AppointmentWithPatientDto dto = new com.hms.dto.AppointmentWithPatientDto();
      dto.setId(a.getId());
      dto.setDoctorId(a.getDoctorId());
      dto.setPatientId(a.getPatientId());
      dto.setStartTime(a.getStartTime());
      dto.setEndTime(a.getEndTime());
      dto.setStatus(a.getStatus());
      dto.setReason(a.getReason());
      dto.setRescheduledFrom(a.getRescheduledFrom());
      dto.setProposedStartTime(a.getProposedStartTime());
      dto.setProposedEndTime(a.getProposedEndTime());
      dto.setCreatedAt(a.getCreatedAt());
      dto.setUpdatedAt(a.getUpdatedAt());
      com.hms.model.Patient p = patientRepository.findById(a.getPatientId()).orElse(null);
      com.hms.model.User u = p != null ? userRepository.findById(p.getUserId()).orElse(null) : null;
      dto.setPatientName(u != null ? u.getName() : null);
      return dto;
    }).toList();
    return ResponseEntity.ok(out);
  }

  @PutMapping("/appointments/{id}/accept")
  public ResponseEntity<Appointment> accept(@AuthenticationPrincipal User principal, @PathVariable String id) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String doctorId = doctorRepository.findAll().stream().filter(d -> d.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    return ResponseEntity.ok(appointmentService.accept(doctorId, id));
  }

  @PutMapping("/appointments/{id}/reject")
  public ResponseEntity<Appointment> reject(@AuthenticationPrincipal User principal, @PathVariable String id) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String doctorId = doctorRepository.findAll().stream().filter(d -> d.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    return ResponseEntity.ok(appointmentService.reject(doctorId, id));
  }

  @PutMapping("/appointments/{id}/accept-keep-time")
  public ResponseEntity<Appointment> acceptKeepTime(@AuthenticationPrincipal User principal, @PathVariable String id) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String doctorId = doctorRepository.findAll().stream().filter(d -> d.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    return ResponseEntity.ok(appointmentService.acceptKeepTime(doctorId, id));
  }

  @PutMapping("/appointments/{id}/visited")
  public ResponseEntity<Appointment> visited(@AuthenticationPrincipal User principal, @PathVariable String id, @RequestBody VisitTimingRequest req) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String doctorId = doctorRepository.findAll().stream().filter(d -> d.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    return ResponseEntity.ok(appointmentService.visited(doctorId, id, req));
  }

  @PutMapping("/appointments/{id}/extend")
  public ResponseEntity<Appointment> extend(@AuthenticationPrincipal User principal, @PathVariable String id, @Valid @RequestBody ExtendAppointmentRequest req) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String doctorId = doctorRepository.findAll().stream().filter(d -> d.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    return ResponseEntity.ok(appointmentService.extend(doctorId, id, req));
  }

  @PostMapping("/appointments/{id}/prescription")
  public ResponseEntity<Prescription> prescribe(@AuthenticationPrincipal User principal, @PathVariable String id, @Valid @RequestBody PrescriptionRequest req) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String doctorId = doctorRepository.findAll().stream().filter(d -> d.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    return ResponseEntity.ok(prescriptionService.create(doctorId, id, req));
  }

  @GetMapping("/patients/{patientId}/history")
  public ResponseEntity<com.hms.dto.PatientHistoryResponse> history(@AuthenticationPrincipal User principal, @PathVariable String patientId) {
    String userEmail = principal.getUsername();
    String userId = userRepository.findByEmail(userEmail).orElseThrow().getId();
    String doctorId = doctorRepository.findAll().stream().filter(d -> d.getUserId().equals(userId)).findFirst().orElseThrow().getId();
    List<Appointment> list = appointmentRepository.findByDoctorIdAndStatus(doctorId, AppointmentStatus.VISITED);
    List<Appointment> filtered = list.stream().filter(a -> a.getPatientId().equals(patientId)).toList();
    List<Prescription> presAll = prescriptionRepository.findByPatientId(patientId);
    List<Prescription> pres = presAll.stream().filter(p -> p.getDoctorId().equals(doctorId)).toList();
    return ResponseEntity.ok(new com.hms.dto.PatientHistoryResponse(filtered, pres));
  }
}
