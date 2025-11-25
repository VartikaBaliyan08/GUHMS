package com.hms.repository;

import com.hms.model.Appointment;
import com.hms.model.AppointmentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
  List<Appointment> findByDoctorIdAndStartTimeBetween(String doctorId, Instant start, Instant end);
  List<Appointment> findByDoctorIdAndStatusInAndStartTimeBetween(String doctorId, List<AppointmentStatus> statuses, Instant start, Instant end);
  List<Appointment> findByPatientIdAndStatusIn(String patientId, List<AppointmentStatus> statuses);
  List<Appointment> findByPatientIdAndEndTimeBefore(String patientId, Instant time);
  List<Appointment> findByDoctorIdAndStartTimeAfterOrderByStartTimeAsc(String doctorId, Instant after);
  List<Appointment> findByDoctorIdAndStatus(String doctorId, AppointmentStatus status);
}