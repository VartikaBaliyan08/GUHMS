import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, User, Pill } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { Prescription } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function PatientPrescriptions() {
  const { data: prescriptions, isLoading } = useQuery<Prescription[]>({
    queryKey: ['/patient/prescriptions'],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground mb-2">My Prescriptions</h1>
        <p className="text-muted-foreground">Access your medical prescriptions</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : prescriptions && prescriptions.length > 0 ? (
        <div className="space-y-4">
          {prescriptions.map((prescription, index) => (
            <motion.div
              key={prescription.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover-elevate transition-all" data-testid={`card-prescription-${prescription.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="space-y-1">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Doctor</p>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl font-serif">{prescription.doctorName}</CardTitle>
                            {prescription.doctorSpecialization && (
                              <span className="text-sm text-muted-foreground">({prescription.doctorSpecialization})</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(prescription.createdAt), 'MMMM d, yyyy')}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {prescription.medications.length} Medication(s)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {prescription.medications.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border hover-elevate transition-all"
                      data-testid={`medication-${prescription.id}-${idx}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Pill className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground mb-2">{med.name}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Dosage</p>
                              <p className="font-medium text-foreground">{med.dosage}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Frequency</p>
                              <p className="font-medium text-foreground">{med.frequency}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Duration</p>
                              <p className="font-medium text-foreground">{med.duration}</p>
                            </div>
                            {med.notes && (
                              <div className="col-span-2 md:col-span-4">
                                <p className="text-muted-foreground">Notes</p>
                                <p className="font-medium text-foreground">{med.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {prescription.notes && (
                    <div className="p-4 rounded-lg bg-accent/30">
                      <p className="text-sm font-semibold text-foreground mb-1">Doctor's Notes</p>
                      <p className="text-sm text-muted-foreground">{prescription.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No prescriptions found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
