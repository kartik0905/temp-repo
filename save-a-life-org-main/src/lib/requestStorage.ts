// Simple localStorage-based storage for organ requests
export interface OrganRequest {
  id: string;
  patientName: string;
  patientEmail: string;
  organ: string;
  bloodGroup: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  urgency: "low" | "medium" | "high";
  medicalCondition: string;
  compatibility?: string;
  donor?: string;
  phone?: string;
  age?: string;
  state?: string;
  city?: string;
  medicalRecords?: string[]; // Base64 encoded files
}

const STORAGE_KEY = "organ_requests";

export const getRequests = (): OrganRequest[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addRequest = (request: Omit<OrganRequest, "id" | "date" | "status">): OrganRequest => {
  const requests = getRequests();
  const newRequest: OrganRequest = {
    ...request,
    id: Date.now().toString(),
    date: new Date().toISOString().split("T")[0],
    status: "pending",
  };
  requests.push(newRequest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  return newRequest;
};

export const updateRequestStatus = (id: string, status: "pending" | "approved" | "rejected"): void => {
  const requests = getRequests();
  const updated = requests.map((req) =>
    req.id === id ? { ...req, status } : req
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getRequestsByPatient = (patientEmail: string): OrganRequest[] => {
  return getRequests().filter((req) => req.patientEmail === patientEmail);
};
