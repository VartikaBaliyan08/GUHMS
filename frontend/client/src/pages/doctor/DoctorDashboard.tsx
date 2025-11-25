import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, CheckCircle, XCircle, FileText, Pill } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import api from '@/lib/api';
import type { Appointment } from '@shared/schema';
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

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    ACCEPTED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    VISITED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    RESCHEDULE_PROPOSED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    RESCHEDULE_PENDING_PATIENT: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default function DoctorDashboard() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { toast } = useToast();

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ['/doctor/appointments', selectedDate],
    queryFn: async () => {
      const response = await api.get(`/doctor/appointments?date=${selectedDate}`);
      return response.data;
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/doctor/appointments/${id}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/doctor/appointments'] });
      toast({ title: 'Appointment accepted' });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/doctor/appointments/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/doctor/appointments'] });
      toast({ title: 'Appointment rejected' });
    },
  });

  const markVisitedMutation = useMutation({
    mutationFn: async (id: string) => {
      const appointment = appointments?.find((a) => a.id === id);
      if (!appointment) return;
      
      await api.put(`/doctor/appointments/${id}/visited`, {
        actualStartTime: appointment.slotStartTime,
        actualEndTime: appointment.slotEndTime,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/doctor/appointments'] });
      toast({ title: 'Marked as visited' });
    },
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: async (prescriptionData: { appointmentId: string; medications: any[]; notes: string }) => {
      const response = await api.post(`/doctor/appointments/${prescriptionData.appointmentId}/prescription`, {
        medications: prescriptionData.medications,
        notes: prescriptionData.notes
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/doctor/appointments'] });
      toast({ 
        title: 'Success',
        description: 'Prescription created successfully' 
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create prescription',
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Manage your appointments and patient care</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle className="text-xl font-serif">
              Appointments for {formatAppointmentTime(selectedDate + 'T00:00:00', 'MMMM d, yyyy')}
            </CardTitle>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-background text-foreground"
              data-testid="input-date-selector"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : appointments && appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover-elevate transition-all" data-testid={`card-appointment-${appointment.id}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div className="space-y-2 flex-1 min-w-[200px]">
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">Patient</p>
                              <p className="font-semibold text-foreground">
                                {appointment.patientName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatAppointmentTime(appointment.startTime || appointment.slotStartTime || '', 'h:mm a')} -{' '}
                              {formatAppointmentTime(appointment.endTime || appointment.slotEndTime || '', 'h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Reason:</strong> {appointment.reason}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          <Badge className={getStatusColor(appointment.status)} data-testid={`badge-status-${appointment.id}`}>
                            {appointment.status.replace(/_/g, ' ')}
                          </Badge>

                          {appointment.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => acceptMutation.mutate(appointment.id)}
                                disabled={acceptMutation.isPending}
                                data-testid={`button-accept-${appointment.id}`}
                                className="hover-elevate active-elevate-2"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectMutation.mutate(appointment.id)}
                                disabled={rejectMutation.isPending}
                                data-testid={`button-reject-${appointment.id}`}
                                className="hover-elevate active-elevate-2"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}

                          {appointment.status === 'ACCEPTED' && (
                            <Button
                              size="sm"
                              onClick={() => markVisitedMutation.mutate(appointment.id)}
                              disabled={markVisitedMutation.isPending}
                              data-testid={`button-visited-${appointment.id}`}
                              className="hover-elevate active-elevate-2"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Mark Visited
                            </Button>
                          )}

                          {appointment.status === 'VISITED' && (
                            <PrescriptionDialog
                              appointment={appointment}
                              onCreatePrescription={createPrescriptionMutation.mutate}
                              isLoading={createPrescriptionMutation.isPending}
                            />
                          )}

                          <PatientHistoryDialog patientId={appointment.patientId} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No appointments for this date</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Prescription Dialog Component
function PrescriptionDialog({ 
  appointment, 
  onCreatePrescription, 
  isLoading 
}: { 
  appointment: Appointment; 
  onCreatePrescription: (data: any) => void;
  isLoading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '', notes: '' }
  ]);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = medications.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    );
    setMedications(updated);
  };

  const handleSubmit = () => {
    // Validate that at least one medication has a name
    const validMedications = medications.filter(med => med.name.trim());
    if (validMedications.length === 0) {
      return;
    }

    onCreatePrescription({
      appointmentId: appointment.id,
      medications: validMedications,
      notes: prescriptionNotes.trim(),
    });

    // Reset form and close dialog
    setMedications([{ name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
    setPrescriptionNotes('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="hover-elevate active-elevate-2"
          data-testid={`button-prescription-${appointment.id}`}
        >
          <Pill className="h-4 w-4 mr-1" />
          Write Prescription
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Write Prescription</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Patient: {appointment.patientName} | Appointment: {formatAppointmentTime(appointment.slotStartTime, 'MMM d, yyyy')}
          </p>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-3">
              <Label>Medications *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMedication}
              >
                Add Medication
              </Button>
            </div>
            
            {medications.map((medication, index) => (
              <div key={index} className="border rounded-lg p-4 mb-3 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Medication {index + 1}</h4>
                  {medications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Medicine Name *</Label>
                    <Input
                      placeholder="e.g., Paracetamol"
                      value={medication.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input
                      placeholder="e.g., 500mg"
                      value={medication.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Input
                      placeholder="e.g., BID (twice daily)"
                      value={medication.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      placeholder="e.g., 5 days"
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Notes</Label>
                  <Input
                    placeholder="e.g., after food"
                    value={medication.notes}
                    onChange={(e) => updateMedication(index, 'notes', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <Label htmlFor="prescriptionNotes">Prescription Notes</Label>
            <Textarea
              id="prescriptionNotes"
              placeholder="General instructions or observations..."
              value={prescriptionNotes}
              onChange={(e) => setPrescriptionNotes(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={medications.every(med => !med.name.trim()) || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Prescription'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PatientHistoryDialog({ patientId }: { patientId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useQuery<{ appointments: Appointment[]; prescriptions: any[] }>({
    queryKey: ['/doctor/patients', patientId, 'history'],
    queryFn: async () => {
      const response = await api.get(`/doctor/patients/${patientId}/history`);
      return response.data;
    },
    enabled: isOpen && !!patientId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover-elevate active-elevate-2">
          Patient History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Patient History</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="font-semibold mb-2">Appointments</h3>
            <div className="space-y-2">
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : data?.appointments && data.appointments.length > 0 ? (
                data.appointments.map((apt) => (
                  <div key={apt.id} className="p-3 rounded-lg border">
                    <p className="font-medium text-foreground">{apt.status}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatAppointmentTime(apt.startTime || apt.slotStartTime || '', 'MMM d, yyyy h:mm a')} - {formatAppointmentTime(apt.endTime || apt.slotEndTime || '', 'h:mm a')}
                    </p>
                    <p className="text-sm text-muted-foreground">Reason: {apt.reason}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No appointments</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Prescriptions</h3>
            <div className="space-y-2">
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : data?.prescriptions && data.prescriptions.length > 0 ? (
                data.prescriptions.map((presc) => (
                  <div key={presc.id} className="p-3 rounded-lg border">
                    <p className="font-medium text-foreground">Prescription #{presc.id}</p>
                    <p className="text-sm text-muted-foreground">{formatAppointmentTime(presc.createdAt, 'MMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">Medications: {presc.medications?.length || 0}</p>
                    {presc.notes && <p className="text-sm text-muted-foreground">Notes: {presc.notes}</p>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No prescriptions</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
