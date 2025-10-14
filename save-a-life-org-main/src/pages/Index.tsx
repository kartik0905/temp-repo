import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Users, Activity, Shield, Clock, Award } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto text-center relative z-10 animate-fade-in">
          <Heart className="h-16 w-16 mx-auto mb-6 fill-current" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Save Lives Through Organ Donation
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            LifeLink connects donors, patients, and healthcare providers in a seamless platform dedicated to saving lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/roles">
              <Button size="lg" variant="hero" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-none shadow-lg bg-gradient-card">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-primary mb-2" />
                <CardTitle className="text-4xl font-bold text-primary">10,000+</CardTitle>
                <CardDescription>Registered Donors</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-none shadow-lg bg-gradient-card">
              <CardHeader>
                <Heart className="h-12 w-12 mx-auto text-secondary mb-2 fill-secondary" />
                <CardTitle className="text-4xl font-bold text-secondary">5,000+</CardTitle>
                <CardDescription>Lives Saved</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-none shadow-lg bg-gradient-card">
              <CardHeader>
                <Activity className="h-12 w-12 mx-auto text-accent mb-2" />
                <CardTitle className="text-4xl font-bold text-accent">98%</CardTitle>
                <CardDescription>Success Rate</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">How LifeLink Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform makes organ donation simple, secure, and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Secure & Verified</CardTitle>
                <CardDescription>
                  All users are verified through our secure authentication system with role-based access control.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Clock className="h-10 w-10 text-secondary mb-4" />
                <CardTitle>Real-Time Matching</CardTitle>
                <CardDescription>
                  Our advanced algorithm matches donors with patients in real-time for faster, life-saving connections.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Award className="h-10 w-10 text-accent mb-4" />
                <CardTitle>Expert Management</CardTitle>
                <CardDescription>
                  Healthcare professionals and administrators monitor and manage all donations with precision.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-accent text-accent-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of donors and patients who trust LifeLink. Register today and be part of something meaningful.
          </p>
          <Link to="/roles">
            <Button size="lg" className="text-lg px-8 bg-white text-accent hover:bg-white/90">
              Register Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
