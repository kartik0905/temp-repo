import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Heart, Hospital, ArrowLeft } from "lucide-react";

const RoleSelection = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link to="/">
          <Button variant="ghost" className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            BACK TO ROLES
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Organ Donation Management System
            </h1>
            <p className="text-xl text-white/90 mb-2">
              Choose your role to access the system
            </p>
          </div>

          {/* Info Card */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8 animate-fade-in">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Hospital className="h-6 w-6 text-white" />
                <CardTitle className="text-white text-xl">
                  Revolutionizing Healthcare Through Technology
                </CardTitle>
              </div>
              <CardDescription className="text-white/80 text-base">
                Our advanced Organ Donation Management System connects patients, donors, and medical professionals in a
                seamless, secure platform with real-time matching algorithms and intelligent notification systems.
              </CardDescription>
              <p className="text-white/70 italic text-sm mt-2">
                "Saving lives through technology, one donation at a time."
              </p>
            </CardHeader>
          </Card>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Patient/Recipient Card */}
            <Link to="/login?role=patient" className="block group">
              <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-blue-400">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Patient/Recipient
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 text-base">
                    View available organs and hospitals for transplant
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            {/* Organ Donor Card */}
            <Link to="/login?role=donor" className="block group">
              <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-pink-400">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-10 w-10 text-white fill-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Organ Donor
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 text-base">
                    Find hospitals where you can donate organs
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            {/* Admin Card */}
            <Link to="/login?role=admin" className="block group">
              <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-green-400">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Hospital className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Admin
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 text-base">
                    Manage all organ donation operations and records
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
