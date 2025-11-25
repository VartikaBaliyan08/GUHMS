package com.hms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "patients")
public class Patient {
  @Id
  private String id;
  private String userId;
  private Integer age;
  private String gender;
  private String contactInfo;

  public Patient() {}

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
  public Integer getAge() { return age; }
  public void setAge(Integer age) { this.age = age; }
  public String getGender() { return gender; }
  public void setGender(String gender) { this.gender = gender; }
  public String getContactInfo() { return contactInfo; }
  public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
}
