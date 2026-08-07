import type { ComponentType } from "react";
import { useLocation } from "react-router-dom";
import EmployeeWorkspacePage from "@/pages/employee/EmployeeWorkspacePage";
import HrOverview from "@/components/hr/HrOverview";
import HrCandidates from "@/components/hr/HrCandidates";
import HrEmployees from "@/components/hr/HrEmployees";
import HrContracts from "@/components/hr/HrContracts";
import HrRequestsPage from "@/components/hr/HrRequestsPage";
import HrPayrollInputs from "@/components/hr/HrPayrollInputs";
import HrSimulationPage from "@/components/hr/HrSimulationPage";
import HrLeaveRequestsPage from "@/components/hr/HrLeaveRequestsPage";
import HrDocumentsPage from "@/components/hr/HrDocumentsPage";
import { resolveHrPage } from "@/lib/hrPaths";

const pages: Record<string, ComponentType> = {
  overview: HrOverview,
  candidates: HrCandidates,
  employees: HrEmployees,
  requests: HrRequestsPage,
  contracts: HrContracts,
  payroll: HrPayrollInputs,
  simulation: HrSimulationPage,
  "leave-requests": HrLeaveRequestsPage,
  documents: HrDocumentsPage,
};

export default function HrWorkspacePage() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/workspace/employee-portal")) {
    return <EmployeeWorkspacePage />;
  }
  const Page = pages[resolveHrPage(pathname)] ?? HrOverview;
  return <Page />;
}
