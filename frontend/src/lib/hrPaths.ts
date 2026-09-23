export function useHrBasePath() {
  const role = localStorage.getItem("role");
  if (role === "ADMIN") return "/admin/hr";
  return role === "MANAGER" ? "/workspace/hr" : "/workspace";
}

export function resolveHrPage(pathname: string) {
  if (pathname === "/workspace" || pathname === "/workspace/hr" || pathname === "/admin/hr") return "overview";
  if (pathname.endsWith("/employees")) return "employees";
  if (pathname.endsWith("/candidates")) return "candidates";
  if (pathname.endsWith("/contracts")) return "contracts";
  if (pathname.endsWith("/requests")) return "requests";
  if (pathname.endsWith("/payroll") || pathname.endsWith("/payroll-inputs")) return "payroll";
  if (pathname.endsWith("/simulation")) return "simulation";
  if (pathname.endsWith("/leave-requests")) return "leave-requests";
  if (pathname.endsWith("/documents")) return "documents";
  return "overview";
}
