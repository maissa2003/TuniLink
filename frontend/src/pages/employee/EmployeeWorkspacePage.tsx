import type { ComponentType } from "react";
import { useLocation } from "react-router-dom";
import EmployeeOverview from "@/components/employee/EmployeeOverview";
import EmployeeContract from "@/components/employee/EmployeeContract";
import EmployeePayslips from "@/components/employee/EmployeePayslips";
import EmployeeLeaveRequests from "@/components/employee/EmployeeLeaveRequests";
import EmployeeDocuments from "@/components/employee/EmployeeDocuments";
import { resolveEmployeePage } from "@/lib/employeePaths";

const pages: Record<string, ComponentType> = {
  overview: EmployeeOverview,
  contract: EmployeeContract,
  payslips: EmployeePayslips,
  leave: EmployeeLeaveRequests,
  documents: EmployeeDocuments,
};

export default function EmployeeWorkspacePage() {
  const { pathname } = useLocation();
  const Page = pages[resolveEmployeePage(pathname)] ?? EmployeeOverview;
  return <Page />;
}
