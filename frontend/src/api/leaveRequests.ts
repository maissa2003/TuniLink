import api from "./axios";

export interface LeaveRequest {
  id: number;
  type: "ANNUAL" | "SICK" | "UNPAID";
  startDate: string;
  endDate: string;
  days: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  employee: {
    id: number;
    fullName: string;
    employeeNumber: string;
  };
  comments?: string;
  proofDocumentPath?: string;
}

export interface CreateLeaveRequest {
  employeeId: number;
  type: "ANNUAL" | "SICK" | "UNPAID";
  startDate: string;
  endDate: string;
  proof?: File;
  comments?: string;
}


export const getEmployeeLeaveRequests = async (employeeId: number) => {
  const res = await api.get<LeaveRequest[]>(`/leave-requests/employee/${employeeId}`);
  return res.data;
};

export const createLeaveRequest = async (data: CreateLeaveRequest) => {
  const formData = new FormData();
  formData.append('employeeId', data.employeeId.toString());
  formData.append('type', data.type);
  formData.append('startDate', data.startDate);
  formData.append('endDate', data.endDate);
  
  if (data.proof) {
    formData.append('proof', data.proof);
  }
  if (data.comments) {
    formData.append('comments', data.comments);
  }
  
  const res = await api.post<LeaveRequest>('/leave-requests', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updateLeaveRequestStatus = async (requestId: number, status: "APPROVED" | "REJECTED") => {
  const res = await api.put<LeaveRequest>(`/leave-requests/${requestId}/status?status=${status}`);
  return res.data;
};

export const getAllLeaveRequests = async () => {
  const res = await api.get<LeaveRequest[]>('/leave-requests/all');
  return res.data;
};

export const downloadProof = async (requestId: number) => {
  const res = await api.get(`/leave-requests/download-proof/${requestId}`, {
    responseType: 'blob',
  });
  return res.data;
};
