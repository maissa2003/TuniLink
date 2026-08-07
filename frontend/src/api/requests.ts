import api from "./axios";

import { SimulationResult } from "./simulations";

export interface ResourceRequest {
  id: number;
  clientCompanyId: number;
  clientCompanyName: string;
  title: string;
  description: string;
  targetDate: string;
  seniorityLevel?: string;
  workMode?: string;
  requiredSkills?: string;
  estimatedBudgetCad?: number;
  annualRaisePercent?: number;
  simulationDetails?: string;
  rejectionReason?: string;
  status: "PENDING" | "IN_PROGRESS" | "SIMULATION_PENDING" | "FULFILLED" | "CANCELLED";
  assignmentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceRequest {
  title: string;
  description: string;
  targetDate: string;
  seniorityLevel?: string;
  workMode?: string;
  requiredSkills?: string;
  estimatedBudgetCad?: number;
  annualRaisePercent?: number;
}

export const getMyRequests = async () => {
  const res = await api.get<ResourceRequest[]>("/resource-requests/my");
  return res.data;
};

export const getAllRequests = async () => {
  const res = await api.get<ResourceRequest[]>("/resource-requests");
  return res.data;
};

export const createRequest = async (data: CreateResourceRequest) => {
  const res = await api.post<ResourceRequest>("/resource-requests", data);
  return res.data;
};

export const updateRequestStatus = async (id: number, status: string, assignmentId?: number) => {
  const res = await api.put<ResourceRequest>(`/resource-requests/${id}/status`, { status, assignmentId });
  return res.data;
};

export const saveSimulationForRequest = async (id: number, simulation: SimulationResult) => {
  const res = await api.post<ResourceRequest>(`/resource-requests/${id}/save-simulation`, simulation);
  return res.data;
};

export const approveSimulation = async (id: number) => {
  const res = await api.post<ResourceRequest>(`/resource-requests/${id}/approve`);
  return res.data;
};

export const rejectSimulation = async (id: number, reason?: string) => {
  const res = await api.post<ResourceRequest>(`/resource-requests/${id}/reject`, { reason });
  return res.data;
};
