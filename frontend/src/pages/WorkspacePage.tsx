import type { ComponentType } from "react";
import EmployeeWorkspacePage from "@/pages/employee/EmployeeWorkspacePage";
import HrWorkspacePage from "@/pages/hr/HrWorkspacePage";
import FinanceWorkspacePage from "@/pages/finance/FinanceWorkspacePage";
import ClientWorkspacePage from "@/pages/client/ClientWorkspacePage";
import InfrastructureWorkspacePage from "@/pages/infrastructure/InfrastructureWorkspacePage";

const rolePages: Record<string, ComponentType> = {
  EMPLOYEE: EmployeeWorkspacePage,
  HR: HrWorkspacePage,
  FINANCE: FinanceWorkspacePage,
  CLIENT: ClientWorkspacePage,
  INFRASTRUCTURE: InfrastructureWorkspacePage,
};

export default function WorkspacePage() {
  const role = localStorage.getItem("role") ?? "EMPLOYEE";
  const RolePage = rolePages[role];
  if (RolePage) return <RolePage />;
  return null;
}
