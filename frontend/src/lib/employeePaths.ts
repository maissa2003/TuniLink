import { useLocation } from "react-router-dom";

export function useEmployeeBasePath() {
  const { pathname } = useLocation();
  return pathname.startsWith("/admin/employees") ? "/admin/employees" : "/workspace";
}

export function resolveEmployeePage(pathname: string) {
  if (pathname === "/workspace" || pathname === "/admin/employees") return "overview";
  if (pathname.endsWith("/contract")) return "contract";
  if (pathname.endsWith("/payslips")) return "payslips";
  if (pathname.endsWith("/leave")) return "leave";
  if (pathname.endsWith("/documents")) return "documents";
  return "overview";
}
