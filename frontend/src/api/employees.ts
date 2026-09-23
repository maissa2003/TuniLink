import axios from './axios';

export interface EmployeeDto {
  id: number;
  employeeNumber: string;
  fullName: string;
  nationality: string;
  department: string;
  salary: number;
  netSalary: number;
  taxExempt: boolean;
  status: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  cinNumber?: string;
  documentPath?: string;
  assignmentId?: number;
  clientCompanyName?: string;
  clientCompanyId?: number;
  infrastructureCompanyName?: string;
  recruitmentCompanyName?: string;
  activeContractId?: number;
  contractType?: string;
  position?: string;
  contractGrossSalary?: number;
  infraCostTotal?: number;
  email?: string;
  username?: string;
  userId?: number;
}

export const employeeApi = {
  getAll: async (): Promise<EmployeeDto[]> => {
    const response = await axios.get<EmployeeDto[]>('/employees');
    return response.data;
  },

  getById: async (id: number | string): Promise<EmployeeDto> => {
    const response = await axios.get<EmployeeDto>(`/employees/${id}`);
    return response.data;
  },

  getMyProfile: async (): Promise<EmployeeDto> => {
    const response = await axios.get<EmployeeDto>('/employees/my');
    return response.data;
  },

  updateStatus: async (id: number | string, status: string): Promise<EmployeeDto> => {
    const response = await axios.put<EmployeeDto>(`/employees/${id}/status`, { status });
    return response.data;
  },

  updateProfile: async (id: number | string, data: Partial<EmployeeDto>): Promise<EmployeeDto> => {
    const response = await axios.put<EmployeeDto>(`/employees/${id}`, data);
    return response.data;
  },

  onboard: async (data: { fullName: string; email: string; department?: string; nationality?: string }): Promise<EmployeeDto> => {
    const response = await axios.post<EmployeeDto>('/employees', data);
    return response.data;
  }
};
