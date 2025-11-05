import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Heart,
  CheckCircle,
  Clock,
  Bell,
  LogOut,
  Loader2,
  XCircle, // Import XCircle for rejected status
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// 1. ADD TYPE FOR THE DYNAMIC HISTORY DATA
export interface OrganRequest {
  _id: string;
  patientName: string; // This is the patient's name
  organ: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// Schema for the profile form
const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  bloodGroup: z.string().min(1, "Please select your blood group"),
  organType: z.string().min(1, "Please select organ type"),
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Invalid phone number format"
    ),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^[0-9]{5}(?:-[0-9]{4})?$/, "Invalid ZIP code"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Invalid phone number format"
    ),
  medicalHistory: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const DonorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 2. ADD STATE FOR DYNAMIC HISTORY
  const [history, setHistory] = useState<OrganRequest[]>([]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      bloodGroup: "",
      organType: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      medicalHistory: "",
    },
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const organTypes = [
    "Kidney",
    "Liver",
    "Heart",
    "Lungs",
    "Pancreas",
    "Intestines",
    "Tissues",
  ];

  // 3. DELETE THE MOCK donationHistory ARRAY

  // This mock data is fine, as we haven't built a notification backend
  const notifications = [
    {
      id: 1,
      message: "Profile verification completed successfully",
      time: "1 day ago",
      read: true,
    },
  ];

  // Helper function to get token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 4. UPDATE USEEFFECT TO FETCH BOTH PROFILE AND HISTORY
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        if (!token) {
          toast({ title: "Not Authorized", variant: "destructive" });
          navigate("/login?role=donor");
          return;
        }

        // --- 1. Fetch Profile ---
        const profileResponse = await fetch(
          "http://localhost:3000/api/donors/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profileResponse.status === 404) {
          toast({
            title: "No Profile Found",
            description: "Please complete your donor registration.",
          });
          navigate("/donor/register");
          return;
        }
        if (!profileResponse.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileResponse.json();
        profileData.dateOfBirth = profileData.dateOfBirth.split("T")[0];
        form.reset(profileData);

        // --- 2. Fetch History (NEW) ---
        const historyResponse = await fetch(
          "http://localhost:3000/api/donors/me/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!historyResponse.ok) throw new Error("Failed to fetch history");
        const historyData = await historyResponse.json();
        setHistory(historyData);
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
    fetchDashboardData();
  }, [form, navigate, toast]);

  // handleSave (profile update) function is unchanged
  const handleSave = async (values: ProfileFormValues) => {
    try {
      const token = getAuthToken();
      const response = await fetch("http://localhost:3000/api/donors/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your donor profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // handleLogout function is unchanged
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/login?role=donor");
  };

  // 5. CALCULATE DYNAMIC STATUS
  const activeAssignments = history.filter(
    (h) => h.status === "approved"
  ).length;
  const livesSaved = history.filter(
    (h) => h.status === "approved" // You can change this to a "completed" status later
  ).length;
  const donationStatus = activeAssignments > 0 ? "In Process" : "Available";

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

      <main className="flex-1 px-4 py-8 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Donor Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your donation profile and view your impact
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card (Unchanged) */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Donor Profile</CardTitle>
                  <CardDescription>
                    Your personal and medical information
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : null}
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSave)}
                    className="space-y-4"
                  >
                    {/* All FormFields are unchanged */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth *</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bloodGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Group *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {bloodGroups.map((group) => (
                                  <SelectItem key={group} value={group}>
                                    {group}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="organType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organ Type *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select organ type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {organTypes.map((organ) => (
                                  <SelectItem key={organ} value={organ}>
                                    {organ}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder="+1 234-567-8900"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main St"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="New York"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="NY"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="10001"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emergencyContactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Jane Smith"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emergencyContactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Phone</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+1 (555) 987-6543"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="medicalHistory"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Medical History (Optional)</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Any relevant medical history or conditions..."
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {isEditing && (
                      <div className="flex gap-2 pt-4">
                        <Button type="submit">Save Changes</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            form.reset(); // Resets form to last fetched data
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* 6. STATUS & NOTIFICATIONS COLUMN (NOW DYNAMIC) */}
            <div className="space-y-6">
              <Card className="border-l-4 border-l-secondary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 fill-secondary text-secondary" />
                    Donation Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Active Status
                      </span>
                      {/* DYNAMIC BADGE */}
                      <Badge
                        variant={
                          donationStatus === "Available"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {donationStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Organ
                      </span>
                      <span className="font-medium">
                        {form.watch("organType")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Blood Type
                      </span>
                      <span className="font-medium">
                        {form.watch("bloodGroup")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Lives Saved
                      </span>
                      {/* DYNAMIC COUNT */}
                      <span className="font-bold text-2xl text-secondary">
                        {livesSaved}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications Card (Mock data, unchanged) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {notifications.filter((n) => !n.read).length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border ${
                            !notification.read
                              ? "bg-secondary/10 border-secondary"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm font-medium">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No new notifications
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 7. DONATION HISTORY (NOW DYNAMIC) */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>
                Your contribution to saving lives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Map over 'history' state instead of mock data */}
                {history.length > 0 ? (
                  history.map((donation) => (
                    <div
                      key={donation._id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            donation.status === "approved"
                              ? "bg-secondary/20"
                              : donation.status === "rejected"
                              ? "bg-destructive/20"
                              : "bg-accent/20"
                          }`}
                        >
                          {/* Dynamic Icons */}
                          {donation.status === "approved" && (
                            <CheckCircle className="h-6 w-6 text-secondary" />
                          )}
                          {donation.status === "pending" && (
                            <Clock className="h-6 w-6 text-accent" />
                          )}
                          {donation.status === "rejected" && (
                            <XCircle className="h-6 w-6 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{donation.organ}</p>
                          <p className="text-sm text-muted-foreground">
                            Patient: {donation.patientName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {/* Dynamic Badge */}
                        <Badge
                          variant={
                            donation.status === "approved"
                              ? "secondary"
                              : donation.status === "rejected"
                              ? "destructive"
                              : "outline"
                          }
                          className="capitalize"
                        >
                          {donation.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(donation.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Dynamic empty message
                  <p className="text-sm text-muted-foreground text-center py-4">
                    You have no donation assignments yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonorDashboard;
