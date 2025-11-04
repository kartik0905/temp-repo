import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  UserPlus,
  LogOut,
  AlertCircle,
  CheckCircle,
  Clock,
  Heart,
  Loader2,
  FileText,
  Circle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { City as CityType, State, ICity } from "country-state-city";

interface OrganRequest {
  _id: string;
  organ: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  urgency?: string;
}

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
}

const PatientDashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [requests, setRequests] = useState<OrganRequest[]>([]);
  const [medicalFiles, setMedicalFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState<PatientProfile>({
    name: "",
    age: "",
    bloodGroup: "",
    requiredOrgan: "",
    medicalCondition: "",
    phone: "",
    email: "",
    state: "",
    city: "",
  });

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

  const isRegistered = useRef(false);
  const [cities, setCities] = useState<ICity[]>([]);
  const indianStates = State.getStatesOfCountry("IN");

  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Not Authorized",
        description: "You must be logged in.",
        variant: "destructive",
      });
      navigate("/login?role=patient");
    }
    return token;
  };

  const loadRequests = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const response = await fetch(
        "http://localhost:3000/api/requests/my-requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data);
    } catch (error: any) {
      toast({
        title: "Error loading requests",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/api/patients/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 404) {
          isRegistered.current = false;
          setIsRegisterDialogOpen(true);
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          setRegistrationForm((prev) => ({
            ...prev,
            name: user.name || "",
            email: user.email || "",
          }));
        } else if (response.ok) {
          const data = await response.json();
          setProfile(data);
          isRegistered.current = true;
          await loadRequests();
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [loadRequests, toast, navigate]);

  useEffect(() => {
    const stateCode = profile.state || registrationForm.state;
    if (stateCode) {
      setCities(CityType.getCitiesOfState("IN", stateCode));
    } else {
      setCities([]);
    }
  }, [profile.state, registrationForm.state]);

  const handleRegistrationChange = (field: string, value: string) => {
    setRegistrationForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegistrationSubmit = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const response = await fetch("http://localhost:3000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(registrationForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      setProfile(data);
      isRegistered.current = true;
      setIsRegisterDialogOpen(false);
      toast({
        title: "Registration Complete",
        description: "Your patient profile has been registered!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/login?role=patient");
  };

  const handleSave = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const response = await fetch("http://localhost:3000/api/patients/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");

      setProfile(data);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedicalFiles((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setMedicalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRequestOrgan = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const requestData = {
        patientName: profile.name,
        patientEmail: profile.email,
        organ: profile.requiredOrgan,
        bloodGroup: profile.bloodGroup,
        phone: profile.phone,
        age: profile.age,
        state: profile.state,
        city: profile.city,
        medicalCondition: profile.medicalCondition,
        urgency: "high",
        medicalRecords: medicalFiles,
      };

      const response = await fetch("http://localhost:3000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to submit request");

      setRequests((prev) => [...prev, data]);
      setMedicalFiles([]);
      toast({
        title: "Request Submitted",
        description: "Your organ request has been submitted for review.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Dialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
      >
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
                  onChange={(e) =>
                    handleRegistrationChange("name", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-age">Age *</Label>
                <Input
                  id="reg-age"
                  type="number"
                  value={registrationForm.age}
                  onChange={(e) =>
                    handleRegistrationChange("age", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleRegistrationChange("email", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-phone">Phone</Label>
                <Input
                  id="reg-phone"
                  value={registrationForm.phone}
                  onChange={(e) =>
                    handleRegistrationChange("phone", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-blood">Blood Group</Label>
                <Select
                  value={registrationForm.bloodGroup}
                  onValueChange={(value) =>
                    handleRegistrationChange("bloodGroup", value)
                  }
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
                  onValueChange={(value) =>
                    handleRegistrationChange("requiredOrgan", value)
                  }
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-state">State</Label>
                <Select
                  value={registrationForm.state}
                  onValueChange={(val) => {
                    handleRegistrationChange("state", val);
                    handleRegistrationChange("city", "");
                  }}
                >
                  <SelectTrigger id="reg-state">
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
                <Label htmlFor="reg-city">City</Label>
                <Select
                  value={registrationForm.city}
                  onValueChange={(val) => handleRegistrationChange("city", val)}
                  disabled={!registrationForm.state}
                >
                  <SelectTrigger id="reg-city">
                    <SelectValue
                      placeholder={
                        registrationForm.state
                          ? "Select City"
                          : "Select State First"
                      }
                    />
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-condition">Medical Condition</Label>
              <Textarea
                id="reg-condition"
                value={registrationForm.medicalCondition}
                onChange={(e) =>
                  handleRegistrationChange("medicalCondition", e.target.value)
                }
                placeholder="Describe your medical condition..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRegisterDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleRegistrationSubmit}>
              Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="flex-1 px-4 py-8 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Patient Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your profile and organ requests
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {isRegistered.current ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Patient Profile</CardTitle>
                      <CardDescription>
                        Your personal and medical information
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={profile.age}
                        onChange={(e) =>
                          setProfile({ ...profile, age: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select
                        value={profile.bloodGroup}
                        onValueChange={(val) =>
                          setProfile({ ...profile, bloodGroup: val })
                        }
                        disabled={!isEditing}
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
                      <Label htmlFor="requiredOrgan">Required Organ</Label>
                      <Select
                        value={profile.requiredOrgan}
                        onValueChange={(val) =>
                          setProfile({ ...profile, requiredOrgan: val })
                        }
                        disabled={!isEditing}
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
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={profile.state}
                        onValueChange={(val) => {
                          setProfile({ ...profile, state: val, city: "" });
                        }}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem
                              key={state.isoCode}
                              value={state.isoCode}
                            >
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
                        onValueChange={(val) =>
                          setProfile({ ...profile, city: val })
                        }
                        disabled={!isEditing || !profile.state}
                      >
                        <SelectTrigger id="city">
                          <SelectValue
                            placeholder={
                              profile.state
                                ? "Select City"
                                : "Select State First"
                            }
                          />
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
                      <Label htmlFor="medicalCondition">
                        Medical Condition
                      </Label>
                      <Textarea
                        id="medicalCondition"
                        value={profile.medicalCondition}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            medicalCondition: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
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
                        <span className="text-sm text-muted-foreground">
                          Priority
                        </span>
                        <Badge variant="destructive">High</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Required Organ
                        </span>
                        <span className="font-medium">
                          {profile.requiredOrgan}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Blood Type
                        </span>
                        <span className="font-medium">
                          {profile.bloodGroup}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Active Requests
                        </span>
                        <span className="font-bold text-2xl text-accent">
                          {requests.length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Submit New Organ Request</CardTitle>
                  <CardDescription>
                    Attach medical records and submit your request for{" "}
                    {profile.requiredOrgan || "an organ"}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="medicalRecords">
                      Upload Medical Records
                    </Label>
                    <Input
                      id="medicalRecords"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-muted-foreground">
                      Accepted formats: PDF, JPG, PNG.
                    </p>
                  </div>

                  {medicalFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Files ({medicalFiles.length})</Label>
                      <div className="space-y-2">
                        {medicalFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border rounded bg-muted"
                          >
                            <span className="text-sm truncate">
                              <FileText className="h-4 w-4 mr-2 inline" />
                              Medical Record {index + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              X
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleRequestOrgan}
                    disabled={
                      !profile.name || !profile.email || !profile.requiredOrgan
                    }
                    className="w-full"
                  >
                    Submit New Request
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Request History</CardTitle>
                  <CardDescription>
                    Your organ donation requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requests.length > 0 ? (
                      requests.map((request: OrganRequest) => (
                        <div
                          key={request._id}
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
                              {request.status === "approved" && (
                                <CheckCircle className="h-6 w-6 text-secondary" />
                              )}
                              {request.status === "rejected" && (
                                <Circle className="h-6 w-6 text-destructive" />
                              )}
                              {request.status === "pending" && (
                                <Clock className="h-6 w-6 text-accent" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">{request.organ}</p>
                              <p className="text-sm text-muted-foreground">
                                Submitted: {formatDate(request.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "secondary"
                                : request.status === "rejected"
                                ? "destructive"
                                : "outline"
                            }
                            className="capitalize"
                          >
                            {request.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No requests submitted yet.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            !isLoading && (
              <Card className="text-center py-16">
                <CardContent>
                  <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="text-xl font-medium mb-2">
                    Welcome to Patient Dashboard
                  </CardTitle>
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
            )
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PatientDashboard;
