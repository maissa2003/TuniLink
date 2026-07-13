export function resolveFinancePage(pathname: string) {
  if (pathname === "/workspace") return "overview";
  if (pathname.endsWith("/payroll")) return "payroll";
  if (pathname.endsWith("/margins")) return "margins";
  if (pathname.endsWith("/invoices")) return "invoices";
  if (pathname.endsWith("/reports")) return "reports";
  return "overview";
}
