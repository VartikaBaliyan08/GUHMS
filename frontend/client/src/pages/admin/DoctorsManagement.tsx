import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, Edit, Trash2, Loader2, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import api from '@/lib/api';
import type { Doctor } from '@shared/schema';
import { createDoctorSchema, type CreateDoctorRequest } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

export default function DoctorsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, token, isLoading: authLoading } = useAuth();

  // Debug logging
  console.log('🔍 DoctorsManagement render:', {
    isAuthenticated,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
    authLoading
  });

  const { data: doctors, isLoading } = useQuery<Doctor[]>({
    queryKey: ['/admin/doctors'],
    enabled: !authLoading && isAuthenticated && !!token, // Wait for auth to finish loading
  });

  const createDoctorMutation = useMutation({
    mutationFn: async (data: CreateDoctorRequest) => {
      const response = await api.post('/admin/doctors', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/doctors'] });
      toast({
        title: 'Success',
        description: 'Doctor added successfully',
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add doctor',
        variant: 'destructive',
      });
    },
  });

  const deleteDoctorMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/doctors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/doctors'] });
      toast({
        title: 'Success',
        description: 'Doctor removed successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove doctor',
        variant: 'destructive',
      });
    },
  });

  const form = useForm<CreateDoctorRequest>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      specialization: '',
      experienceYears: 0,
      slotDuration: 30,
      workingHours: [
        { day: 'MONDAY', startTime: '09:00', endTime: '17:00' },
      ],
    },
  });

  const onSubmit = (data: CreateDoctorRequest) => {
    createDoctorMutation.mutate(data);
  };

  const filteredDoctors = doctors?.filter((doctor) =>
    doctor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Doctors Management</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Doctors Management</h1>
        <p className="text-muted-foreground">Manage doctor accounts and appointment slots</p>
      </div>

      <Tabs defaultValue="doctors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="doctors" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Manage Doctors
          </TabsTrigger>
          <TabsTrigger value="slots" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Manage Slots
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doctors" className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hover-elevate active-elevate-2" data-testid="button-add-doctor">
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">Add New Doctor</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Dr. Smith" data-testid="input-doctor-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="doctor@hms.com" data-testid="input-doctor-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="••••••••" data-testid="input-doctor-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Cardiology" data-testid="input-doctor-specialization" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experienceYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience (years)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="10"
                            data-testid="input-doctor-experience"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="slotDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slot Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="30"
                          data-testid="input-doctor-slot-duration"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full hover-elevate active-elevate-2"
                  disabled={createDoctorMutation.isPending}
                  data-testid="button-submit-doctor"
                >
                  {createDoctorMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Doctor'
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle className="text-xl font-serif">All Doctors</CardTitle>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-doctors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors && filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                      <TableRow key={doctor.id} data-testid={`row-doctor-${doctor.id}`}>
                        <TableCell className="font-medium">{doctor.name}</TableCell>
                        <TableCell className="text-muted-foreground">{doctor.email}</TableCell>
                        <TableCell>{doctor.specialization}</TableCell>
                        <TableCell>{doctor.experienceYears} years</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover-elevate"
                              data-testid={`button-delete-doctor-${doctor.id}`}
                              onClick={() => deleteDoctorMutation.mutate(doctor.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No doctors found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="slots" className="space-y-6">
          <WorkingHoursManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Working Hours Management Component (which generates slots)
// Helper function to calculate number of slots
function calculateSlotCount(startTime: string, endTime: string, slotDuration: number): number {
  try {
    // Parse time strings (HH:mm format)
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // Convert to minutes
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    // Calculate duration in minutes
    const durationMinutes = endMinutes - startMinutes;
    
    // Calculate number of slots
    const slots = Math.floor(durationMinutes / slotDuration);
    
    return slots > 0 ? slots : 0;
  } catch (error) {
    console.error('Error calculating slots:', error);
    return 0;
  }
}

function WorkingHoursManagement() {
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const { toast } = useToast();
  const { isAuthenticated, token, isLoading: authLoading } = useAuth();

  const { data: doctors } = useQuery<Doctor[]>({
    queryKey: ['/admin/doctors'],
    enabled: !authLoading && isAuthenticated && !!token,
  });

  // Get selected doctor details
  const selectedDoctorData = doctors?.find(d => d.id === selectedDoctor);
  
  // Debug logging
  if (selectedDoctorData) {
    console.log('🔍 Selected doctor data:', selectedDoctorData);
    console.log('🔍 Working hours:', selectedDoctorData.workingHours);
    console.log('🔍 Slot duration:', selectedDoctorData.slotDuration);
  }

  const updateDoctorMutation = useMutation({
    mutationFn: async (doctorData: any) => {
      const response = await api.put(`/admin/doctors/${selectedDoctor}`, doctorData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/doctors'] });
      toast({
        title: 'Success',
        description: 'Doctor working hours updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update working hours',
        variant: 'destructive',
      });
    },
  });

  const addWorkingHour = (newWorkingHour: { day: string; startTime: string; endTime: string }) => {
    if (!selectedDoctorData) return;

    const updatedWorkingHours = [...(selectedDoctorData.workingHours || []), newWorkingHour];
    
    updateDoctorMutation.mutate({
      specialization: selectedDoctorData.specialization,
      experienceYears: selectedDoctorData.experienceYears,
      slotDuration: selectedDoctorData.slotDuration,
      workingHours: updatedWorkingHours,
    });
  };

  const removeWorkingHour = (index: number) => {
    if (!selectedDoctorData) return;

    const updatedWorkingHours = selectedDoctorData.workingHours?.filter((_, i) => i !== index) || [];
    
    updateDoctorMutation.mutate({
      specialization: selectedDoctorData.specialization,
      experienceYears: selectedDoctorData.experienceYears,
      slotDuration: selectedDoctorData.slotDuration,
      workingHours: updatedWorkingHours,
    });
  };

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Working Hours Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage doctor availability windows. Appointment slots are automatically generated from these working hours.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Doctor</label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors?.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDoctorData && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Working Hours for Dr. {selectedDoctorData.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Slot Duration: {selectedDoctorData.slotDuration} minutes
                  </p>
                </div>
                <AddWorkingHourDialog
                  onAdd={addWorkingHour}
                  daysOfWeek={daysOfWeek}
                />
              </div>

              <div className="space-y-3">
                {selectedDoctorData.workingHours && selectedDoctorData.workingHours.length > 0 ? (
                  selectedDoctorData.workingHours.map((workingHour: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{workingHour.day}</p>
                        <p className="text-sm text-muted-foreground">
                          {workingHour.startTime} - {workingHour.endTime}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Generates {calculateSlotCount(workingHour.startTime, workingHour.endTime, selectedDoctorData.slotDuration)} slots
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkingHour(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No working hours configured. Add working hours to generate appointment slots.
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Add Working Hour Dialog Component
function AddWorkingHourDialog({ 
  onAdd, 
  daysOfWeek 
}: { 
  onAdd: (data: { day: string; startTime: string; endTime: string }) => void;
  daysOfWeek: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleAdd = () => {
    if (!day || !startTime || !endTime) {
      return;
    }
    
    onAdd({
      day,
      startTime,
      endTime,
    });
    
    setIsOpen(false);
    setDay('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="hover-elevate active-elevate-2">
          <Plus className="mr-2 h-4 w-4" />
          Add Working Hours
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Working Hours</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Add a time window when the doctor is available. Appointment slots will be automatically generated.
          </p>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Day of Week</label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((dayName) => (
                  <SelectItem key={dayName} value={dayName}>
                    {dayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Start Time</label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">End Time</label>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleAdd} 
            className="w-full"
            disabled={!day || !startTime || !endTime}
          >
            Add Working Hours
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
