package com.hms.service;

import com.hms.model.Appointment;
import com.hms.model.AppointmentStatus;
import com.hms.model.Doctor;
import com.hms.model.WorkingHoursEntry;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SlotService {
  private final DoctorRepository doctorRepository;
  private final AppointmentRepository appointmentRepository;

  public SlotService(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository) {
    this.doctorRepository = doctorRepository;
    this.appointmentRepository = appointmentRepository;
  }

  public List<Instant> getAvailableSlots(String doctorId, LocalDate date) {
    Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();
    int duration = doctor.getSlotDuration() != null ? doctor.getSlotDuration() : 30;
    ZoneId zone = ZoneId.of("UTC");
    List<WorkingHoursEntry> windows = doctor.getWorkingHours() == null ? List.of() : doctor.getWorkingHours().stream().filter(w -> w.getDay() == date.getDayOfWeek()).toList();
    if (windows.isEmpty()) return List.of();
    List<Instant> allSlots = new ArrayList<>();
    for (WorkingHoursEntry win : windows) {
      LocalTime start = win.getStartTime();
      LocalTime end = win.getEndTime();
      if (start == null || end == null || !start.isBefore(end)) continue;
      Instant winStart = date.atTime(start).atZone(zone).toInstant();
      Instant winEnd = date.atTime(end).atZone(zone).toInstant();
      List<Appointment> occupied = appointmentRepository.findByDoctorIdAndStatusInAndStartTimeBetween(doctorId, List.of(AppointmentStatus.ACCEPTED), winStart, winEnd);
      Instant cursor = winStart;
      while (!cursor.isAfter(winEnd.minusSeconds(duration * 60L))) {
        Instant slotEnd = cursor.plusSeconds(duration * 60L);
        boolean conflict = false;
        for (Appointment a : occupied) {
          if (overlaps(cursor, slotEnd, a.getStartTime(), a.getEndTime())) { conflict = true; break; }
        }
        if (!conflict) allSlots.add(cursor);
        cursor = cursor.plusSeconds(duration * 60L);
      }
    }
    allSlots.sort(java.util.Comparator.naturalOrder());
    return allSlots;
  }

  public boolean overlaps(Instant s1, Instant e1, Instant s2, Instant e2) {
    return !s1.isAfter(e2) && !s2.isAfter(e1) && s1.isBefore(e2) && s2.isBefore(e1);
  }

  public Instant findNextAvailableSlot(String doctorId, Instant after, int durationMinutes) {
    Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();
    ZoneId zone = ZoneId.of("UTC");
    LocalDate date = LocalDate.ofInstant(after, zone);
    for (int i = 0; i < 7; i++) {
      LocalDate d = date.plusDays(i);
      List<Instant> slots = getAvailableSlots(doctorId, d);
      Optional<Instant> next = slots.stream().filter(s -> !s.isBefore(after)).findFirst();
      if (next.isPresent()) return next.get();
    }
    return null;
  }
}
