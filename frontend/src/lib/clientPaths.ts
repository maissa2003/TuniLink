export function resolveClientPage(pathname: string) {
  if (pathname === "/workspace" || pathname === "/admin/clients") return "overview";
  if (pathname.endsWith("/team")) return "team";
  if (pathname.endsWith("/simulations")) return "simulations";
  if (pathname.endsWith("/invoices")) return "invoices";
  if (pathname.endsWith("/requests")) return "requests";
  if (pathname.endsWith("/history")) return "history";
  return "overview";
}
