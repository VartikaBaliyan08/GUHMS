import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Users, Clock } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { Appointment, Prescription } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to safely parse and format dates
function formatAppointmentTime(dateTimeString: string, formatString: string = 'MMM d, yyyy - h:mm a'): string {
  try {
    console.log('🔍 Parsing date:', dateTimeString);

    // Try different date parsing approaches
    let date: Date;

    if (dateTimeString.includes('T')) {
      // ISO format: 2024-11-25T14:30:00
      date = new Date(dateTimeString);
    } else if (dateTimeString.includes(' ')) {
      // Space separated: 2024-11-25 14:30:00
      date = new Date(dateTimeString.replace(' ', 'T'));
    } else {
      // Fallback
      date = new Date(dateTimeString);
    }

    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateTimeString);
      return 'Invalid Date';
    }

    return format(date, formatString);
  } catch (error) {
    console.error('Date parsing error:', error, 'for value:', dateTimeString);
    return 'Invalid Date';
  }
}

export default function PatientDashboard() {
  const { user, isAuthenticated, token, isLoading: authLoading } = useAuth();

  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ['/patient/appointments'],
    enabled: !authLoading && isAuthenticated && !!token,
  });

  const { data: appointmentHistory, isLoading: historyLoading, error: historyError } = useQuery<Appointment[]>({
    queryKey: ['/patient/appointments/history'],
    enabled: !authLoading && isAuthenticated && !!token,
    onSuccess: (data) => {
      console.log('🔍 Appointment history loaded:', data);
    },
    onError: (error) => {
      console.error('🔥 History query error:', error);
    }
  });

  const { data: prescriptions, isLoading: prescriptionsLoading } = useQuery<Prescription[]>({
    queryKey: ['/patient/prescriptions'],
    enabled: !authLoading && isAuthenticated && !!token,
  });

  const upcomingAppointments = appointments?.filter(
    (apt) => apt.status === 'PENDING' || apt.status === 'ACCEPTED'
  ).slice(0, 3);

  const recentAppointments = appointmentHistory?.slice(0, 3) || [];

  const recentPrescriptions = prescriptions?.slice(0, 3);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Loading...</h1>
          <p className="text-muted-foreground">Please wait</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold font-serif text-foreground mb-2">
          Hi, {user?.name}! 👋
        </h1>
        <p className="text-muted-foreground">Welcome to your GUHMS dashboard</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="hover-elevate transition-all">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-serif flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Appointments
                </CardTitle>
                <Link href="/patient/appointments">
                  <Button variant="ghost" size="sm" className="hover-elevate" data-testid="link-view-all-appointments">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : upcomingAppointments && upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-lg border hover-elevate transition-all"
                      data-testid={`card-appointment-${apt.id}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-foreground">{apt.doctorName}</p>
                        <Badge variant="secondary">{apt.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatAppointmentTime(apt.slotStartTime, 'MMM d, h:mm a')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                  <Link href="/patient/doctors">
                    <Button size="sm" className="hover-elevate active-elevate-2" data-testid="button-book-appointment">
                      Book an Appointment
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="hover-elevate transition-all">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-serif flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Recent Prescriptions
                </CardTitle>
                <Link href="/patient/prescriptions">
                  <Button variant="ghost" size="sm" className="hover-elevate" data-testid="link-view-all-prescriptions">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {prescriptionsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : recentPrescriptions && recentPrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {recentPrescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="p-4 rounded-lg border hover-elevate transition-all"
                      data-testid={`card-prescription-${prescription.id}`}
                    >
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Doctor</p>
                        <p className="font-semibold text-foreground">
                          {prescription.doctorName}
                          {prescription.doctorSpecialization ? (
                            <span className="text-sm text-muted-foreground ml-2">({prescription.doctorSpecialization})</span>
                          ) : null}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatAppointmentTime(prescription.createdAt, 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {prescription.medications.length} medication(s)
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No prescriptions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Appointment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="hover-elevate transition-all">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-serif flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Appointment History
              </CardTitle>
              <Link href="/patient/appointments">
                <Button variant="ghost" size="sm" className="hover-elevate">
                  View All History
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : recentAppointments && recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {recentAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-lg border hover-elevate transition-all"
                    data-testid={`card-history-${apt.id}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Doctor</p>
                        <p className="font-semibold text-foreground">{apt.doctorName}</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatAppointmentTime(apt.startTime || apt.slotStartTime, 'MMM d, h:mm a')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Reason:</strong> {apt.reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No appointment history yet</p>
                {historyError && (
                  <p className="text-red-500 text-sm mt-2">
                    Error: {historyError.message}
                  </p>
                )}
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <p>History loading: {historyLoading ? 'Yes' : 'No'}</p>
                  <p>History data: {appointmentHistory ? appointmentHistory.length : 'null'} items</p>
                  <p>Auth: {isAuthenticated ? 'Yes' : 'No'} | Token: {token ? 'Yes' : 'No'}</p>
                  <p>All appointments: {appointments ? appointments.length : 'null'} items</p>
                  {appointments && appointments.length > 0 && (
                    <div className="text-left mt-2">
                      <p className="font-semibold">Current appointments:</p>
                      {appointments.map(apt => (
                        <p key={apt.id} className="text-xs">
                          Dr: {apt.doctorName || apt.doctorId} - {apt.status} -
                          Time: {apt.startTime || apt.slotStartTime || 'No time'}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={async () => {
                    try {
                      console.log('🧪 Manual history test...');
                      const response = await fetch('/patient/appointments/history', {
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        }
                      });
                      console.log('🧪 Manual response:', response.status, response.statusText);
                      const data = await response.json();
                      console.log('🧪 Manual data:', data);
                    } catch (error) {
                      console.error('🧪 Manual error:', error);
                    }
                  }}
                >
                  Test History API
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/patient/doctors">
                <div
                  className="p-6 rounded-lg border hover-elevate cursor-pointer transition-all text-center"
                  data-testid="card-find-doctors"
                >
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Find Doctors</h3>
                  <p className="text-sm text-muted-foreground">Browse and book appointments</p>
                </div>
              </Link>

              <Link href="/patient/appointments">
                <div
                  className="p-6 rounded-lg border hover-elevate cursor-pointer transition-all text-center"
                  data-testid="card-my-appointments"
                >
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">My Appointments</h3>
                  <p className="text-sm text-muted-foreground">View and manage appointments</p>
                </div>
              </Link>

              <Link href="/patient/prescriptions">
                <div
                  className="p-6 rounded-lg border hover-elevate cursor-pointer transition-all text-center"
                  data-testid="card-prescriptions"
                >
                  <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Prescriptions</h3>
                  <p className="text-sm text-muted-foreground">Access medical prescriptions</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
