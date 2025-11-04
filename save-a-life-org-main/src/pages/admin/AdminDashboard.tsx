import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users,
  Heart,
  Hospital,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface OrganRequest {
  _id: string;
  patientName: string;
  patientEmail: string;
  organ: string;
  bloodGroup: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  [key: string]: any;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<OrganRequest[]>([]);

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
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();
      setRequests(data);
    } catch (error: any) {
      toast({
        title: "Error loading requests",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
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

      const response = await fetch(
        `http://localhost:3000/api/admin/requests/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      loadRequests();
      toast({
        title: `Request ${status === "approved" ? "Approved" : "Rejected"}`,
        description: `The donation request has been ${status}.`,
        variant: status === "rejected" ? "destructive" : undefined,
      });
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleApprove = (id: string) => {
    handleUpdateStatus(id, "approved");
  };

  const handleReject = (id: string) => {
    handleUpdateStatus(id, "rejected");
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage donors, patients, and donation requests
              </p>
            </div>
            <Link to="/admin/patient-records">
              <Button variant="outline" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Patient Records
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-primary">
                    {requests.length}
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-secondary">
                    {requests.filter((r) => r.status === "pending").length}
                  </div>
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-accent">
                    {requests.filter((r) => r.status === "approved").length}
                  </div>
                  <CheckCircle className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Organ Donation Requests</CardTitle>
              <CardDescription>
                Review and manage all patient requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Patient Email</TableHead>
                    <TableHead>Organ</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Date</TableHead>
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
                        <TableCell>{request.organ}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {request.bloodGroup}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(request.createdAt)}
                        </TableCell>
                        <TableCell>
                          {request.status === "pending" && (
                            <Badge
                              variant="outline"
                              className="border-accent text-accent"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {request.status === "approved" && (
                            <Badge
                              variant="outline"
                              className="border-secondary text-secondary"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          )}
                          {request.status === "rejected" && (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Rejected
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {request.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApprove(request._id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(request._id)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No requests submitted yet.
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

export default AdminDashboard;
