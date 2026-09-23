import axios from './axios';

export interface EmployeeEventDto {
  id: number;
  eventType: string;
  description: string;
  performedByName?: string;
  occurredAt: string;
}

export const eventsApi = {
  getEmployeeEvents: async (employeeId: number | string): Promise<EmployeeEventDto[]> => {
    const response = await axios.get<EmployeeEventDto[]>(`/events/employee/${employeeId}`);
    return response.data;
  }
};
