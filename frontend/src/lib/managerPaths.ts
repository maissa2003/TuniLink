export function resolveManagerPage(pathname: string) {
  // Manager own overview (root /workspace/hr)
  if (pathname === "/workspace/hr" || pathname === "/workspace/hr/") return "overview";

  // HR sub-pages
  if (pathname.includes("/hr/requests")) return "hr-requests";
  if (pathname.includes("/hr/simulation")) return "hr-simulation";
  if (pathname.includes("/hr/employees")) return "hr-employees";
  if (pathname.includes("/hr/contracts")) return "hr-contracts";
  if (pathname.includes("/hr/payroll-inputs")) return "hr-payroll";
  if (pathname.includes("/hr/users")) return "hr-users";
  if (pathname.includes("/hr/leave-requests")) return "hr-leave-requests";
  if (pathname.includes("/hr/documents")) return "hr-documents";

  // Finance sub-pages
  if (pathname === "/workspace/finance" || pathname === "/workspace/finance/") return "finance-overview";
  if (pathname.includes("/finance/payroll")) return "finance-payroll";
  if (pathname.includes("/finance/margins")) return "finance-margins";
  if (pathname.includes("/finance/invoices")) return "finance-invoices";
  if (pathname.includes("/finance/reports")) return "finance-reports";

  // Employee portal
  if (pathname.startsWith("/workspace/employees")) return "employee-portal";

  return "overview";
}
