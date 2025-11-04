import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Download, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface OrganRequest {
  _id: string;
  patientName: string;
  patientEmail: string;
  phone?: string;
  age?: string;
  bloodGroup: string;
  organ: string;
  city?: string;
  state?: string;
  status: "pending" | "approved" | "rejected";
  medicalCondition?: string;
  urgency?: "low" | "medium" | "high";
  createdAt: string;
  medicalRecords?: string[];
  [key: string]: any;
}

const PatientRecords = () => {
  const [requests, setRequests] = useState<OrganRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadRequests();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const loadRequests = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Not authorized",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("http://localhost:3000/api/admin/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch patient records");
      }

      const data = await response.json();
      setRequests(data);
    } catch (error: any) {
      toast({
        title: "Error loading records",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadFile = (base64Data: string, index: number) => {
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = `medical-record-${index + 1}`;
    link.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-8 bg-muted">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Patient Records
            </h1>
            <p className="text-muted-foreground">
              View all patient details and medical records
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Patient Records</CardTitle>
              <CardDescription>
                Complete patient information with medical records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Organ</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length > 0 ? (
                    requests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell className="font-medium">
                          {request.patientName}
                        </TableCell>
                        <TableCell>{request.patientEmail}</TableCell>
                        <TableCell>{request.phone || "N/A"}</TableCell>
                        <TableCell>{request.age || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {request.bloodGroup}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.organ}</TableCell>
                        <TableCell>
                          {request.city && request.state ? (
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              {request.city}
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "secondary"
                                : request.status === "rejected"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Patient Details</DialogTitle>
                                <DialogDescription>
                                  Complete information for {request.patientName}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">
                                    Personal Information
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Full Name
                                      </p>
                                      <p className="font-medium">
                                        {request.patientName}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Age
                                      </p>
                                      <p className="font-medium">
                                        {request.age || "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Email
                                      </p>
                                      <p className="font-medium">
                                        {request.patientEmail}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Phone
                                      </p>
                                      <p className="font-medium">
                                        {request.phone || "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Blood Group
                                      </p>
                                      <Badge variant="secondary">
                                        {request.bloodGroup}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Location
                                      </p>
                                      <p className="font-medium">
                                        {request.city && request.state
                                          ? `${request.city}, ${request.state}`
                                          : "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-lg font-semibold mb-3">
                                    Medical Information
                                  </h3>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Required Organ
                                      </p>
                                      <p className="font-medium">
                                        {request.organ}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Medical Condition
                                      </p>
                                      <p className="font-medium">
                                        {request.medicalCondition || "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Urgency
                                      </p>
                                      <Badge variant="destructive">
                                        {request.urgency || "N/A"}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Request Date
                                      </p>
                                      <p className="font-medium">
                                        {formatDate(request.createdAt)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Status
                                      </p>
                                      <Badge
                                        variant={
                                          request.status === "approved"
                                            ? "secondary"
                                            : request.status === "rejected"
                                            ? "destructive"
                                            : "outline"
                                        }
                                      >
                                        {request.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {request.medicalRecords &&
                                  request.medicalRecords.length > 0 && (
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3">
                                        Medical Records
                                      </h3>
                                      <div className="space-y-2">
                                        {request.medicalRecords.map(
                                          (file, index) => (
                                            <div
                                              key={index}
                                              className="flex items-center justify-between p-3 border rounded bg-muted"
                                            >
                                              <div className="flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-primary" />
                                                <span className="font-medium">
                                                  Medical Record {index + 1}
                                                </span>
                                              </div>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  downloadFile(file, index)
                                                }
                                              >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                              </Button>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No patient records available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PatientRecords;
