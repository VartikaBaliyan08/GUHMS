import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Calendar } from 'lucide-react';
import { Link } from 'wouter';
import type { Doctor } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function FindDoctors() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: doctors, isLoading } = useQuery<Doctor[]>({
    queryKey: ['/patient/doctors'],
  });

  const filteredDoctors = doctors?.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Find Doctors</h1>
        <p className="text-muted-foreground">Browse our network of healthcare professionals</p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by name or specialization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-lg"
          data-testid="input-search-doctors"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors && filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="hover-elevate transition-all h-full" data-testid={`card-doctor-${doctor.id}`}>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-primary">
                          {doctor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{doctor.name}</h3>
                      <Badge variant="secondary" className="mb-2">
                        {doctor.specialization}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4" />
                        <span>{doctor.experienceYears} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{doctor.slotDuration} min appointments</span>
                      </div>
                    </div>

                    <Link href={`/patient/doctors/${doctor.id}`}>
                      <Button className="w-full hover-elevate active-elevate-2" data-testid={`button-view-doctor-${doctor.id}`}>
                        View Availability
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No doctors found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
