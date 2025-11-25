package com.hms.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
    String msg = ex.getBindingResult().getFieldErrors().stream().findFirst().map(e -> e.getField() + " " + e.getDefaultMessage()).orElse("Validation error");
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", msg));
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
    String m = ex.getMessage();
    HttpStatus status = HttpStatus.BAD_REQUEST;
    if ("Forbidden".equals(m)) status = HttpStatus.FORBIDDEN;
    if ("Slot not available".equals(m) || "Conflict exists".equals(m) || "Email already exists".equals(m)) status = HttpStatus.CONFLICT;
    if ("Invalid state".equals(m)) status = HttpStatus.BAD_REQUEST;
    return ResponseEntity.status(status).body(Map.of("error", m));
  }
}