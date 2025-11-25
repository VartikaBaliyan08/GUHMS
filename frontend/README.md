# GUHMS — Galgotias University Hospital Management System (Frontend)

Modern React SPA for hospital administration, doctor workflows, and patient care. This app proxies all API calls to a Java Spring Boot backend and provides a unified UI for admins, doctors, and patients.

## Features

- Admin
  - Manage doctors and patients
  - Edit patient details (name, email, gender, contact)
  - Search and list views with quick actions
- Doctor
  - View appointments by date (`GET /doctor/appointments?date=YYYY-MM-DD`)
  - Accept/Reject appointments, mark as visited
  - Create prescriptions for visited appointments (`POST /doctor/appointments/{id}/prescription`)
  - View patient-specific history (appointments + doctor-authored prescriptions)
- Patient
  - Browse doctors by name/specialization
  - Book appointments and view upcoming/history
  - View prescriptions with doctor name and specialization

## Tech Stack

- Frontend: React 18, Vite, TailwindCSS, Radix UI, React Query
- Server (proxy): Node/Express, Axios
- Backend (target): Java Spring Boot API (runs at `http://localhost:8080`)

## Prerequisites

- Node.js 18+
- npm 9+
- Java 17+
- Maven 3.9+

## Getting Started (Local)

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd HMSFrontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the Java backend (Spring Boot)
   - Ensure the API is available at `http://localhost:8080`
   - If building from source:
     ```bash
     mvn -q -DskipTests package
     java -jar target/*.jar
     ```

4. Run the frontend + proxy in development
   ```bash
   npm run dev
   ```
   - Opens on `http://localhost:5000/`
   - All `/auth/*`, `/admin/*`, `/doctor/*`, `/patient/*` calls are proxied to the Java API

## Production Build

- Build frontend and server bundle
  ```bash
  npm run build
  ```
- Start production server
  ```bash
  npm start
  ```
- Serves the SPA and proxies backend endpoints.

## Configuration

- Proxy target is set in `server/routes.ts` via `JAVA_API_BASE_URL` (default `http://localhost:8080`).
- Frontend API client uses the same origin (`client/src/lib/api.ts`), relying on the Node proxy.
- Auth token is stored in `localStorage` as `token`; automatic `Authorization: Bearer <token>` is added by the interceptor.

## Key Endpoints (Backend)

- Patient
  - `GET /patient/appointments/history` → returns history items with `doctorName`
  - `GET /patient/prescriptions` → returns prescriptions with `doctorName`, `doctorSpecialization`
- Doctor
  - `GET /doctor/appointments?date=YYYY-MM-DD` → returns appointments with `patientName`
  - `GET /doctor/patients/{patientId}/history` → returns appointments and doctor-authored prescriptions for that patient
  - `POST /doctor/appointments/{id}/prescription` → creates a prescription (requires appointment status `VISITED`)
- Admin
  - `GET /admin/patients` / `PUT /admin/patients/{id}` / `DELETE /admin/patients/{id}`
  - `GET /admin/doctors` and related management endpoints

## Credentials (Demo)

- Admin: `admin@hms.com` / `Admin@123`
- Sign up patients via the app (`/signup`).

## Troubleshooting

- Java API unavailable
  - Ensure Spring Boot server is running on `http://localhost:8080`
  - The frontend shows “Java API is not available” if the proxy cannot reach it.
- Invalid Date displayed
  - Backend returns ISO-8601 instants (UTC). The frontend expects ISO strings like `2025-11-25T09:00:00Z`.
  - If custom formats are returned, update UI formatters accordingly.
- 401 Unauthorized
  - Login again; token may be missing/expired. The app redirects to `/login` if a 401 occurs.
- Maven settings parse error (Windows)
  - Fix `C:\Users\<USER>\.m2\settings.xml`: ensure it starts with a proper XML header and a `<settings>` root element.
  - Example header:
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <settings>
      <!-- your settings -->
    </settings>
    ```

## Directory Overview

- `client/` → React app (UI)
- `server/` → Express proxy + dev server integration
- `shared/` → TypeScript types and schemas shared by UI

## Branding

- GUHMS stands for Galgotias University Hospital Management System.

