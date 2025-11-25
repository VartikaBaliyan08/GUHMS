package com.hms.service;

import com.hms.dto.CreateDoctorRequest;
import com.hms.model.Doctor;
import com.hms.model.Role;
import com.hms.model.User;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AdminService {
  private final UserRepository userRepository;
  private final DoctorRepository doctorRepository;
  private final PatientRepository patientRepository;
  private final PasswordEncoder passwordEncoder;

  public AdminService(UserRepository userRepository, DoctorRepository doctorRepository, PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.doctorRepository = doctorRepository;
    this.patientRepository = patientRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public Doctor createDoctor(CreateDoctorRequest request) {
    if (userRepository.findByEmail(request.getEmail()).isPresent()) throw new RuntimeException("Email already exists");
    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    user.setRole(Role.DOCTOR);
    user.setCreatedAt(Instant.now());
    user.setUpdatedAt(Instant.now());
    user = userRepository.save(user);
    Doctor doctor = new Doctor();
    doctor.setUserId(user.getId());
    doctor.setSpecialization(request.getSpecialization());
    doctor.setExperienceYears(request.getExperienceYears());
    doctor.setSlotDuration(request.getSlotDuration() != null ? request.getSlotDuration() : 30);
    doctor.setWorkingHours(request.getWorkingHours());
    return doctorRepository.save(doctor);
  }

  public List<Doctor> listDoctors() { return doctorRepository.findAll(); }
  public Doctor getDoctor(String id) { return doctorRepository.findById(id).orElseThrow(); }
  public User getUserById(String id) { return userRepository.findById(id).orElse(null); }
  public Doctor updateDoctor(String id, Doctor update) {
    Doctor d = doctorRepository.findById(id).orElseThrow();
    d.setSpecialization(update.getSpecialization());
    d.setExperienceYears(update.getExperienceYears());
    d.setSlotDuration(update.getSlotDuration());
    d.setWorkingHours(update.getWorkingHours());
    return doctorRepository.save(d);
  }
  public void deleteDoctor(String id) {
    Doctor d = doctorRepository.findById(id).orElseThrow();
    userRepository.deleteById(d.getUserId());
    doctorRepository.deleteById(id);
  }

  public List<com.hms.model.Patient> listPatients() { return patientRepository.findAll(); }
  public com.hms.model.Patient getPatient(String id) { return patientRepository.findById(id).orElseThrow(); }
  public java.util.List<com.hms.dto.AdminPatientDto> listPatientDetails() {
    java.util.List<com.hms.model.Patient> patients = patientRepository.findAll();
    return patients.stream().map(p -> {
      com.hms.model.User u = userRepository.findById(p.getUserId()).orElse(null);
      com.hms.dto.AdminPatientDto dto = new com.hms.dto.AdminPatientDto();
      dto.setId(p.getId());
      dto.setUserId(p.getUserId());
      dto.setName(u != null ? u.getName() : null);
      dto.setEmail(u != null ? u.getEmail() : null);
      dto.setAge(p.getAge());
      dto.setGender(p.getGender());
      dto.setContactInfo(p.getContactInfo());
      return dto;
    }).toList();
  }
  public com.hms.model.Patient updatePatient(String id, com.hms.model.Patient update) {
    com.hms.model.Patient p = patientRepository.findById(id).orElseThrow();
    p.setAge(update.getAge());
    p.setGender(update.getGender());
    p.setContactInfo(update.getContactInfo());
    return patientRepository.save(p);
  }
  public com.hms.dto.AdminPatientDto updatePatientAdmin(String id, com.hms.dto.UpdatePatientAdminRequest update) {
    com.hms.model.Patient p = patientRepository.findById(id).orElseThrow();
    if (update.getAge() != null) p.setAge(update.getAge());
    if (update.getGender() != null) p.setGender(update.getGender());
    if (update.getContactInfo() != null) p.setContactInfo(update.getContactInfo());
    p = patientRepository.save(p);
    com.hms.model.User u = userRepository.findById(p.getUserId()).orElseThrow();
    if (update.getName() != null) u.setName(update.getName());
    if (update.getEmail() != null && !update.getEmail().equals(u.getEmail())) {
      java.util.Optional<com.hms.model.User> existing = userRepository.findByEmail(update.getEmail());
      if (existing.isPresent() && !existing.get().getId().equals(u.getId())) throw new RuntimeException("Email already exists");
      u.setEmail(update.getEmail());
    }
    u.setUpdatedAt(java.time.Instant.now());
    userRepository.save(u);
    com.hms.dto.AdminPatientDto dto = new com.hms.dto.AdminPatientDto();
    dto.setId(p.getId());
    dto.setUserId(p.getUserId());
    dto.setName(u.getName());
    dto.setEmail(u.getEmail());
    dto.setAge(p.getAge());
    dto.setGender(p.getGender());
    dto.setContactInfo(p.getContactInfo());
    return dto;
  }
  public void deletePatient(String id) {
    com.hms.model.Patient p = patientRepository.findById(id).orElseThrow();
    userRepository.deleteById(p.getUserId());
    patientRepository.deleteById(id);
  }
}
