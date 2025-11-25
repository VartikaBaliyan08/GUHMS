package com.hms.dto;

public class AdminPatientDto {
  private String id;
  private String userId;
  private String name;
  private String email;
  private Integer age;
  private String gender;
  private String contactInfo;

  public AdminPatientDto() {}

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public Integer getAge() { return age; }
  public void setAge(Integer age) { this.age = age; }
  public String getGender() { return gender; }
  public void setGender(String gender) { this.gender = gender; }
  public String getContactInfo() { return contactInfo; }
  public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
}
