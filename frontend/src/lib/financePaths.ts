export function resolveFinancePage(pathname: string) {
  if (pathname === "/workspace" || pathname === "/workspace/finance" || pathname === "/admin/finance") return "overview";
  if (pathname.endsWith("/payroll")) return "payroll";
  if (pathname.endsWith("/infrastructure")) return "infrastructure";
  if (pathname.endsWith("/taxes")) return "taxes";
  if (pathname.endsWith("/margins")) return "margins";
  if (pathname.endsWith("/invoices")) return "invoices";
  if (pathname.endsWith("/reports")) return "reports";
  return "overview";
}
