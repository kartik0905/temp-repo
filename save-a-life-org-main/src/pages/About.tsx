import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Target, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto text-center">
            <Heart className="h-16 w-16 mx-auto mb-6 fill-current" />
            <h1 className="text-5xl font-bold mb-6">About LifeLink</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              We're on a mission to save lives by connecting organ donors with patients in need through technology and compassion.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <Card className="border-2">
                <CardHeader>
                  <Target className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To create a seamless, efficient, and compassionate organ donation management system that saves lives by connecting donors with patients in need, powered by cutting-edge technology and supported by dedicated healthcare professionals.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <Award className="h-10 w-10 text-secondary mb-4" />
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A world where no patient dies waiting for an organ transplant. We envision a future where organ donation is accessible, efficient, and celebrated as the ultimate act of human kindness.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Values */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Heart className="h-12 w-12 text-accent mx-auto mb-4 fill-accent" />
                  <CardTitle>Compassion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every life matters. We approach each case with empathy, understanding, and dedication to making a difference.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Open communication and clear processes ensure trust between donors, patients, and healthcare providers.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Award className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <CardTitle>Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We strive for the highest standards in technology, healthcare coordination, and patient care.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-muted">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-muted-foreground">Registered Donors</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-secondary mb-2">5,000+</div>
                <div className="text-muted-foreground">Lives Saved</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-accent mb-2">156</div>
                <div className="text-muted-foreground">Partner Hospitals</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary-light mb-2">98%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A simple, secure process that connects donors with patients
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Register</h3>
                <p className="text-muted-foreground">
                  Sign up as a donor or patient with your verified information and medical details.
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Match</h3>
                <p className="text-muted-foreground">
                  Our system finds compatible matches based on blood type, medical compatibility, and urgency.
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Save Lives</h3>
                <p className="text-muted-foreground">
                  Healthcare professionals coordinate the donation process to save lives effectively.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
