# GUHMS — Galgotias University Hospital Management System
Full-stack Hospital Management System built using **Java Spring Boot (Backend)** and **React + Vite (Frontend)**.  
Supports Admin, Doctor, and Patient workflows with secure JWT authentication.

---

# 📌 Project Structure (This Repository)

```
GUHMS/
│
├── frontend/    # React + Vite + Tailwind + Node Proxy
│   └── client/  # UI components, pages, hooks
│   └── server/  # Node Express API proxy for Spring Boot backend
│   └── shared/  # Shared TS interfaces
│
└── backend/     # Java Spring Boot + MongoDB
    └── src/
    └── pom.xml
```

This single repo contains **both frontend and backend codebases**.

---

# 🏥 Project Modules

## 👨‍💼 Admin
- Add, edit, delete doctors  
- Manage patient records  
- View all registered users  

## 👨‍⚕️ Doctor
- View appointments by date  
- Accept / reject appointments  
- Mark “Visited”  
- Create prescriptions  
- View individual patient history  

## 👤 Patient
- Browse doctors  
- Book appointments  
- View upcoming & past appointments  
- View prescriptions with doctor details  

---

# 🛠️ Tech Stack

## **Frontend**
- React 18 (SPA)
- Vite
- Tailwind CSS
- Radix UI
- React Query
- Express Node Proxy (for backend API)

## **Backend**
- Java 17
- Spring Boot
- Spring Security + JWT
- MongoDB
- Maven

---

# 🚀 How to Run the Project (Combined Setup)

## 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd GUHMS
```

---

# **2️⃣ Backend Setup (Spring Boot)**

### Set Environment Variables (Windows PowerShell)
```powershell
$env:MONGO_URI="mongodb://localhost:27017"
$env:JWT_SECRET="change-this-secret"
```

### Install & Build
```bash
cd backend
mvn -DskipTests package
```

### Run Backend
```bash
mvn spring-boot:run
```

Backend runs on:  
👉 **http://localhost:8080**

---

# **3️⃣ Frontend Setup (React + Vite)**

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on:  
👉 **http://localhost:5000**

The Node server automatically proxies API requests to Spring Boot.

---

# 🔐 Default Admin Credentials

| Role   | Email            | Password   |
|--------|------------------|------------|
| Admin  | admin@hms.com    | Admin@123  |

Patients can sign up via `/signup`.

---

# 📡 Key API Endpoints (Backend)

## Auth
- `POST /auth/login`
- `POST /auth/signup-patient`

## Admin  
- `POST /admin/doctors`
- `GET /admin/doctors`
- `PUT /admin/doctors/{id}`
- `DELETE /admin/doctors/{id}`
- Patient management endpoints

## Doctor  
- `GET /doctor/appointments?date=YYYY-MM-DD`
- `PUT /doctor/appointments/{id}/visited`
- `POST /doctor/appointments/{id}/prescription`
- `GET /doctor/patients/{id}/history`

## Patient  
- `GET /patient/doctors`
- `POST /patient/appointments`
- `GET /patient/appointments/history`
- `GET /patient/prescriptions`

---

# 🗂️ Backend Data Models

- **User** → id, name, email, passwordHash, role  
- **Patient** → id, userId, age, gender, contactInfo  
- **Doctor** → userId, specialization, experienceYears, slotDuration, workingHours  
- **Appointment** → timings, status, reason, reschedule data  
- **Prescription** → medications, notes, createdAt  

---

# 🐞 Troubleshooting

### ❌ Backend not running  
- Check MongoDB connection  
- Ensure environment variables are set  

### ❌ Invalid Date in UI  
Backend returns ISO-8601 timestamps (UTC).  

### ❌ Maven parse error  
Fix or delete:  
`C:\Users\<USER>\.m2\settings.xml`



---

# 📘 Project Description
This full-stack Hospital Management System is built as part of Java + Web development coursework.  
It demonstrates:
- Java OOP  
- Spring Boot APIs  
- JDBC/MongoDB integration  
- React UI development  
- Full authentication flow  
- Role-based access  
- Complete CRUD functionality  

---

# ✅ Submission Notes
- This repository contains **both frontend and backend**.  
- Follow the setup instructions above to run the full project.  
- Presentation file can be added in the root folder before submission.

