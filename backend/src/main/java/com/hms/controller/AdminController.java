package com.hms.controller;

import com.hms.dto.CreateDoctorRequest;
import com.hms.dto.AdminPatientDto;
import com.hms.dto.UpdatePatientAdminRequest;
import com.hms.model.Doctor;
import com.hms.model.User;
import com.hms.dto.DoctorDto;
import com.hms.model.Patient;
import com.hms.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminController {
  private final AdminService adminService;

  public AdminController(AdminService adminService) {
    this.adminService = adminService;
  }

  @PostMapping("/doctors")
  public ResponseEntity<Doctor> createDoctor(@Valid @RequestBody CreateDoctorRequest request) {
    return ResponseEntity.ok(adminService.createDoctor(request));
  }

  @GetMapping("/doctors")
  public ResponseEntity<List<DoctorDto>> listDoctors() {
    List<Doctor> docs = adminService.listDoctors();
    List<DoctorDto> out = docs.stream().map(d -> {
      DoctorDto dto = new DoctorDto();
      dto.setId(d.getId());
      dto.setUserId(d.getUserId());
      User u = adminService.getUserById(d.getUserId());
      dto.setName(u != null ? u.getName() : null);
      dto.setEmail(u != null ? u.getEmail() : null);
      dto.setSpecialization(d.getSpecialization());
      dto.setExperienceYears(d.getExperienceYears());
      dto.setSlotDuration(d.getSlotDuration());
      dto.setWorkingHours(d.getWorkingHours());
      return dto;
    }).collect(Collectors.toList());
    return ResponseEntity.ok(out);
  }

  @GetMapping("/doctors/{id}")
  public ResponseEntity<DoctorDto> getDoctor(@PathVariable String id) {
    Doctor d = adminService.getDoctor(id);
    User u = adminService.getUserById(d.getUserId());
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

  @PutMapping("/doctors/{id}")
  public ResponseEntity<Doctor> updateDoctor(@PathVariable String id, @RequestBody Doctor update) { return ResponseEntity.ok(adminService.updateDoctor(id, update)); }

  @DeleteMapping("/doctors/{id}")
  public ResponseEntity<Void> deleteDoctor(@PathVariable String id) { adminService.deleteDoctor(id); return ResponseEntity.noContent().build(); }

  @GetMapping("/patients")
  public ResponseEntity<List<AdminPatientDto>> listPatients() { return ResponseEntity.ok(adminService.listPatientDetails()); }

  @GetMapping("/patients/{id}")
  public ResponseEntity<AdminPatientDto> getPatient(@PathVariable String id) {
    com.hms.model.Patient p = adminService.getPatient(id);
    com.hms.model.User u = adminService.getUserById(p.getUserId());
    AdminPatientDto dto = new AdminPatientDto();
    dto.setId(p.getId());
    dto.setUserId(p.getUserId());
    dto.setName(u != null ? u.getName() : null);
    dto.setEmail(u != null ? u.getEmail() : null);
    dto.setAge(p.getAge());
    dto.setGender(p.getGender());
    dto.setContactInfo(p.getContactInfo());
    return ResponseEntity.ok(dto);
  }

  @PutMapping("/patients/{id}")
  public ResponseEntity<AdminPatientDto> updatePatient(@PathVariable String id, @RequestBody UpdatePatientAdminRequest update) { return ResponseEntity.ok(adminService.updatePatientAdmin(id, update)); }

  @DeleteMapping("/patients/{id}")
  public ResponseEntity<Void> deletePatient(@PathVariable String id) { adminService.deletePatient(id); return ResponseEntity.noContent().build(); }
}
