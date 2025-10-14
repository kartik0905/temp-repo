import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, CheckCircle, Clock, Bell, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  age: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 18 && num <= 65;
  }, "Age must be between 18 and 65"),
  bloodGroup: z.string().min(1, "Please select a blood group"),
  organType: z.string().min(1, "Please select an organ type"),
  phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
});

const DonorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "John Smith",
      age: "35",
      bloodGroup: "O+",
      organType: "Kidney",
      phone: "+1 234-567-8900",
      email: "john.smith@email.com",
    },
  });

  const donationHistory = [
    { id: 1, date: "2024-01-15", status: "approved", organ: "Kidney", patient: "Sarah Johnson" },
    { id: 2, date: "2023-11-20", status: "completed", organ: "Liver Segment", patient: "Michael Brown" },
  ];

  const notifications = [
    { id: 1, message: "Your kidney donation request has been approved", time: "2 hours ago", read: false },
    { id: 2, message: "Profile verification completed successfully", time: "1 day ago", read: true },
  ];

  const handleSave = (values: z.infer<typeof profileSchema>) => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your donor profile has been updated successfully.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Donor Dashboard</h1>
              <p className="text-muted-foreground">Manage your donation profile and view your impact</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Donor Profile</CardTitle>
                  <CardDescription>Your personal and medical information</CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : null}
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
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
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age *</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" disabled={!isEditing} />
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
                            <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
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
                            <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select organ type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Kidney">Kidney</SelectItem>
                                <SelectItem value="Liver">Liver</SelectItem>
                                <SelectItem value="Heart">Heart</SelectItem>
                                <SelectItem value="Lungs">Lungs</SelectItem>
                                <SelectItem value="Pancreas">Pancreas</SelectItem>
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
                              <Input {...field} disabled={!isEditing} placeholder="+1 234-567-8900" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {isEditing && (
                      <div className="flex gap-2 pt-4">
                        <Button type="submit">Save Changes</Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Status & Notifications Column */}
            <div className="space-y-6">
              {/* Status Card */}
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
                      <span className="text-sm text-muted-foreground">Active Status</span>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Organ</span>
                      <span className="font-medium">{form.watch("organType")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Blood Type</span>
                      <span className="font-medium">{form.watch("bloodGroup")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lives Saved</span>
                      <span className="font-bold text-2xl text-secondary">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                    {notifications.filter(n => !n.read).length > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {notifications.filter(n => !n.read).length}
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
                            !notification.read ? 'bg-secondary/10 border-secondary' : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm font-medium">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Donation History */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>Your contribution to saving lives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donationHistory.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        donation.status === 'completed' ? 'bg-secondary/20' : 'bg-accent/20'
                      }`}>
                        {donation.status === 'completed' ? (
                          <CheckCircle className="h-6 w-6 text-secondary" />
                        ) : (
                          <Clock className="h-6 w-6 text-accent" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{donation.organ}</p>
                        <p className="text-sm text-muted-foreground">Patient: {donation.patient}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={donation.status === 'completed' ? 'secondary' : 'outline'}>
                        {donation.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{donation.date}</p>
                    </div>
                  </div>
                ))}
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
