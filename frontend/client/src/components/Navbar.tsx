import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, LogOut, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const getInitials = (name?: string) => {
    const source = (name ?? '').trim();
    if (!source) return 'U';
    const parts = source.split(/\s+/).filter(Boolean);
    const initials = parts.map((n) => n[0]).join('').toUpperCase();
    return (initials || source.slice(0, 2).toUpperCase()).slice(0, 2);
  };

  const roleBasedLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case 'ADMIN':
        return (
          <>
            <Link href="/admin" data-testid="link-admin-dashboard">
              <Button variant="ghost" size="sm" className="hover-elevate">
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/doctors" data-testid="link-admin-doctors">
              <Button variant="ghost" size="sm" className="hover-elevate">
                Doctors
              </Button>
            </Link>
            <Link href="/admin/patients" data-testid="link-admin-patients">
              <Button variant="ghost" size="sm" className="hover-elevate">
                Patients
              </Button>
            </Link>
          </>
        );
      case 'DOCTOR':
        return (
          <>
            <Link href="/doctor" data-testid="link-doctor-dashboard">
              <Button variant="ghost" size="sm" className="hover-elevate">
                Dashboard
              </Button>
            </Link>
            <Link href="/doctor/appointments" data-testid="link-doctor-appointments">
              <Button variant="ghost" size="sm" className="hover-elevate">
                Appointments
              </Button>
            </Link>
          </>
        );
      case 'PATIENT':
        return (
          <>
            <Link href="/patient" data-testid="link-patient-dashboard">
              <Button variant="ghost" size="sm" className="hover-elevate">
                Dashboard
              </Button>
            </Link>
            <Link href="/patient/doctors" data-testid="link-patient-doctors">
              <Button variant="ghost" size="sm" className="hover-elevate">
                Find Doctors
              </Button>
            </Link>
            <Link href="/patient/appointments" data-testid="link-patient-appointments">
              <Button variant="ghost" size="sm" className="hover-elevate">
                My Appointments
              </Button>
            </Link>
            <Link href="/patient/prescriptions" data-testid="link-patient-prescriptions">
              <Button variant="ghost" size="sm" className="hover-elevate">
                Prescriptions
              </Button>
            </Link>
          </>
        );
    }
  };

  const publicLinks = !isAuthenticated && (
    <>
      <Link href="/" data-testid="link-home">
        <Button variant="ghost" size="sm" className="hover-elevate">
          Home
        </Button>
      </Link>
      <Link href="/login" data-testid="link-login">
        <Button variant="ghost" size="sm" className="hover-elevate">
          Login
        </Button>
      </Link>
      <Link href="/signup" data-testid="link-signup">
        <Button size="sm" className="hover-elevate active-elevate-2">
          Register
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/80 backdrop-blur-lg">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" data-testid="link-logo">
          <div className="flex items-center gap-3 cursor-pointer hover-elevate rounded-lg px-3 py-2">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-semibold font-serif text-foreground">GUHMS</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Hospital Management</p>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? roleBasedLinks() : publicLinks}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover-elevate"
            data-testid="button-theme-toggle"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full hover-elevate"
                  data-testid="button-user-menu"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{(user.role ?? '').toLowerCase()}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
