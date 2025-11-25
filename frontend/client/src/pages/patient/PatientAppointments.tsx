import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import type { Appointment } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    ACCEPTED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    VISITED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    RESCHEDULE_PENDING_PATIENT: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Helper function to safely parse and format dates
function formatAppointmentTime(dateTimeString: string): string {
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
    
    return format(date, 'MMM d, yyyy - h:mm a');
  } catch (error) {
    console.error('Date parsing error:', error, 'for value:', dateTimeString);
    return 'Invalid Date';
  }
}

export default function PatientAppointments() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { toast } = useToast();
  const { isAuthenticated, token, isLoading: authLoading } = useAuth();

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ['/patient/appointments'],
    enabled: !authLoading && isAuthenticated && !!token,
  });

  const { data: history, isLoading: historyLoading, error: historyError } = useQuery<Appointment[]>({
    queryKey: ['/patient/appointments/history'],
    enabled: !authLoading && isAuthenticated && !!token,
    onSuccess: (data) => {
      console.log('🔍 Patient appointments history loaded:', data);
    },
    onError: (error) => {
      console.error('🔥 Patient history query error:', error);
    }
  });

  const acceptRescheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/patient/appointments/${id}/accept-reschedule`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/patient/appointments'] });
      toast({ title: 'Reschedule accepted' });
    },
  });

  const rejectRescheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/patient/appointments/${id}/reject-reschedule`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/patient/appointments'] });
      toast({ title: 'Reschedule rejected' });
    },
  });

  const upcomingAppointments = appointments?.filter(
    (apt) => apt.status === 'PENDING' || apt.status === 'ACCEPTED' || apt.status === 'RESCHEDULE_PENDING_PATIENT'
  );

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground mb-2">My Appointments</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const renderAppointmentCard = (apt: Appointment, index: number) => (
    <motion.div
      key={apt.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="hover-elevate transition-all" data-testid={`card-appointment-${apt.id}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div className="space-y-2 flex-1 min-w-[200px]">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Doctor</p>
                  <p className="font-semibold text-foreground">
                    {apt.doctorName || 'Unknown Doctor'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {formatAppointmentTime(apt.startTime || apt.slotStartTime)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Reason:</strong> {apt.reason}
              </p>

              {apt.status === 'RESCHEDULE_PENDING_PATIENT' && apt.proposedNewTime && (
                <div className="mt-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <p className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-2">
                    New time proposed by doctor:
                  </p>
                  <p className="text-sm text-orange-800 dark:text-orange-400">
                    {formatAppointmentTime(apt.proposedNewTime)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 items-end">
              <Badge className={getStatusColor(apt.status)} data-testid={`badge-status-${apt.id}`}>
                {apt.status.replace(/_/g, ' ')}
              </Badge>

              {apt.status === 'RESCHEDULE_PENDING_PATIENT' && (
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => acceptRescheduleMutation.mutate(apt.id)}
                    disabled={acceptRescheduleMutation.isPending}
                    data-testid={`button-accept-reschedule-${apt.id}`}
                    className="hover-elevate active-elevate-2"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => rejectRescheduleMutation.mutate(apt.id)}
                    disabled={rejectRescheduleMutation.isPending}
                    data-testid={`button-reject-reschedule-${apt.id}`}
                    className="hover-elevate active-elevate-2"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground mb-2">My Appointments</h1>
        <p className="text-muted-foreground">View and manage your appointments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : upcomingAppointments && upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map(renderAppointmentCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {historyLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : history && history.length > 0 ? (
            <div className="space-y-4">
              {history.map(renderAppointmentCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointment history</p>
                <p className="text-sm text-muted-foreground mt-2">
                  History shows appointments that have ended
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
