package com.hms.service;

import com.hms.dto.BookAppointmentRequest;
import com.hms.dto.ExtendAppointmentRequest;
import com.hms.dto.VisitTimingRequest;
import com.hms.model.*;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;

@Service
public class AppointmentService {
  private final AppointmentRepository appointmentRepository;
  private final DoctorRepository doctorRepository;
  private final PatientRepository patientRepository;
  private final SlotService slotService;

  public AppointmentService(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository, PatientRepository patientRepository, SlotService slotService) {
    this.appointmentRepository = appointmentRepository;
    this.doctorRepository = doctorRepository;
    this.patientRepository = patientRepository;
    this.slotService = slotService;
  }

  public Appointment book(String patientId, BookAppointmentRequest request) {
    Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow();
    int duration = doctor.getSlotDuration() != null ? doctor.getSlotDuration() : 30;
    Instant start = Instant.parse(request.getSlotStartTime());
    Instant end = start.plusSeconds(duration * 60L);
    ZoneId zone = ZoneId.of("UTC");
    LocalDate date = LocalDate.ofInstant(start, zone);
    boolean withinHours = doctor.getWorkingHours() != null && doctor.getWorkingHours().stream().anyMatch(w -> w.getDay() == date.getDayOfWeek() && !start.isBefore(date.atTime(w.getStartTime()).atZone(zone).toInstant()) && !end.isAfter(date.atTime(w.getEndTime()).atZone(zone).toInstant()));
    if (!withinHours) throw new RuntimeException("Slot not available");
    List<Appointment> accepted = appointmentRepository.findByDoctorIdAndStatus(doctor.getId(), AppointmentStatus.ACCEPTED);
    boolean conflict = accepted.stream().anyMatch(x -> slotService.overlaps(start, end, x.getStartTime(), x.getEndTime()));
    if (conflict) throw new RuntimeException("Slot not available");
    Appointment a = new Appointment();
    a.setDoctorId(doctor.getId());
    a.setPatientId(patientId);
    a.setStartTime(start);
    a.setEndTime(end);
    a.setStatus(AppointmentStatus.PENDING);
    a.setReason(request.getReason());
    a.setCreatedAt(Instant.now());
    a.setUpdatedAt(Instant.now());
    return appointmentRepository.save(a);
  }

  public Appointment accept(String doctorId, String appointmentId) {
    Appointment a = appointmentRepository.findById(appointmentId).orElseThrow();
    if (!a.getDoctorId().equals(doctorId)) throw new RuntimeException("Forbidden");
    List<Appointment> conflicts = appointmentRepository.findByDoctorIdAndStatus(doctorId, AppointmentStatus.ACCEPTED);
    boolean conflict = conflicts.stream().anyMatch(x -> slotService.overlaps(a.getStartTime(), a.getEndTime(), x.getStartTime(), x.getEndTime()));
    if (conflict) throw new RuntimeException("Conflict exists");
    a.setStatus(AppointmentStatus.ACCEPTED);
    a.setUpdatedAt(Instant.now());
    return appointmentRepository.save(a);
  }

  public Appointment acceptKeepTime(String doctorId, String appointmentId) {
    Appointment chosen = appointmentRepository.findById(appointmentId).orElseThrow();
    if (!chosen.getDoctorId().equals(doctorId)) throw new RuntimeException("Forbidden");
    chosen.setStatus(AppointmentStatus.ACCEPTED);
    appointmentRepository.save(chosen);
    List<Appointment> pending = appointmentRepository.findByDoctorIdAndStatus(doctorId, AppointmentStatus.PENDING);
    for (Appointment p : pending) {
      boolean conflict = slotService.overlaps(chosen.getStartTime(), chosen.getEndTime(), p.getStartTime(), p.getEndTime());
      if (conflict) {
        Instant next = slotService.findNextAvailableSlot(doctorId, chosen.getEndTime(), durationForDoctor(doctorId));
        if (next != null) {
          p.setRescheduledFrom(p.getStartTime());
          p.setProposedStartTime(next);
          p.setProposedEndTime(next.plusSeconds(durationForDoctor(doctorId) * 60L));
          p.setStatus(AppointmentStatus.RESCHEDULE_PENDING_PATIENT);
          p.setUpdatedAt(Instant.now());
          appointmentRepository.save(p);
        }
      }
    }
    return chosen;
  }

  private int durationForDoctor(String doctorId) {
    Doctor d = doctorRepository.findById(doctorId).orElseThrow();
    return d.getSlotDuration() != null ? d.getSlotDuration() : 30;
  }

  public Appointment reject(String doctorId, String appointmentId) {
    Appointment a = appointmentRepository.findById(appointmentId).orElseThrow();
    if (!a.getDoctorId().equals(doctorId)) throw new RuntimeException("Forbidden");
    a.setStatus(AppointmentStatus.REJECTED);
    a.setUpdatedAt(Instant.now());
    return appointmentRepository.save(a);
  }

  public Appointment visited(String doctorId, String appointmentId, VisitTimingRequest req) {
    Appointment a = appointmentRepository.findById(appointmentId).orElseThrow();
    if (!a.getDoctorId().equals(doctorId)) throw new RuntimeException("Forbidden");
    if (req.getActualStartTime() != null) a.setStartTime(Instant.parse(req.getActualStartTime()));
    if (req.getActualEndTime() != null) a.setEndTime(Instant.parse(req.getActualEndTime()));
    a.setStatus(AppointmentStatus.VISITED);
    a.setUpdatedAt(Instant.now());
    rescheduleAfterDelay(doctorId, a.getEndTime());
    return appointmentRepository.save(a);
  }

  public Appointment extend(String doctorId, String appointmentId, ExtendAppointmentRequest req) {
    Appointment a = appointmentRepository.findById(appointmentId).orElseThrow();
    if (!a.getDoctorId().equals(doctorId)) throw new RuntimeException("Forbidden");
    a.setEndTime(a.getEndTime().plusSeconds(req.getExtraMinutes() * 60L));
    a.setUpdatedAt(Instant.now());
    appointmentRepository.save(a);
    rescheduleAfterDelay(doctorId, a.getEndTime());
    return a;
  }

  private void rescheduleAfterDelay(String doctorId, Instant newEnd) {
    List<Appointment> subsequent = appointmentRepository.findByDoctorIdAndStartTimeAfterOrderByStartTimeAsc(doctorId, newEnd);
    Instant cursor = newEnd;
    int duration = durationForDoctor(doctorId);
    for (Appointment s : subsequent) {
      s.setRescheduledFrom(s.getStartTime());
      s.setProposedStartTime(cursor);
      s.setProposedEndTime(cursor.plusSeconds(duration * 60L));
      s.setStatus(AppointmentStatus.RESCHEDULE_PENDING_PATIENT);
      s.setUpdatedAt(Instant.now());
      appointmentRepository.save(s);
      cursor = s.getProposedEndTime();
    }
  }

  public Appointment patientAcceptReschedule(String patientId, String appointmentId) {
    Appointment a = appointmentRepository.findById(appointmentId).orElseThrow();
    if (!a.getPatientId().equals(patientId)) throw new RuntimeException("Forbidden");
    if (a.getStatus() != AppointmentStatus.RESCHEDULE_PENDING_PATIENT) throw new RuntimeException("Invalid state");
    a.setStartTime(a.getProposedStartTime());
    a.setEndTime(a.getProposedEndTime());
    a.setStatus(AppointmentStatus.ACCEPTED);
    a.setUpdatedAt(Instant.now());
    return appointmentRepository.save(a);
  }

  public Appointment patientRejectReschedule(String patientId, String appointmentId) {
    Appointment a = appointmentRepository.findById(appointmentId).orElseThrow();
    if (!a.getPatientId().equals(patientId)) throw new RuntimeException("Forbidden");
    if (a.getStatus() != AppointmentStatus.RESCHEDULE_PENDING_PATIENT) throw new RuntimeException("Invalid state");
    a.setStatus(AppointmentStatus.CANCELLED);
    a.setUpdatedAt(Instant.now());
    return appointmentRepository.save(a);
  }
}
