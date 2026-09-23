import axios from './axios';

export interface YearProjectionDto {
  year: number;
  totalCostTnd: number;
  totalBilledCad: number;
}

export interface PayrollRecordDto {
  id?: number;
  employeeId: number;
  employeeName?: string;
  contractId: number;
  periodMonth: string;
  grossSalary: number;
  employeeCnss: number;
  irppTax: number;
  bonus: number;
  netSalary: number;
  employerCnss: number;
  infraCostTotal: number;
  recruitmentMargin: number;
  infraMargin: number;
  totalEmployerCostTnd: number;
  finalInvoiceCad: number;
  exchangeRateUsed: number;
  status?: 'PENDING' | 'VALIDATED';
  validatedByName?: string;
  validatedAt?: string;
  createdAt?: string;
  monthlyBudgetTnd?: number;
  annualBudgetTnd?: number;
  yearProjections?: YearProjectionDto[];
}

export interface InvoiceDto {
  id: number;
  assignmentId: number;
  employeeName?: string;
  clientCompanyName?: string;
  invoiceNumber: string;
  periodMonth: string;
  grossAmountTnd: number;
  netAmountCad: number;
  exchangeRateUsed: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
  generatedByName?: string;
  generatedAt?: string;
}

export const financeApi = {
  getPayrollPreview: async (employeeId: number | string): Promise<PayrollRecordDto> => {
    const response = await axios.get<PayrollRecordDto>(`/finance/payroll/${employeeId}`);
    return response.data;
  },

  validatePayroll: async (employeeId: number | string): Promise<PayrollRecordDto> => {
    const response = await axios.post<PayrollRecordDto>(`/finance/payroll/${employeeId}/validate`);
    return response.data;
  },

  getPayrollHistory: async (employeeId: number | string): Promise<PayrollRecordDto[]> => {
    const response = await axios.get<PayrollRecordDto[]>(`/finance/payroll/${employeeId}/history`);
    return response.data;
  },

  getAllInvoices: async (): Promise<InvoiceDto[]> => {
    const response = await axios.get<InvoiceDto[]>('/finance/invoices');
    return response.data;
  },

  getInvoicesByAssignmentId: async (assignmentId: number | string): Promise<InvoiceDto[]> => {
    const response = await axios.get<InvoiceDto[]>(`/finance/invoices/assignment/${assignmentId}`);
    return response.data;
  },

  rejectPayroll: async (employeeId: number | string, reason: string): Promise<void> => {
    await axios.post(`/finance/payroll/${employeeId}/reject`, { reason });
  },

  getBudget: async (employeeId: number | string): Promise<any> => {
    const response = await axios.get(`/finance/budget/${employeeId}`);
    return response.data;
  },

  getInvoicesByEmployee: async (employeeId: number | string): Promise<InvoiceDto[]> => {
    const response = await axios.get<InvoiceDto[]>(`/finance/invoices/employee/${employeeId}`);
    return response.data;
  }
};
