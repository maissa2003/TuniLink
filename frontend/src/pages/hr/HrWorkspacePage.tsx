import type { ComponentType } from "react";
import { useLocation } from "react-router-dom";
import HrOverview from "@/components/hr/HrOverview";
import HrEmployees from "@/components/hr/HrEmployees";
import HrContracts from "@/components/hr/HrContracts";
import HrPayrollInputs from "@/components/hr/HrPayrollInputs";
import { resolveHrPage } from "@/lib/hrPaths";

const pages: Record<string, ComponentType> = {
  overview: HrOverview,
  employees: HrEmployees,
  contracts: HrContracts,
  payroll: HrPayrollInputs,
};

export default function HrWorkspacePage() {
  const { pathname } = useLocation();
  const Page = pages[resolveHrPage(pathname)] ?? HrOverview;
  return <Page />;
}
