export function resolveHrPage(pathname: string) {
  if (pathname === "/workspace") return "overview";
  if (pathname.endsWith("/employees")) return "employees";
  if (pathname.endsWith("/contracts")) return "contracts";
  if (pathname.endsWith("/payroll")) return "payroll";
  return "overview";
}
