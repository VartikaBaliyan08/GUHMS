import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import type { Patient } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

export default function PatientsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<null | {
    id: string;
    name?: string;
    email?: string;
    age: number;
    gender: string;
    contactInfo: string;
  }>(null);
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();

  type AdminPatientDto = {
    id: string;
    userId: string;
    name: string;
    email: string;
    age: number;
    gender: string;
    contactInfo: string;
    mobile: string;
  };

  const { data: patients, isLoading, isError } = useQuery<AdminPatientDto[]>({
    queryKey: ['/admin/patients'],
    enabled: isAuthenticated && !!token,
    queryFn: async () => {
      const response = await api.get('/admin/patients');
      const data = Array.isArray(response.data)
        ? response.data
        : (response.data?.patients || response.data?.data || []);
      return data as AdminPatientDto[];
    },
  });

  const filteredPatients = patients?.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      String(p.age ?? '').includes(q) ||
      (p.gender || '').toLowerCase().includes(q) ||
      (p.contactInfo || '').toLowerCase().includes(q)
    );
  }) || [];

  const updatePatientMutation = useMutation({
    mutationFn: async (payload: { id: string; name?: string; email?: string; gender?: string; contactInfo?: string; mobile?: string }) => {
      const { id, ...data } = payload;
      await api.put(`/admin/patients/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/patients'] });
      toast({ title: 'Patient updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Update failed', description: error.message || 'Unable to update patient', variant: 'destructive' });
    }
  });

  const deletePatientMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/patients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/patients'] });
      toast({ title: 'Patient deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Delete failed', description: error.message || 'Unable to delete patient', variant: 'destructive' });
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Patients Management</h1>
        <p className="text-muted-foreground">View and manage patient information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle className="text-xl font-serif">All Patients</CardTitle>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-patients"
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
          ) : isError ? (
            <div className="text-center py-8 text-muted-foreground">Failed to load patients</div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients && filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id} data-testid={`row-patient-${patient.id}`}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell className="text-muted-foreground">{patient.email}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell className="text-muted-foreground">{patient.contactInfo}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => {
                                setEditingPatient({ id: patient.id, age: patient.age, gender: patient.gender, contactInfo: patient.contactInfo, name: patient.name, email: patient.email });
                                setIsEditOpen(true);
                              }}
                              data-testid={`button-edit-patient-${patient.id}`}
                              className="hover-elevate active-elevate-2"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deletePatientMutation.mutate(patient.id)}
                              data-testid={`button-delete-patient-${patient.id}`}
                              className="hover-elevate active-elevate-2"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No patients found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          {editingPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={(editingPatient as any).name || ''}
                    onChange={(e) => setEditingPatient({ ...(editingPatient as any), name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={(editingPatient as any).email || ''}
                    onChange={(e) => setEditingPatient({ ...(editingPatient as any), email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Age</label>
                  <Input
                    type="number"
                    value={editingPatient.age}
                    disabled
                  />
              </div>
              <div>
                <label className="text-sm font-medium">Gender</label>
                <Select
                  value={editingPatient.gender}
                  onValueChange={(val) => setEditingPatient({ ...editingPatient, gender: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">MALE</SelectItem>
                    <SelectItem value="FEMALE">FEMALE</SelectItem>
                    <SelectItem value="OTHER">OTHER</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Contact Info</label>
                <Input
                  value={editingPatient.contactInfo}
                  onChange={(e) => setEditingPatient({ ...editingPatient, contactInfo: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!editingPatient) return;
                updatePatientMutation.mutate({
                  id: editingPatient.id,
                  name: editingPatient.name,
                  email: editingPatient.email,
                  gender: editingPatient.gender,
                  contactInfo: editingPatient.contactInfo,
                });
                setIsEditOpen(false);
              }}
              className="hover-elevate active-elevate-2"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
