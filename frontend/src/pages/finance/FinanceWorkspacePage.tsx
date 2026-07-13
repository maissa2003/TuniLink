import type { ComponentType } from "react";
import { useLocation } from "react-router-dom";
import FinanceOverview from "@/components/finance/FinanceOverview";
import FinancePayroll from "@/components/finance/FinancePayroll";
import FinanceMargins from "@/components/finance/FinanceMargins";
import FinanceInvoices from "@/components/finance/FinanceInvoices";
import FinanceReports from "@/components/finance/FinanceReports";
import { resolveFinancePage } from "@/lib/financePaths";

const pages: Record<string, ComponentType> = {
  overview: FinanceOverview,
  payroll: FinancePayroll,
  margins: FinanceMargins,
  invoices: FinanceInvoices,
  reports: FinanceReports,
};

export default function FinanceWorkspacePage() {
  const { pathname } = useLocation();
  const Page = pages[resolveFinancePage(pathname)] ?? FinanceOverview;
  return <Page />;
}
