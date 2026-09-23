import axios from './axios';

export interface EmployeeContractDto {
  id: number;
  employeeId: number;
  employeeName: string;
  contractType: 'CDI' | 'CDD' | 'FREELANCE';
  position: string;
  startDate: string;
  endDate?: string;
  grossSalary: number;
  bonus: number;
  status: 'DRAFT' | 'ACTIVE' | 'TERMINATED';
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractDto {
  contractType: 'CDI' | 'CDD' | 'FREELANCE';
  position: string;
  startDate: string;
  endDate?: string;
  grossSalary: number;
  bonus?: number;
}

export const contractApi = {
  getByEmployeeId: async (employeeId: number | string): Promise<EmployeeContractDto[]> => {
    const response = await axios.get<EmployeeContractDto[]>(`/contracts/employee/${employeeId}`);
    return response.data;
  },

  getActiveByEmployeeId: async (employeeId: number | string): Promise<EmployeeContractDto> => {
    const response = await axios.get<EmployeeContractDto>(`/contracts/employee/${employeeId}/active`);
    return response.data;
  },

  create: async (employeeId: number | string, data: CreateContractDto): Promise<EmployeeContractDto> => {
    const response = await axios.post<EmployeeContractDto>(`/contracts/employee/${employeeId}`, data);
    return response.data;
  },

  update: async (contractId: number | string, data: CreateContractDto): Promise<EmployeeContractDto> => {
    const response = await axios.put<EmployeeContractDto>(`/contracts/${contractId}`, data);
    return response.data;
  }
};
