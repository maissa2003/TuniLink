import type { ComponentType } from "react";
import EmployeeWorkspacePage from "@/pages/employee/EmployeeWorkspacePage";
import HrWorkspacePage from "@/pages/hr/HrWorkspacePage";
import FinanceWorkspacePage from "@/pages/finance/FinanceWorkspacePage";
import ClientWorkspacePage from "@/pages/client/ClientWorkspacePage";
import InfrastructureWorkspacePage from "@/pages/infrastructure/InfrastructureWorkspacePage";
import ManagerWorkspacePage from "@/pages/manager/ManagerWorkspacePage";

const rolePages: Record<string, ComponentType> = {
  MANAGER: ManagerWorkspacePage,
  HR: HrWorkspacePage,
  FINANCE: FinanceWorkspacePage,
  CLIENT: ClientWorkspacePage,
  INFRASTRUCTURE: InfrastructureWorkspacePage,
  EMPLOYEE: EmployeeWorkspacePage,
};

export default function WorkspacePage() {
  const role = localStorage.getItem("role") ?? "EMPLOYEE";
  const RolePage = rolePages[role] ?? EmployeeWorkspacePage;
  return <RolePage />;
}
