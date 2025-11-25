import { Link } from 'wouter';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-6 w-6 text-primary" />
              <h3 className="font-semibold font-serif text-foreground">GUHMS</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Galgotias University Hospital Management System
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Made with care for hospitals & patients
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" data-testid="link-footer-home">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Home
                </span>
              </Link>
              <br />
              <Link href="/login" data-testid="link-footer-login">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Login
                </span>
              </Link>
              <br />
              <Link href="/signup" data-testid="link-footer-signup">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Register
                </span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Legal</h4>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Terms of Service
              </p>
              <p className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Privacy Policy
              </p>
              <p className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Help Center
              </p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GUHMS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
