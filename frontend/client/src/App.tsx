import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/not-found';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import DoctorsManagement from '@/pages/admin/DoctorsManagement';
import PatientsManagement from '@/pages/admin/PatientsManagement';

import DoctorDashboard from '@/pages/doctor/DoctorDashboard';

import PatientDashboard from '@/pages/patient/PatientDashboard';
import FindDoctors from '@/pages/patient/FindDoctors';
import DoctorDetails from '@/pages/patient/DoctorDetails';
import PatientAppointments from '@/pages/patient/PatientAppointments';
import PatientPrescriptions from '@/pages/patient/PatientPrescriptions';
import AuthDebug from '@/components/AuthDebug';

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />

          <Route path="/admin">
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <div className="max-w-[1400px] mx-auto px-8 py-8">
                <AdminDashboard />
              </div>
            </ProtectedRoute>
          </Route>

          <Route path="/admin/doctors">
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <div className="max-w-[1400px] mx-auto px-8 py-8">
                <DoctorsManagement />
              </div>
            </ProtectedRoute>
          </Route>

          <Route path="/admin/patients">
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <div className="max-w-[1400px] mx-auto px-8 py-8">
                <PatientsManagement />
              </div>
            </ProtectedRoute>
          </Route>

          <Route path="/doctor">
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <div className="max-w-[1400px] mx-auto px-8 py-8">
                <DoctorDashboard />
              </div>
            </ProtectedRoute>
          </Route>

          <Route path="/doctor/appointments">
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <div className="max-w-[1400px] mx-auto px-8 py-8">
                <DoctorDashboard />
              </div>
            </ProtectedRoute>
          </Route>

          <Route path="/patient">
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <div className="max-w-[1400px] mx-auto px-8 py-8">
                <PatientDashboard />
              </div>
            </ProtectedRoute>
          </Route>

          <Route path="/patient/doctors">
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <div className="max-w-[1400px] mx-auto px-8 py-8">
                <FindDoctors />
              </div>
            </ProtectedRoute>
          </Route>

          <Route path="/patient/doctors/:id">
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <div className="max-w-[1400px] mx-auto px-8 py-8">
                <DoctorDetails />
              </div>
            </ProtectedRoute>
          </Route>

          <Route path="/patient/appointments">
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <div className="max-w-[1400px] mx-auto px-8 py-8">
                <PatientAppointments />
              </div>
            </ProtectedRoute>
          </Route>

          <Route path="/patient/prescriptions">
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <div className="max-w-[1400px] mx-auto px-8 py-8">
                <PatientPrescriptions />
              </div>
            </ProtectedRoute>
          </Route>

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
