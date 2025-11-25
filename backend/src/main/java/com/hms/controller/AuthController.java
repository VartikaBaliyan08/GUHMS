package com.hms.controller;

import com.hms.dto.LoginRequest;
import com.hms.dto.LoginResponse;
import com.hms.dto.PatientSignupRequest;
import com.hms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
  }

  @PostMapping("/signup-patient")
  public ResponseEntity<LoginResponse> signupPatient(@Valid @RequestBody PatientSignupRequest request) {
    return ResponseEntity.ok(authService.signupPatient(request));
  }
}