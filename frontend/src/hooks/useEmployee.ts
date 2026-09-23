import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi, EmployeeDto } from '../api/employees';
import { contractApi, CreateContractDto } from '../api/contracts';
import { infrastructureApi, CreateInfrastructureCostDto } from '../api/infrastructure';
import { financeApi } from '../api/finance';
import { eventsApi } from '../api/events';

export const useEmployees = () => {
  return useQuery<EmployeeDto[]>({
    queryKey: ['employees'],
    queryFn: employeeApi.getAll,
  });
};

export const useEmployee = (id: number | string | undefined) => {
  return useQuery<EmployeeDto>({
    queryKey: ['employee', id],
    queryFn: () => employeeApi.getById(id!),
    enabled: !!id,
  });
};

export const useMyProfile = () => {
  return useQuery<EmployeeDto>({
    queryKey: ['employee', 'my'],
    queryFn: employeeApi.getMyProfile,
  });
};

export const useUpdateEmployeeStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: string }) =>
      employeeApi.updateStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployeeProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<EmployeeDto> }) =>
      employeeApi.updateProfile(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useEmployeeContracts = (employeeId: number | string | undefined) => {
  return useQuery({
    queryKey: ['contracts', employeeId],
    queryFn: () => contractApi.getByEmployeeId(employeeId!),
    enabled: !!employeeId,
  });
};

export const useActiveContract = (employeeId: number | string | undefined) => {
  return useQuery({
    queryKey: ['activeContract', employeeId],
    queryFn: () => contractApi.getActiveByEmployeeId(employeeId!),
    enabled: !!employeeId,
    retry: false, // It's fine if there isn't one
  });
};

export const useCreateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, data }: { employeeId: number | string; data: CreateContractDto }) =>
      contractApi.create(employeeId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['activeContract', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contractId, employeeId: _employeeId, data }: { contractId: number | string; employeeId: number | string; data: CreateContractDto }) =>
      contractApi.update(contractId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['activeContract', variables.employeeId] });
    },
  });
};

export const useInfrastructureCosts = (employeeId: number | string | undefined) => {
  return useQuery({
    queryKey: ['infraCosts', employeeId],
    queryFn: () => infrastructureApi.getByEmployeeId(employeeId!),
    enabled: !!employeeId,
  });
};

export const useInfrastructureTotal = (employeeId: number | string | undefined) => {
  return useQuery({
    queryKey: ['infraTotal', employeeId],
    queryFn: () => infrastructureApi.getTotalByEmployeeId(employeeId!),
    enabled: !!employeeId,
  });
};

export const useAddInfrastructureCost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, data }: { employeeId: number | string; data: CreateInfrastructureCostDto }) =>
      infrastructureApi.add(employeeId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['infraCosts', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['infraTotal', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useDeleteInfrastructureCost = (employeeId: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (costId: number | string) => infrastructureApi.delete(costId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infraCosts', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['infraTotal', employeeId] });
    },
  });
};

export const useCompleteAssignment = (employeeId: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignmentId: number | string) => infrastructureApi.completeAssignment(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const usePayrollPreview = (employeeId: number | string | undefined) => {
  return useQuery({
    queryKey: ['payrollPreview', employeeId],
    queryFn: () => financeApi.getPayrollPreview(employeeId!),
    enabled: !!employeeId,
    retry: false,
  });
};

export const useValidatePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employeeId: number | string) => financeApi.validatePayroll(employeeId),
    onSuccess: (_data, employeeId) => {
      queryClient.invalidateQueries({ queryKey: ['payrollHistory', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['payrollPreview', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const usePayrollHistory = (employeeId: number | string | undefined) => {
  return useQuery({
    queryKey: ['payrollHistory', employeeId],
    queryFn: () => financeApi.getPayrollHistory(employeeId!),
    enabled: !!employeeId,
  });
};

export const useAllInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: financeApi.getAllInvoices,
  });
};

export const useOnboardEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { fullName: string; email: string; department?: string; nationality?: string }) =>
      employeeApi.onboard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useEmployeeInvoices = (employeeId: number | string | undefined) => {
  return useQuery({
    queryKey: ['invoices', employeeId],
    queryFn: () => financeApi.getInvoicesByEmployee(employeeId!),
    enabled: !!employeeId,
  });
};

export const useEmployeeBudget = (employeeId: number | string | undefined) => {
  return useQuery({
    queryKey: ['budget', employeeId],
    queryFn: () => financeApi.getBudget(employeeId!),
    enabled: !!employeeId,
    retry: false,
  });
};

export const useEmployeeEvents = (employeeId: number | string | undefined) => {
  return useQuery({
    queryKey: ['events', employeeId],
    queryFn: () => eventsApi.getEmployeeEvents(employeeId!),
    enabled: !!employeeId,
  });
};
