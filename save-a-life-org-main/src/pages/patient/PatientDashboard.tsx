import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserPlus, LogOut, AlertCircle, CheckCircle, Clock, Heart, X, Plus, Droplet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { City as CityType, State, ICity } from "country-state-city";

type Toast = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

// Type definitions
interface OrganRequest {
  id: string;
  organ: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  patientName?: string;
  patientEmail?: string;
  bloodGroup?: string;
  urgency?: string;
  medicalCondition?: string;
  phone?: string;
  age?: string;
  state?: string;
  city?: string;
  medicalRecords?: string[];
}

// Mock functions
const getRequestsByPatient = (email: string): OrganRequest[] => {
  const saved = localStorage.getItem('organ_requests');
  const allRequests: OrganRequest[] = saved ? JSON.parse(saved) : [];
  return allRequests.filter(req => req.patientEmail === email);
};

const addRequest = (request: Omit<OrganRequest, 'id' | 'status' | 'date'>): OrganRequest => {
  const newRequest: OrganRequest = {
    ...request,
    id: Math.random().toString(36).substr(2, 9),
    status: 'pending',
    date: new Date().toISOString().split('T')[0]
  };
  
  const saved = localStorage.getItem('organ_requests');
  const allRequests = saved ? JSON.parse(saved) : [];
  localStorage.setItem('organ_requests', JSON.stringify([...allRequests, newRequest]));
  
  return newRequest;
};

const PatientDashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [requests, setRequests] = useState<OrganRequest[]>([]);
  const [medicalFiles, setMedicalFiles] = useState<string[]>([]);
  // Removed duplicate declaration of isRegistered
  
  // Registration form state
  const [registrationForm, setRegistrationForm] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    bloodGroup: "",
    requiredOrgan: "",
    medicalCondition: "",
    state: "",
    city: "",
  });

  const handleRegistrationChange = (field: string, value: string) => {
    setRegistrationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegistrationSubmit = useCallback(() => {
    // Basic validation
    if (!registrationForm.name || !registrationForm.age || !registrationForm.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedProfile = {
      ...registrationForm,
      isRegistered: true
    };

    // Save the registration data to profile
    setProfile(updatedProfile);

    // Save to localStorage
    localStorage.setItem('patient_profile', JSON.stringify(updatedProfile));

    isRegistered.current = true;
    setIsRegisterDialogOpen(false);
    
    toast({
      title: "Registration Complete",
      description: "Your patient profile has been registered successfully!",
    });
  }, [registrationForm, toast]);

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };
  
  // Profile state with TypeScript interface
  interface PatientProfile {
    name: string;
    age: string;
    bloodGroup: string;
    requiredOrgan: string;
    medicalCondition: string;
    phone: string;
    email: string;
    state: string;
    city: string;
    isRegistered?: boolean;
  }

  // Load profile and registration status from localStorage
  const [profile, setProfile] = useState<PatientProfile>(() => {
    const defaultProfile: PatientProfile = {
      name: "",
      age: "",
      bloodGroup: "",
      requiredOrgan: "",
      medicalCondition: "",
      phone: "",
      email: "",
      state: "",
      city: "",
      isRegistered: false,
    };

    try {
      const saved = localStorage.getItem('patient_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultProfile, ...parsed };
      }
    } catch (error) {
      console.error("Error parsing saved profile:", error);
    }
    
    return defaultProfile;
  });

  // Derive isRegistered from profile
  const isRegistered = useRef(!!(profile.name && profile.age && profile.bloodGroup && 
    profile.requiredOrgan && profile.phone && profile.email));

  // Get Indian states
  const indianStates = State.getStatesOfCountry("IN");
  
  // Get cities for selected state
  const [cities, setCities] = useState<ICity[]>([]);
  
  useEffect(() => {
    if (profile.state) {
      const stateCities = CityType.getCitiesOfState("IN", profile.state);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [profile.state]);

  // Load requests from storage
  const loadRequests = useCallback(() => {
    if (profile?.email) {
      const patientRequests = getRequestsByPatient(profile.email);
      setRequests(patientRequests || []);
    }
  }, [profile?.email]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Handle window focus and polling
  useEffect(() => {
    const handleFocus = () => loadRequests();
    
    // Add focus event listener
    window.addEventListener('focus', handleFocus);
    
    // Set up polling
    const intervalId = setInterval(loadRequests, 5000);
    
    // Cleanup function
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [loadRequests]);

  // Define available organs with proper typing
  const availableOrgans = [
    { value: 'heart', label: 'Heart' },
    { value: 'liver', label: 'Liver' },
    { value: 'kidney', label: 'Kidney' },
    { value: 'lung', label: 'Lung' },
    { value: 'pancreas', label: 'Pancreas' },
    { value: 'intestine', label: 'Intestine' },
  ] as const;

  // Initialize registration form with profile data
  useEffect(() => {
    if (profile?.email) {
      setRegistrationForm(prev => ({
        ...prev,
        ...profile
      }));
    }
  }, [profile]);

  const handleSave = () => {
    // Save profile to localStorage
    localStorage.setItem('patient_profile', JSON.stringify(profile));
    setIsEditing(false);
    loadRequests(); // Reload requests after profile update
    toast({
      title: "Profile Updated",
      description: "Your patient profile has been updated successfully.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setMedicalFiles((prev) => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setMedicalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRequestOrgan = () => {
    if (!profile.name || !profile.email || !profile.requiredOrgan || !profile.bloodGroup) {
      toast({
        title: "Incomplete Profile",
        description: "Please complete your profile before submitting a request.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newRequest = addRequest({
        patientName: profile.name,
        patientEmail: profile.email,
        organ: profile.requiredOrgan,
        bloodGroup: profile.bloodGroup,
        urgency: "high",
        medicalCondition: profile.medicalCondition,
        phone: profile.phone,
        age: profile.age,
        state: profile.state,
        city: profile.city,
        medicalRecords: medicalFiles,
      });

      // Update local state with the new request
      setRequests(prev => [...prev, newRequest]);
      setMedicalFiles([]); // Clear files after submission
      
      toast({
        title: "Request Submitted",
        description: "Your organ request has been submitted for review.",
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Registration Dialog */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Patient Registration</DialogTitle>
            <DialogDescription>
              Please fill in your details to complete your patient profile.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name *</Label>
                <Input
                  id="reg-name"
                  value={registrationForm.name}
                  onChange={(e) => handleRegistrationChange('name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-age">Age *</Label>
                <Input
                  id="reg-age"
                  type="number"
                  value={registrationForm.age}
                  onChange={(e) => handleRegistrationChange('age', e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email *</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registrationForm.email}
                  onChange={(e) => handleRegistrationChange('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-phone">Phone</Label>
                <Input
                  id="reg-phone"
                  value={registrationForm.phone}
                  onChange={(e) => handleRegistrationChange('phone', e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-blood">Blood Group</Label>
                <Select 
                  value={registrationForm.bloodGroup}
                  onValueChange={(value) => handleRegistrationChange('bloodGroup', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-organ">Required Organ</Label>
                <Select
                  value={registrationForm.requiredOrgan}
                  onValueChange={(value) => handleRegistrationChange('requiredOrgan', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Heart">Heart</SelectItem>
                    <SelectItem value="Kidney">Kidney</SelectItem>
                    <SelectItem value="Liver">Liver</SelectItem>
                    <SelectItem value="Lung">Lung</SelectItem>
                    <SelectItem value="Pancreas">Pancreas</SelectItem>
                    <SelectItem value="Intestine">Intestine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reg-condition">Medical Condition</Label>
              <Textarea
                id="reg-condition"
                value={registrationForm.medicalCondition}
                onChange={(e) => handleRegistrationChange('medicalCondition', e.target.value)}
                placeholder="Describe your medical condition..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleRegistrationSubmit}>
              Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Main Content */}
      {isRegistered.current ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-2 p-6">
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select 
                      value={profile.state} 
                      onValueChange={(val) => {
                        setProfile({...profile, state: val, city: ""});
                      }}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select 
                      value={profile.city} 
                      onValueChange={(val) => setProfile({...profile, city: val})}
                      disabled={!isEditing || !profile.state}
                    >
                      <SelectTrigger id="city">
                        <SelectValue placeholder={profile.state ? "Select City" : "Select State First"} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="medicalCondition">Medical Condition</Label>
                    <Textarea
                      id="medicalCondition"
                      value={profile.medicalCondition}
                      onChange={(e) => setProfile({...profile, medicalCondition: e.target.value})}
                      disabled={!isEditing}
                      rows={3}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  {isEditing ? (
                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSave}
                        size="sm"
                      >
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                      >
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-accent" />
                  Request Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Priority</span>
                    <Badge variant="destructive">High</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Required Organ</span>
                    <span className="font-medium">{profile.requiredOrgan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Blood Type</span>
                    <span className="font-medium">{profile.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Requests</span>
                    <span className="font-bold text-2xl text-accent">{requests.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Submit Organ Request
                  </CardTitle>
                  <CardDescription>Submit a new request for organ donation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col py-8 space-y-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground text-center">
                    Complete your profile above and attach medical records before submitting a request for {profile.requiredOrgan || "an organ"}.
                  </p>
                  
                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicalRecords">Upload Medical Records (Optional)</Label>
                      <Input
                        id="medicalRecords"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB per file)
                      </p>
                    </div>

                    {/* Display uploaded files */}
                    {medicalFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Files ({medicalFiles.length})</Label>
                        <div className="space-y-2">
                          {medicalFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded bg-muted">
                              <span className="text-sm truncate">Medical Record {index + 1}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="h-8 w-8 p-0"
                              >
                                ✕
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleRequestOrgan}
                    disabled={!profile.name || !profile.email || !profile.requiredOrgan}
                    className="w-full"
                  >
                    Submit New Request
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request History */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Request History</CardTitle>
              <CardDescription>Your organ donation requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.length > 0 ? (
                  requests.map((request: OrganRequest) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            request.status === "approved"
                              ? "bg-secondary/20"
                              : request.status === "rejected"
                              ? "bg-destructive/20"
                              : "bg-accent/20"
                          }`}
                        >
                          {request.status === "approved" ? (
                            <CheckCircle className="h-6 w-6 text-secondary" />
                          ) : (
                            <Clock className="h-6 w-6 text-accent" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{request.organ}</p>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {request.date}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge
                            variant={
                              request.status === "approved" ? "default" : "secondary"
                            }
                          >
                            {request.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            Urgency:{" "}
                            <span className="text-destructive font-medium">
                              {request.urgency || "High"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No requests submitted yet. Submit your first request above.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-xl font-medium mb-2">Welcome to Patient Dashboard</CardTitle>
            <p className="text-muted-foreground mb-6">
              Click the Register button to create your patient profile
            </p>
            <Button 
              size="lg"
              onClick={() => setIsRegisterDialogOpen(true)}
              className="mt-4"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Register Now
            </Button>
          </CardContent>
        </Card>
      )}

      <Footer />
    </div>
  );
}

export default PatientDashboard;
