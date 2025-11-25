import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Users, Calendar, FileText, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@assets/generated_images/doctor_patient_consultation_scene.png';

const features = [
  {
    icon: Shield,
    title: 'Admin Dashboard',
    description: 'Comprehensive management of doctors, patients, and hospital operations with real-time analytics and insights.',
  },
  {
    icon: Activity,
    title: 'Doctor Portal',
    description: 'Streamlined appointment management, patient records, and prescription tools for efficient healthcare delivery.',
  },
  {
    icon: Calendar,
    title: 'Patient Portal',
    description: 'Easy appointment booking, prescription access, and seamless communication with healthcare providers.',
  },
];

const benefits = [
  { icon: Users, title: 'Unified Platform', description: 'All-in-one solution for hospitals' },
  { icon: Clock, title: '24/7 Access', description: 'Anytime, anywhere availability' },
  { icon: FileText, title: 'Digital Records', description: 'Secure electronic health records' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <div className="pt-16">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60 backdrop-blur-sm" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6 text-foreground">
                GUHMS
              </h1>
              <p className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
                Galgotias University Hospital Management System
              </p>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Revolutionizing healthcare delivery with seamless coordination between administrators,
                doctors, and patients for superior medical care.
              </p>

              <div className="flex flex-wrap gap-4 justify-center" data-testid="hero-cta">
                <Link href="/login">
                  <Button size="lg" className="text-lg px-8 hover-elevate active-elevate-2" data-testid="button-hero-login">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 bg-background/60 backdrop-blur-md hover-elevate active-elevate-2"
                    data-testid="button-hero-signup"
                  >
                    Register as Patient
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-accent/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-foreground">
                Comprehensive Healthcare Solutions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage modern healthcare operations efficiently
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover-elevate transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-primary/5">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-foreground">
                Ready to Transform Healthcare?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of healthcare professionals using GUHMS
              </p>
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 hover-elevate active-elevate-2" data-testid="button-cta-signup">
                  Get Started Today
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
