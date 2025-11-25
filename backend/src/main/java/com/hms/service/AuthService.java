package com.hms.service;

import com.hms.dto.LoginRequest;
import com.hms.dto.LoginResponse;
import com.hms.dto.PatientSignupRequest;
import com.hms.model.Patient;
import com.hms.model.Role;
import com.hms.model.User;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.hms.config.JwtTokenProvider;

import java.time.Instant;

@Service
public class AuthService {
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwtTokenProvider;
  private final UserRepository userRepository;
  private final PatientRepository patientRepository;
  private final PasswordEncoder passwordEncoder;

  public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, UserRepository userRepository, PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
    this.authenticationManager = authenticationManager;
    this.jwtTokenProvider = jwtTokenProvider;
    this.userRepository = userRepository;
    this.patientRepository = patientRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public LoginResponse login(LoginRequest request) {
    Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
    String token = jwtTokenProvider.generateToken(auth);
    return new LoginResponse(token, user.getId(), user.getName(), user.getRole().name());
  }

  public LoginResponse signupPatient(PatientSignupRequest request) {
    if (userRepository.findByEmail(request.getEmail()).isPresent()) throw new RuntimeException("Email already exists");
    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    user.setRole(Role.PATIENT);
    user.setCreatedAt(Instant.now());
    user.setUpdatedAt(Instant.now());
    user = userRepository.save(user);
    Patient patient = new Patient();
    patient.setUserId(user.getId());
    patient.setAge(request.getAge());
    patient.setGender(request.getGender());
    patient.setContactInfo(request.getContactInfo());
    patientRepository.save(patient);
    Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    String token = jwtTokenProvider.generateToken(auth);
    return new LoginResponse(token, user.getId(), user.getName(), user.getRole().name());
  }
}