import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCog, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import type { AdminStats } from '@shared/schema';

export default function AdminDashboard() {
  const { isAuthenticated, token, isLoading: authLoading } = useAuth();

  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['/admin/stats'],
    enabled: !authLoading && isAuthenticated && !!token,
  });

  const { data: doctors } = useQuery({
    queryKey: ['/admin/doctors'],
    enabled: !authLoading && isAuthenticated && !!token,
  });

  const { data: patients } = useQuery({
    queryKey: ['/admin/patients'],
    enabled: !authLoading && isAuthenticated && !!token,
  });

  const statsData = [
    {
      title: 'Total Doctors',
      value: stats?.totalDoctors ?? doctors?.length ?? 0,
      icon: UserCog,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Patients',
      value: stats?.totalPatients ?? patients?.length ?? 0,
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments ?? 0,
      icon: Calendar,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage doctors, patients, and oversee hospital operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="hover-elevate transition-all duration-300" data-testid={`card-stat-${stat.title.toLowerCase().replace(/['\s]/g, '-')}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <p className="text-3xl font-bold text-foreground" data-testid={`text-stat-${stat.title.toLowerCase().replace(/['\s]/g, '-')}`}>
                        {stat.value}
                      </p>
                    )}
                  </div>
                  <div className={`h-12 w-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/doctors">
              <div className="p-4 rounded-lg border hover-elevate cursor-pointer transition-all" data-testid="link-manage-doctors">
                <h3 className="font-semibold text-foreground mb-1">Manage Doctors</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or remove doctor accounts and slots</p>
              </div>
            </Link>
            <Link href="/admin/patients">
              <div className="p-4 rounded-lg border hover-elevate cursor-pointer transition-all" data-testid="link-manage-patients">
                <h3 className="font-semibold text-foreground mb-1">Manage Patients</h3>
                <p className="text-sm text-muted-foreground">View and update patient information</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="font-semibold text-foreground">
                  {(stats?.totalDoctors ?? 0) + (stats?.totalPatients ?? 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">System Status</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
