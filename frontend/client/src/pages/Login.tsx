import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginRequest } from '@shared/schema';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Activity, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const dashboardMap = {
        ADMIN: '/admin',
        DOCTOR: '/doctor',
        PATIENT: '/patient',
      };
      setLocation(dashboardMap[user.role]);
    }
  }, [isAuthenticated, user, authLoading, setLocation]);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const authData = response.data;
      
      login(authData);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${authData.name}!`,
      });

      // Redirect based on role
      const dashboardMap = {
        ADMIN: '/admin',
        DOCTOR: '/doctor',
        PATIENT: '/patient',
      };
      setLocation(dashboardMap[authData.role]);
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-foreground">Welcome Back</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in to access your GUHMS dashboard
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="admin@hms.com"
                          data-testid="input-email"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          data-testid="input-password"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full hover-elevate active-elevate-2"
                  disabled={isLoading}
                  data-testid="button-submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex-col gap-3 border-t pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link href="/signup">
                <span className="text-primary hover:underline cursor-pointer font-medium" data-testid="link-signup">
                  Register as Patient
                </span>
              </Link>
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Test credentials: admin@hms.com / Admin@123
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
