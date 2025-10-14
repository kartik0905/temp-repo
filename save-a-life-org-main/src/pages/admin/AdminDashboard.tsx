import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Heart, Hospital, Activity, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRequests, updateRequestStatus, type OrganRequest } from "@/lib/requestStorage";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<OrganRequest[]>([]);

  // Load requests from storage
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const allRequests = getRequests();
    setRequests(allRequests);
  };

  const handleApprove = (id: string) => {
    updateRequestStatus(id, "approved");
    loadRequests();
    toast({
      title: "Request Approved",
      description: "The donation request has been approved successfully.",
    });
  };

  const handleReject = (id: string) => {
    updateRequestStatus(id, "rejected");
    loadRequests();
    toast({
      title: "Request Rejected",
      description: "The donation request has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 bg-muted">
        <div className="container mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage donors, patients, and donation requests</p>
            </div>
            <Link to="/admin/patient-records">
              <Button variant="outline" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Patient Records
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-primary">{requests.length}</div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-secondary">{requests.filter(r => r.status === 'pending').length}</div>
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-accent">{requests.filter(r => r.status === 'approved').length}</div>
                  <CheckCircle className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Requests */}
          <Card>
            <CardHeader>
              <CardTitle>All Organ Donation Requests</CardTitle>
              <CardDescription>Review and manage all patient requests</CardDescription>
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
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.patientName}</TableCell>
                        <TableCell>{request.patientEmail}</TableCell>
                        <TableCell>{request.organ}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {request.bloodGroup}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{request.date}</TableCell>
                      <TableCell>
                        {request.status === "pending" && (
                          <Badge variant="outline" className="border-accent text-accent">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        {request.status === "approved" && (
                          <Badge variant="outline" className="border-secondary text-secondary">
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
                              onClick={() => handleApprove(request.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleReject(request.id)}
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
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
