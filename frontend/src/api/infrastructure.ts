import axios from './axios';

export type InfrastructureCostCategory =
  | 'LAPTOP'
  | 'OFFICE_RENT'
  | 'INTERNET'
  | 'ELECTRICITY'
  | 'MS_LICENSE'
  | 'CLOUD_SERVICES'
  | 'IT_SUPPORT'
  | 'OTHER';

export interface InfrastructureCostDto {
  id: number;
  employeeId: number;
  employeeName: string;
  category: InfrastructureCostCategory;
  amount: number;
  resourceName?: string;
  description?: string;
  assignmentDate?: string;
  assignedByName?: string;
  companyName?: string;
  createdAt?: string;
}

export interface CreateInfrastructureCostDto {
  category: InfrastructureCostCategory;
  amount: number;
  resourceName?: string;
  description?: string;
  assignmentDate?: string;
}

export const infrastructureApi = {
  getByEmployeeId: async (employeeId: number | string): Promise<InfrastructureCostDto[]> => {
    const response = await axios.get<InfrastructureCostDto[]>(`/infrastructure/employee/${employeeId}`);
    return response.data;
  },

  getTotalByEmployeeId: async (employeeId: number | string): Promise<{ total: number }> => {
    const response = await axios.get<{ total: number }>(`/infrastructure/employee/${employeeId}/total`);
    return response.data;
  },

  add: async (employeeId: number | string, data: CreateInfrastructureCostDto): Promise<InfrastructureCostDto> => {
    const response = await axios.post<InfrastructureCostDto>(`/infrastructure/employee/${employeeId}`, data);
    return response.data;
  },

  update: async (costId: number | string, data: CreateInfrastructureCostDto): Promise<InfrastructureCostDto> => {
    const response = await axios.put<InfrastructureCostDto>(`/infrastructure/${costId}`, data);
    return response.data;
  },

  delete: async (costId: number | string): Promise<void> => {
    await axios.delete(`/infrastructure/${costId}`);
  },

  completeAssignment: async (assignmentId: number | string): Promise<void> => {
    await axios.post(`/infrastructure/complete-assignment/${assignmentId}`);
  }
};
