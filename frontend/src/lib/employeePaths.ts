import { useLocation } from "react-router-dom";

export function useEmployeeBasePath() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin/employees")) return "/admin/employees";
  if (pathname.startsWith("/workspace/employees")) return "/workspace/employees";
  if (pathname.startsWith("/workspace/employee-portal")) return "/workspace/employee-portal";
  return "/workspace";
}

export function resolveEmployeePage(pathname: string) {
  const basePaths = ["/workspace", "/admin/employees", "/workspace/employees", "/workspace/employee-portal"];
  if (basePaths.some((base) => pathname === base || pathname === `${base}/`)) return "overview";
  if (pathname.endsWith("/contract")) return "contract";
  if (pathname.endsWith("/payslips")) return "payslips";
  if (pathname.endsWith("/leave")) return "leave";
  if (pathname.endsWith("/documents")) return "documents";
  return "overview";
}
