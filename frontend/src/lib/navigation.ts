import {
  LayoutDashboard, Users, Building2, Briefcase, FileText,
  Wallet, Calculator, Receipt, BarChart3, Landmark, HardHat, Settings,
  CalendarDays, FolderOpen
} from "lucide-react";
import { LanguageCode, translate } from "@/lib/i18n";

export type NavItem = { titleKey: string; href: string; icon: typeof LayoutDashboard };
export type NavGroup = { titleKey?: string; items: NavItem[] };

const adminCoreNavigation: NavItem[] = [
  { titleKey: "nav.dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { titleKey: "nav.users", href: "/admin/users", icon: Users },
  { titleKey: "nav.companies", href: "/admin/companies", icon: Building2 },
];

const adminFinanceNavigation: NavItem[] = [
  { titleKey: "nav.overview", href: "/admin/finance", icon: LayoutDashboard },
  { titleKey: "nav.payroll", href: "/admin/finance/payroll", icon: Wallet },
  { titleKey: "nav.margins", href: "/admin/finance/margins", icon: Calculator },
  { titleKey: "nav.invoices", href: "/admin/finance/invoices", icon: Receipt },
  { titleKey: "nav.reports", href: "/admin/finance/reports", icon: BarChart3 },
];

const adminHrNavigation: NavItem[] = [
  { titleKey: "nav.overview", href: "/admin/hr", icon: LayoutDashboard },
  { titleKey: "nav.employees", href: "/admin/hr/employees", icon: Users },
  { titleKey: "nav.contracts", href: "/admin/hr/contracts", icon: FileText },
  { titleKey: "nav.payrollInputs", href: "/admin/hr/payroll", icon: Wallet },
];

const adminClientNavigation: NavItem[] = [
  { titleKey: "nav.overview", href: "/admin/clients", icon: LayoutDashboard },
  { titleKey: "nav.myTeam", href: "/admin/clients/team", icon: Briefcase },
  { titleKey: "nav.simulations", href: "/admin/clients/simulations", icon: Calculator },
  { titleKey: "nav.invoices", href: "/admin/clients/invoices", icon: Receipt },
  { titleKey: "nav.history", href: "/admin/clients/history", icon: FileText },
];

const adminEmployeeNavigation: NavItem[] = [
  { titleKey: "nav.overview", href: "/admin/employees", icon: LayoutDashboard },
  { titleKey: "nav.myContract", href: "/admin/employees/contract", icon: FileText },
  { titleKey: "nav.payslips", href: "/admin/employees/payslips", icon: Wallet },
  { titleKey: "nav.leaveRequests", href: "/admin/employees/leave", icon: CalendarDays },
  { titleKey: "nav.documents", href: "/admin/employees/documents", icon: FolderOpen },
];

const adminAccountNavigation: NavItem[] = [
  { titleKey: "nav.settings", href: "/admin/settings", icon: Settings },
];

const adminNavigationGroups: NavGroup[] = [
  { titleKey: "admin.sidebar.platform", items: adminCoreNavigation },
  { titleKey: "admin.sidebar.finance", items: adminFinanceNavigation },
  { titleKey: "admin.sidebar.hr", items: adminHrNavigation },
  { titleKey: "admin.sidebar.clients", items: adminClientNavigation },
  { titleKey: "admin.sidebar.employees", items: adminEmployeeNavigation },
  { titleKey: "admin.sidebar.account", items: adminAccountNavigation },
];

const adminNavigation = adminNavigationGroups.flatMap((group) => group.items);

const workspaceNavigation: Record<string, NavItem[]> = {
  HR: [
    { titleKey: "nav.overview", href: "/workspace", icon: LayoutDashboard },
    { titleKey: "nav.employees", href: "/workspace/employees", icon: Users },
    { titleKey: "nav.contracts", href: "/workspace/contracts", icon: FileText },
    { titleKey: "nav.payrollInputs", href: "/workspace/payroll", icon: Wallet },
    { titleKey: "nav.settings", href: "/workspace/settings", icon: Settings },
  ],
  FINANCE: [
    { titleKey: "nav.overview", href: "/workspace", icon: LayoutDashboard },
    { titleKey: "nav.payroll", href: "/workspace/payroll", icon: Wallet },
    { titleKey: "nav.margins", href: "/workspace/margins", icon: Calculator },
    { titleKey: "nav.invoices", href: "/workspace/invoices", icon: Receipt },
    { titleKey: "nav.reports", href: "/workspace/reports", icon: BarChart3 },
    { titleKey: "nav.settings", href: "/workspace/settings", icon: Settings },
  ],
  EMPLOYEE: [
    { titleKey: "nav.overview", href: "/workspace", icon: LayoutDashboard },
    { titleKey: "nav.myContract", href: "/workspace/contract", icon: FileText },
    { titleKey: "nav.payslips", href: "/workspace/payslips", icon: Wallet },
    { titleKey: "nav.leaveRequests", href: "/workspace/leave", icon: CalendarDays },
    { titleKey: "nav.documents", href: "/workspace/documents", icon: FolderOpen },
    { titleKey: "nav.settings", href: "/workspace/settings", icon: Settings },
  ],
  INFRASTRUCTURE: [
    { titleKey: "nav.overview", href: "/workspace", icon: LayoutDashboard },
    { titleKey: "nav.operatingCosts", href: "/workspace/costs", icon: Landmark },
    { titleKey: "nav.resources", href: "/workspace/resources", icon: HardHat },
    { titleKey: "nav.reports", href: "/workspace/reports", icon: BarChart3 },
    { titleKey: "nav.settings", href: "/workspace/settings", icon: Settings },
  ],
  CLIENT: [
    { titleKey: "nav.overview", href: "/workspace", icon: LayoutDashboard },
    { titleKey: "nav.myTeam", href: "/workspace/team", icon: Briefcase },
    { titleKey: "nav.simulations", href: "/workspace/simulations", icon: Calculator },
    { titleKey: "nav.invoices", href: "/workspace/invoices", icon: Receipt },
    { titleKey: "nav.history", href: "/workspace/history", icon: FileText },
    { titleKey: "nav.settings", href: "/workspace/settings", icon: Settings },
  ],
};

export const navigation = adminNavigation;
export const getNavigation = (role: string | null) => role === "ADMIN" ? adminNavigation : (workspaceNavigation[role ?? ""] ?? []);
export const getNavigationGroups = (role: string | null): NavGroup[] => {
  if (role === "ADMIN") return adminNavigationGroups;
  const sidebarTitles: Record<string, string> = {
    EMPLOYEE: "employee.sidebar.title",
    HR: "hr.sidebar.title",
    FINANCE: "finance.sidebar.title",
    CLIENT: "client.sidebar.title",
    INFRASTRUCTURE: "infrastructure.sidebar.title",
  };
  const titleKey = sidebarTitles[role ?? ""];
  if (titleKey && workspaceNavigation[role ?? ""]) {
    return [{ titleKey, items: workspaceNavigation[role ?? ""] }];
  }
  return [{ items: getNavigation(role) }];
};
export const navTitle = (item: NavItem, language?: LanguageCode) => translate(item.titleKey, language);
export const navGroupTitle = (group: NavGroup, language?: LanguageCode) =>
  group.titleKey ? translate(group.titleKey, language) : "";
export const roleLabel = (role: string | null, language?: LanguageCode) => translate(`role.${role ?? "workspace"}`, language);
export const portalTitle = (role: string | null, language?: LanguageCode) =>
  role === "ADMIN" ? translate("layout.adminWorkspace", language) : roleLabel(role, language);
