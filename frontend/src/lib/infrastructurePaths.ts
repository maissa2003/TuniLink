export function resolveInfrastructurePage(pathname: string) {
  if (pathname === "/workspace") return "overview";
  if (pathname.endsWith("/costs")) return "costs";
  if (pathname.endsWith("/resources")) return "resources";
  if (pathname.endsWith("/reports")) return "reports";
  return "overview";
}
