# GUHMS - Global Unified Hospital Management System

## Project Overview

GUHMS is a modern, production-ready single-page application (SPA) for hospital management. It provides role-based dashboards for Administrators, Doctors, and Patients with comprehensive features for appointment scheduling, patient care coordination, and medical record management.

## Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth transitions
- **State Management**: React Query for server state
- **HTTP Client**: Axios with interceptors
- **UI Components**: Shadcn UI components
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns

### Backend Integration
- **External API**: Java Spring Boot API running at `http://localhost:8080`
- **Proxy Layer**: Express server (port 5000) proxies all API requests to Java backend
- **Communication**: Browser → Express proxy → Java API
- **Authentication**: JWT tokens managed client-side, passed via Authorization headers
- **Storage**: Tokens stored in localStorage with memory caching
- **CORS**: Handled by Express proxy layer, eliminating cross-origin issues

## Project Structure

```
client/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Shadcn UI components
│   │   ├── Navbar.tsx     # Global navigation with glassmorphism
│   │   ├── Footer.tsx     # Site footer
│   │   └── ProtectedRoute.tsx  # Role-based route protection
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── ThemeContext.tsx    # Dark/light theme management
│   ├── lib/               # Utilities
│   │   ├── api.ts         # Axios instance with interceptors
│   │   ├── queryClient.ts # React Query configuration
│   │   └── utils.ts       # Helper functions
│   ├── pages/             # Page components
│   │   ├── Landing.tsx    # Public landing page
│   │   ├── Login.tsx      # Login page
│   │   ├── Signup.tsx     # Patient registration
│   │   ├── admin/         # Admin dashboard pages
│   │   ├── doctor/        # Doctor dashboard pages
│   │   └── patient/       # Patient dashboard pages
│   ├── App.tsx            # Main app with routing
│   ├── index.css          # Global styles & design tokens
│   └── main.tsx           # App entry point
├── index.html             # HTML template
└── public/                # Static assets

shared/
└── schema.ts              # TypeScript types & Zod schemas

server/
├── app.ts                 # Express app configuration
├── routes.ts              # API routes (minimal - frontend talks to Java API)
└── index-dev.ts           # Development server entry
```

## Key Features

### Authentication & Authorization
- **Login**: Email/password authentication for all roles
- **Patient Signup**: Self-service registration for patients
- **Role-Based Access**: Separate dashboards for Admin, Doctor, Patient
- **Protected Routes**: Automatic redirects based on authentication and role
- **JWT Management**: Automatic token injection in API requests

### Admin Dashboard
- **Overview**: Stats cards showing total doctors, patients, and appointments
- **Doctor Management**: Add, view, edit, and delete doctor accounts
- **Patient Management**: View and manage patient records
- **Search**: Filter doctors and patients by name or specialization

### Doctor Dashboard
- **Appointment Timeline**: View appointments by date
- **Appointment Actions**:
  - Accept/reject pending appointments
  - Mark appointments as visited
  - Extend appointment duration
- **Status Management**: Color-coded appointment statuses
- **Patient History**: View patient's previous visits and prescriptions

### Patient Dashboard
- **Find Doctors**: Browse doctors by specialization with search
- **Book Appointments**: 
  - View doctor details and availability
  - Select time slots
  - Provide visit reason
- **My Appointments**: 
  - View upcoming and past appointments
  - Accept/reject reschedule requests
- **Prescriptions**: Access detailed medication information

## Design System

### Typography
- **Primary Font**: Inter (UI, body text, data)
- **Accent Font**: Sora (headings, hero sections)
- **Hierarchy**: text-xs to text-6xl with consistent weights

### Colors
- **Primary**: Teal/medical blue (186, 85%, 35%)
- **Theme Support**: Fully responsive dark/light themes
- **Semantic Colors**: Proper contrast ratios for accessibility

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Multiple variants with elevation animations
- **Forms**: Clean inputs with validation feedback
- **Tables**: Responsive with search and sorting
- **Modals**: Dialog system with backdrop blur

### Animations
- **Page Transitions**: Fade with vertical offset using Framer Motion
- **Theme Toggle**: Smooth color transitions
- **Hover Effects**: Subtle elevation with `hover-elevate` utility
- **Active States**: Enhanced feedback with `active-elevate-2`
- **Loading States**: Skeleton loaders and spinners

## API Endpoints (Java Backend)

### Authentication
- `POST /auth/login` - User login (all roles)
- `POST /auth/signup-patient` - Patient registration

### Admin
- `GET /admin/doctors` - List all doctors
- `POST /admin/doctors` - Create doctor
- `GET /admin/doctors/:id` - Get doctor details
- `PUT /admin/doctors/:id` - Update doctor
- `DELETE /admin/doctors/:id` - Delete doctor
- `GET /admin/patients` - List all patients
- `GET /admin/patients/:id` - Get patient details
- `PUT /admin/patients/:id` - Update patient

### Doctor
- `GET /doctor/appointments?date=YYYY-MM-DD` - Get appointments by date
- `PUT /doctor/appointments/:id/accept` - Accept appointment
- `PUT /doctor/appointments/:id/reject` - Reject appointment
- `PUT /doctor/appointments/:id/visited` - Mark as visited
- `PUT /doctor/appointments/:id/extend` - Extend appointment
- `POST /doctor/appointments/:id/prescription` - Create prescription
- `GET /doctor/patients/:patientId/history` - Patient history

### Patient
- `GET /patient/doctors` - List all doctors
- `GET /patient/doctors/:id` - Get doctor details
- `GET /patient/doctors/:id/slots?date=YYYY-MM-DD` - Get available slots
- `POST /patient/appointments` - Book appointment
- `GET /patient/appointments` - Get appointments
- `GET /patient/appointments/history` - Get appointment history
- `PUT /patient/appointments/:id/accept-reschedule` - Accept reschedule
- `PUT /patient/appointments/:id/reject-reschedule` - Reject reschedule
- `GET /patient/prescriptions` - Get prescriptions
- `GET /patient/prescriptions/:id` - Get prescription details

## Running the Application

### Prerequisites
- Node.js 20+
- Java Spring Boot API running on `http://localhost:8080`

### Development
```bash
npm run dev
```
The application will be available at `http://localhost:5000`

### Environment
- **Frontend Port**: 5000 (served by Vite)
- **Backend API**: http://localhost:8080 (Java Spring Boot)
- **Theme**: Stored in localStorage
- **Auth Token**: Stored in localStorage

## Recent Changes

**November 24, 2025**
- Initial project setup and complete frontend implementation
- Implemented all role-based dashboards (Admin, Doctor, Patient)
- Created comprehensive design system with dark/light themes
- Integrated authentication and authorization flows
- Built all CRUD operations for doctors, patients, and appointments
- Added booking system with slot selection
- Implemented prescription management
- Created responsive layouts with Framer Motion animations

## User Preferences

- **Design Style**: Material Design principles adapted for healthcare
- **Color Scheme**: Teal/cyan primary with professional medical feel
- **Typography**: Inter for UI, Sora for headings
- **Animations**: Minimal, purposeful motion (healthcare focus)
- **Accessibility**: High contrast ratios, focus states, ARIA labels

## Notes for Development

### Important Considerations
1. **External Backend**: The Java Spring Boot API must be running separately
2. **CORS**: Ensure Java backend has CORS configured for localhost:5000
3. **JWT Tokens**: Auth tokens are managed client-side with Axios interceptors
4. **Date/Time**: All times are ISO-8601 UTC from backend, converted to local time for display
5. **Error Handling**: Custom error interceptor handles 400/403/409 status codes

### Known Limitations
- Application requires external Java API to be running
- No offline support (requires network connection)
- Tokens stored in localStorage (consider more secure storage for production)

### Future Enhancements
- Real-time notifications with WebSockets
- Advanced analytics dashboard with charts
- Email/SMS appointment reminders
- Doctor availability calendar management
- Medical records upload and document management
- Multi-language support
- Mobile app version
