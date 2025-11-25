package com.hms.repository;

import com.hms.model.Prescription;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PrescriptionRepository extends MongoRepository<Prescription, String> {
  List<Prescription> findByPatientId(String patientId);
  List<Prescription> findByAppointmentId(String appointmentId);
}