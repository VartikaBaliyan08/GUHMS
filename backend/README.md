# Hospital Management System — Backend

## Prerequisites
- Java 17 (JDK)
- Maven 3.9+
- MongoDB (local or hosted)

## Configuration
- Set environment variables required by Spring Boot:

```powershell
$env:MONGO_URI="mongodb://localhost:27017"
$env:JWT_SECRET="change-this-to-a-random-secret"
```

- Properties are read from `src/main/resources/application.properties`:
  - `spring.data.mongodb.uri=${MONGO_URI}`
  - `spring.data.mongodb.database=Hospital-Management-system`
  - `jwt.secret=${JWT_SECRET}`
  - `jwt.expiration=86400000`

## Install & Build
- From the project root:

```powershell
mvn -DskipTests package
```

- Troubleshooting Maven settings:
  - If you see a parse error for `C:\Users\<USER>\.m2\settings.xml`, rename or fix that file; Maven will use defaults if it’s absent.

## Run
- Using Maven:

```powershell
mvn spring-boot:run
```

- Or run the built JAR:

```powershell
java -jar target/hms-backend-0.0.1-SNAPSHOT.jar
```

- Spring Boot main class: `src/main/java/com/hms/HmsApplication.java:1`

## Default Admin
- Seeded on startup if missing:
  - Email: `admin@hms.com`
  - Password: `Admin@123`
- Seeder: `src/main/java/com/hms/config/DataSeeder.java:12`

## Authentication
- Base path: `/auth`
- Endpoints:
  - `POST /auth/login` — returns JWT (`LoginResponse`)
  - `POST /auth/signup-patient` — creates a Patient and returns JWT
- Service: `src/main/java/com/hms/service/AuthService.java:18`
- Controller: `src/main/java/com/hms/controller/AuthController.java:13`

## Roles & Access
- Roles: `ADMIN`, `DOCTOR`, `PATIENT` (stored on `User`)
- Security: JWT filter and stateless sessions
- Config: `src/main/java/com/hms/config/SecurityConfig.java:1`

## Admin Features
- Base path: `/admin`
- Manage doctors:
  - `POST /admin/doctors` — create doctor (name, email, password, specialization, experienceYears, slotDuration, workingHours)
  - `GET /admin/doctors` — list doctors
  - `GET /admin/doctors/{id}` — get doctor
  - `PUT /admin/doctors/{id}` — update doctor profile fields
  - `DELETE /admin/doctors/{id}` — delete doctor and linked user
- Manage patients:
  - `GET /admin/patients` — list patients with user details
  - `GET /admin/patients/{id}` — get patient details
  - `PUT /admin/patients/{id}` — update patient (`name`, `email`, `age`, `gender`, `contactInfo`) and user email/name
  - `DELETE /admin/patients/{id}` — delete patient and linked user
- Controller: `src/main/java/com/hms/controller/AdminController.java:18`
- Service: `src/main/java/com/hms/service/AdminService.java:16`

## Doctor Features
- Base path: `/doctor`
- Appointments:
  - `GET /doctor/appointments?date=YYYY-MM-DD` — list appointments for that UTC day, enriched with `patientName`
    - DTO: `AppointmentWithPatientDto` (`id`, `doctorId`, `patientId`, `startTime`, `endTime`, `status`, `reason`, `rescheduledFrom`, `proposedStartTime`, `proposedEndTime`, `createdAt`, `updatedAt`, `patientName`)
  - `PUT /doctor/appointments/{id}/accept` — accept appointment
  - `PUT /doctor/appointments/{id}/reject` — reject appointment
  - `PUT /doctor/appointments/{id}/accept-keep-time` — accept without rescheduling
  - `PUT /doctor/appointments/{id}/visited` — mark visited with actual timings
  - `PUT /doctor/appointments/{id}/extend` — extend duration
- Prescriptions:
  - `POST /doctor/appointments/{id}/prescription` — create prescription for a visited appointment
- Patient history:
  - `GET /doctor/patients/{patientId}/history` — doctor’s visited appointments and doctor-authored prescriptions for that patient
- Controller: `src/main/java/com/hms/controller/DoctorController.java:23`

## Patient Features
- Base path: `/patient`
- Doctors:
  - `GET /patient/doctors` — list doctors with user info
  - `GET /patient/doctors/{id}` — doctor details
  - `GET /patient/doctors/{id}/slots?date=YYYY-MM-DD` — available slots for date
- Appointments:
  - `POST /patient/appointments` — book appointment (doctorId, slotStartTime, reason)
  - `GET /patient/appointments` — upcoming appointments (pending/accepted)
  - `GET /patient/appointments/history` — past appointments with `doctorName`
  - `PUT /patient/appointments/{id}/accept-reschedule` — accept proposed reschedule
- Prescriptions:
  - `GET /patient/prescriptions` — list prescriptions with `doctorName` and specialization
  - `GET /patient/prescriptions/{id}` — prescription by id
- Controller: `src/main/java/com/hms/controller/PatientController.java:27`

## Data Model (Key)
- `User` — id, name, email, passwordHash, role, timestamps (`src/main/java/com/hms/model/User.java:9`)
- `Patient` — id, userId, age, gender, contactInfo (`src/main/java/com/hms/model/Patient.java:1`)
- `Doctor` — userId, specialization, experienceYears, slotDuration, workingHours (`src/main/java/com/hms/model/Doctor.java`)
- `Appointment` — doctorId, patientId, start/end, status, reason, reschedule/proposed times, timestamps (`src/main/java/com/hms/model/Appointment.java:9`)
- `Prescription` — appointmentId, doctorId, patientId, medications, notes, createdAt (`src/main/java/com/hms/model/Prescription.java:9`)

## Common DTOs
- Auth:
  - `LoginRequest` — email, password (`src/main/java/com/hms/dto/LoginRequest.java:6`)
  - `LoginResponse` — token, id, name, role (`src/main/java/com/hms/dto/LoginResponse.java:3`)
  - `PatientSignupRequest` — name, email, password, age, gender, contactInfo (`src/main/java/com/hms/dto/PatientSignupRequest.java:7`)
- Admin:
  - `CreateDoctorRequest` — name, email, password, specialization, experienceYears, slotDuration, workingHours (`src/main/java/com/hms/dto/CreateDoctorRequest.java:10`)
  - `UpdatePatientAdminRequest` — name, email, age, gender, contactInfo (`src/main/java/com/hms/dto/UpdatePatientAdminRequest.java:1`)
- Patient:
  - `BookAppointmentRequest` — doctorId, slotStartTime, reason (`src/main/java/com/hms/dto/BookAppointmentRequest.java:6`)
- Doctor:
  - `VisitTimingRequest` — actualStartTime, actualEndTime (`src/main/java/com/hms/dto/VisitTimingRequest.java:3`)
  - `ExtendAppointmentRequest` — extraMinutes (`src/main/java/com/hms/dto/ExtendAppointmentRequest.java:5`)
  - `PrescriptionRequest` — medications[], notes (`src/main/java/com/hms/dto/PrescriptionRequest.java:7`)
  - `MedicationDto` — name, dosage, frequency, duration, notes (`src/main/java/com/hms/dto/MedicationDto.java:5`)

## Running Notes
- Time fields are ISO-8601 instants (UTC). Clients should parse/format appropriately.
- The `date` query parameter uses `YYYY-MM-DD` and filters by UTC day.

