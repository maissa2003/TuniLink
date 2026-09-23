import type { ComponentType } from "react";
import { useLocation } from "react-router-dom";
import ManagerOverview from "@/components/manager/ManagerOverview";
import HrEmployees from "@/components/hr/HrEmployees";
import HrContracts from "@/components/hr/HrContracts";
import HrPayrollInputs from "@/components/hr/HrPayrollInputs";
import HrAgencyUsers from "@/components/hr/HrAgencyUsers";
import HrSimulationPage from "@/components/hr/HrSimulationPage";
import HrLeaveRequestsPage from "@/components/hr/HrLeaveRequestsPage";
import HrDocumentsPage from "@/components/hr/HrDocumentsPage";
import HrRequestsPage from "@/components/hr/HrRequestsPage";
import FinanceOverview from "@/components/finance/FinanceOverview";
import FinancePayroll from "@/components/finance/FinancePayroll";
import FinanceMargins from "@/components/finance/FinanceMargins";
import FinanceInvoices from "@/components/finance/FinanceInvoices";
import FinanceReports from "@/components/finance/FinanceReports";
import EmployeeWorkspacePage from "@/pages/employee/EmployeeWorkspacePage";
import { resolveManagerPage } from "@/lib/managerPaths";

const pages: Record<string, ComponentType> = {
  "overview": ManagerOverview,
  "hr-requests": HrRequestsPage,
  "hr-simulation": HrSimulationPage,
  "hr-employees": HrEmployees,
  "hr-contracts": HrContracts,
  "hr-payroll": HrPayrollInputs,
  "hr-users": HrAgencyUsers,
  "hr-leave-requests": HrLeaveRequestsPage,
  "hr-documents": HrDocumentsPage,
  "finance-overview": FinanceOverview,
  "finance-payroll": FinancePayroll,
  "finance-margins": FinanceMargins,
  "finance-invoices": FinanceInvoices,
  "finance-reports": FinanceReports,
  "employee-portal": EmployeeWorkspacePage,
};

export default function ManagerWorkspacePage() {
  const { pathname } = useLocation();
  const key = resolveManagerPage(pathname);
  const Page = pages[key] ?? ManagerOverview;
  return <Page />;
}
