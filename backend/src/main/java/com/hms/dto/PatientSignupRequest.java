package com.hms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PatientSignupRequest {
  @NotBlank
  private String name;
  @Email
  @NotBlank
  private String email;
  @NotBlank
  private String password;
  @NotNull
  private Integer age;
  @NotBlank
  private String gender;
  @NotBlank
  private String contactInfo;

  public PatientSignupRequest() {}

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
  public Integer getAge() { return age; }
  public void setAge(Integer age) { this.age = age; }
  public String getGender() { return gender; }
  public void setGender(String gender) { this.gender = gender; }
  public String getContactInfo() { return contactInfo; }
  public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
}