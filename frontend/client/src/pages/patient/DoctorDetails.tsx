import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import api from '@/lib/api';
import type { Doctor } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function DoctorDetails() {
  const [, params] = useRoute('/patient/doctors/:id');
  const [, setLocation] = useLocation();
  const doctorId = params?.id;
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: doctor, isLoading: doctorLoading } = useQuery<Doctor>({
    queryKey: ['/patient/doctors', doctorId],
    queryFn: async () => {
      const response = await api.get(`/patient/doctors/${doctorId}`);
      return response.data;
    },
    enabled: !!doctorId,
  });

  const { data: slots, isLoading: slotsLoading } = useQuery<string[]>({
    queryKey: ['/patient/doctors', doctorId, 'slots', selectedDate],
    queryFn: async () => {
      const response = await api.get(`/patient/doctors/${doctorId}/slots?date=${selectedDate}`);
      return response.data;
    },
    enabled: !!doctorId,
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSlot || !reason) return;
      await api.post('/patient/appointments', {
        doctorId,
        slotStartTime: selectedSlot,
        reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/patient/appointments'] });
      toast({
        title: 'Appointment booked',
        description: 'Your appointment request has been submitted',
      });
      setIsBookingDialogOpen(false);
      setLocation('/patient/appointments');
    },
    onError: (error: any) => {
      toast({
        title: 'Booking failed',
        description: error.message || 'Failed to book appointment',
        variant: 'destructive',
      });
    },
  });

  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot);
    setIsBookingDialogOpen(true);
  };

  const handleBooking = () => {
    if (reason.trim().length < 5) {
      toast({
        title: 'Validation error',
        description: 'Please provide a reason (at least 5 characters)',
        variant: 'destructive',
      });
      return;
    }
    bookAppointmentMutation.mutate();
  };

  if (doctorLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Doctor not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => setLocation('/patient/doctors')}
        className="hover-elevate"
        data-testid="button-back"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Doctors
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-6 flex-wrap">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-primary">
                  {doctor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-[200px]">
                <h1 className="text-3xl font-bold font-serif text-foreground mb-2">{doctor.name}</h1>
                <Badge variant="secondary" className="mb-4">
                  {doctor.specialization}
                </Badge>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="h-5 w-5" />
                    <span>{doctor.experienceYears} years of experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>{doctor.slotDuration} minute appointments</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle className="text-xl font-serif">Available Slots</CardTitle>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
              className="px-4 py-2 rounded-lg border bg-background text-foreground"
              data-testid="input-date-selector"
            />
          </div>
        </CardHeader>
        <CardContent>
          {slotsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : slots && slots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {slots.map((slot, index) => (
                <motion.div
                  key={slot}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-16 hover-elevate active-elevate-2"
                    onClick={() => handleSlotClick(slot)}
                    data-testid={`button-slot-${index}`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">{format(new Date(slot), 'h:mm a')}</div>
                      <div className="text-xs text-muted-foreground">Available</div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No available slots for this date</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Confirm Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Doctor</p>
              <p className="font-semibold text-foreground">{doctor.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
              <p className="font-semibold text-foreground">
                {selectedSlot && format(new Date(selectedSlot), 'MMMM d, yyyy - h:mm a')}
              </p>
            </div>
            <div>
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                placeholder="Describe your symptoms or reason for the appointment..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="mt-2"
                data-testid="input-reason"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 5 characters
              </p>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsBookingDialogOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBooking}
                disabled={bookAppointmentMutation.isPending || reason.trim().length < 5}
                className="hover-elevate active-elevate-2"
                data-testid="button-confirm-booking"
              >
                {bookAppointmentMutation.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
