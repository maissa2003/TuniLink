import {
  LayoutDashboard, Users, Building2, Briefcase, FileText,
  Wallet, Calculator, Receipt, BarChart3, Landmark, HardHat, Settings,
  CalendarDays, FolderOpen, UserCog, UserPlus, UserCheck,
} from "lucide-react";
import { LanguageCode, translate } from "@/lib/i18n";

export type NavItem = { titleKey: string; href: string; icon: typeof LayoutDashboard };
export type NavGroup = {
  titleKey?: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
};

const adminCoreNavigation: NavItem[] = [
  { titleKey: "nav.dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { titleKey: "nav.users", href: "/admin/users", icon: Users },
  { titleKey: "nav.companies", href: "/admin/companies", icon: Building2 },
];

const adminFinanceNavigation: NavItem[] = [
  { titleKey: "nav.overview", href: "/admin/finance", icon: LayoutDashboard },
  { titleKey: "nav.payroll", href: "/admin/finance/payroll", icon: Wallet },
  { titleKey: "nav.infrastructure", href: "/admin/finance/infrastructure", icon: Building2 },
  { titleKey: "nav.taxes", href: "/admin/finance/taxes", icon: Receipt },
  { titleKey: "nav.margins", href: "/admin/finance/margins", icon: Calculator },
  { titleKey: "nav.invoices", href: "/admin/finance/invoices", icon: Receipt },
  { titleKey: "nav.reports", href: "/admin/finance/reports", icon: BarChart3 },
];

const adminHrNavigation: NavItem[] = [
  { titleKey: "nav.overview", href: "/admin/hr", icon: LayoutDashboard },
  { titleKey: "nav.requests", href: "/admin/hr/requests", icon: UserPlus },
  { titleKey: "nav.simulation", href: "/admin/hr/simulation", icon: Calculator },
  { titleKey: "nav.employees", href: "/admin/hr/employees", icon: Users },
  { titleKey: "nav.contracts", href: "/admin/hr/contracts", icon: FileText },
  { titleKey: "nav.payrollInputs", href: "/admin/hr/payroll", icon: Wallet },
  { titleKey: "nav.leaveRequests", href: "/admin/hr/leave-requests", icon: CalendarDays },
  { titleKey: "nav.documents", href: "/admin/hr/documents", icon: FolderOpen },
];

const adminClientNavigation: NavItem[] = [
  { titleKey: "nav.overview", href: "/admin/clients", icon: LayoutDashboard },
  { titleKey: "nav.requests", href: "/admin/clients/requests", icon: UserPlus },
  { titleKey: "nav.myTeam", href: "/admin/clients/team", icon: Briefcase },
  { titleKey: "nav.simulations", href: "/admin/clients/simulations", icon: Calculator },
  { titleKey: "nav.invoices", href: "/admin/clients/invoices", icon: Receipt },
  { titleKey: "nav.history", href: "/admin/clients/history", icon: FileText },
];



const adminAccountNavigation: NavItem[] = [
  { titleKey: "nav.settings", href: "/admin/settings", icon: Settings },
];

const adminNavigationGroups: NavGroup[] = [
  { titleKey: "admin.sidebar.platform", collapsible: true, defaultOpen: true, items: adminCoreNavigation },
  { titleKey: "admin.sidebar.finance", collapsible: true, defaultOpen: false, items: adminFinanceNavigation },
  { titleKey: "admin.sidebar.hr", collapsible: true, defaultOpen: false, items: adminHrNavigation },
  { titleKey: "admin.sidebar.clients", collapsible: true, defaultOpen: false, items: adminClientNavigation },
  { titleKey: "admin.sidebar.account", collapsible: false, defaultOpen: true, items: adminAccountNavigation },
];

const adminNavigation = adminNavigationGroups.flatMap((group) => group.items);

const hrWorkspaceItems: NavItem[] = [
  { titleKey: "nav.overview", href: "/workspace", icon: LayoutDashboard },
  { titleKey: "nav.candidates", href: "/workspace/candidates", icon: UserCheck },
  { titleKey: "nav.requests", href: "/workspace/requests", icon: UserPlus },
  { titleKey: "nav.simulation", href: "/workspace/simulation", icon: Calculator },
  { titleKey: "nav.employees", href: "/workspace/employees", icon: Users },
  { titleKey: "nav.contracts", href: "/workspace/contracts", icon: FileText },
  { titleKey: "nav.payrollInputs", href: "/workspace/payroll", icon: Wallet },
  { titleKey: "nav.leaveRequests", href: "/workspace/leave-requests", icon: CalendarDays },
  { titleKey: "nav.documents", href: "/workspace/documents", icon: FolderOpen },
];

const managerHrItems: NavItem[] = [
  { titleKey: "nav.overview", href: "/workspace/hr", icon: LayoutDashboard },
  { titleKey: "nav.candidates", href: "/workspace/hr/candidates", icon: UserCheck },
  { titleKey: "nav.requests", href: "/workspace/hr/requests", icon: UserPlus },
  { titleKey: "nav.simulation", href: "/workspace/hr/simulation", icon: Calculator },
  { titleKey: "nav.employees", href: "/workspace/hr/employees", icon: Users },
  { titleKey: "nav.contracts", href: "/workspace/hr/contracts", icon: FileText },
  { titleKey: "nav.payrollInputs", href: "/workspace/hr/payroll-inputs", icon: Wallet },
  { titleKey: "nav.agencyUsers", href: "/workspace/hr/users", icon: UserCog },
  { titleKey: "nav.leaveRequests", href: "/workspace/hr/leave-requests", icon: CalendarDays },
  { titleKey: "nav.documents", href: "/workspace/hr/documents", icon: FolderOpen },
];

const managerFinanceItems: NavItem[] = [
  { titleKey: "nav.overview", href: "/workspace/finance", icon: LayoutDashboard },
  { titleKey: "nav.payroll", href: "/workspace/finance/payroll", icon: Wallet },
  { titleKey: "nav.infrastructure", href: "/workspace/finance/infrastructure", icon: Building2 },
  { titleKey: "nav.taxes", href: "/workspace/finance/taxes", icon: Receipt },
  { titleKey: "nav.margins", href: "/workspace/finance/margins", icon: Calculator },
  { titleKey: "nav.invoices", href: "/workspace/finance/invoices", icon: Receipt },
  { titleKey: "nav.reports", href: "/workspace/finance/reports", icon: BarChart3 },
];

const managerEmployeePortalItems: NavItem[] = [
  { titleKey: "nav.overview", href: "/workspace/employees", icon: LayoutDashboard },
  { titleKey: "nav.myContract", href: "/workspace/employees/contract", icon: FileText },
  { titleKey: "nav.payslips", href: "/workspace/employees/payslips", icon: Wallet },
  { titleKey: "nav.leaveRequests", href: "/workspace/employees/leave", icon: CalendarDays },
  { titleKey: "nav.documents", href: "/workspace/employees/documents", icon: FolderOpen },
];

const accountItems: NavItem[] = [
  { titleKey: "nav.settings", href: "/workspace/settings", icon: Settings },
];

const managerOverviewItems: NavItem[] = [
  { titleKey: "nav.agencyOverview", href: "/workspace/hr", icon: LayoutDashboard },
];

const managerNavigationGroups: NavGroup[] = [
  { items: managerOverviewItems },
  { titleKey: "manager.sidebar.hr", collapsible: true, defaultOpen: true, items: managerHrItems },
  { titleKey: "manager.sidebar.finance", collapsible: true, defaultOpen: false, items: managerFinanceItems },
  { titleKey: "manager.sidebar.employees", collapsible: true, defaultOpen: false, items: managerEmployeePortalItems },
  { titleKey: "admin.sidebar.account", collapsible: false, defaultOpen: true, items: accountItems },
];

const hrNavigationGroups: NavGroup[] = [
  { titleKey: "hr.sidebar.title", collapsible: true, defaultOpen: true, items: hrWorkspaceItems },
  { titleKey: "admin.sidebar.account", collapsible: false, defaultOpen: true, items: accountItems },
];

const workspaceNavigation: Record<string, NavItem[]> = {
  HR: [...hrWorkspaceItems, ...accountItems],
  FINANCE: [
    { titleKey: "nav.overview", href: "/workspace", icon: LayoutDashboard },
    { titleKey: "nav.payroll", href: "/workspace/payroll", icon: Wallet },
    { titleKey: "nav.infrastructure", href: "/workspace/infrastructure", icon: Building2 },
    { titleKey: "nav.taxes", href: "/workspace/taxes", icon: Receipt },
    { titleKey: "nav.margins", href: "/workspace/margins", icon: Calculator },
    { titleKey: "nav.invoices", href: "/workspace/invoices", icon: Receipt },
    { titleKey: "nav.reports", href: "/workspace/reports", icon: BarChart3 },
    ...accountItems,
  ],
  EMPLOYEE: [
    { titleKey: "nav.overview", href: "/workspace", icon: LayoutDashboard },
    { titleKey: "nav.myContract", href: "/workspace/contract", icon: FileText },
    { titleKey: "nav.payslips", href: "/workspace/payslips", icon: Wallet },
    { titleKey: "nav.leaveRequests", href: "/workspace/leave", icon: CalendarDays },
    { titleKey: "nav.documents", href: "/workspace/documents", icon: FolderOpen },
    ...accountItems,
  ],
  INFRASTRUCTURE: [
    { titleKey: "nav.overview", href: "/workspace", icon: LayoutDashboard },
    { titleKey: "nav.operatingCosts", href: "/workspace/costs", icon: Landmark },
    { titleKey: "nav.resources", href: "/workspace/resources", icon: HardHat },
    { titleKey: "nav.reports", href: "/workspace/reports", icon: BarChart3 },
    ...accountItems,
  ],
  CLIENT: [
    { titleKey: "nav.overview", href: "/workspace", icon: LayoutDashboard },
    { titleKey: "nav.requests", href: "/workspace/requests", icon: UserPlus },
    { titleKey: "nav.myTeam", href: "/workspace/team", icon: Briefcase },
    { titleKey: "nav.simulations", href: "/workspace/simulations", icon: Calculator },
    { titleKey: "nav.invoices", href: "/workspace/invoices", icon: Receipt },
    { titleKey: "nav.history", href: "/workspace/history", icon: FileText },
    ...accountItems,
  ],
};

const financeNavigationGroups: NavGroup[] = [
  { titleKey: "finance.sidebar.title", collapsible: true, defaultOpen: true, items: workspaceNavigation.FINANCE.filter((i) => i.href !== "/workspace/settings") },
  { titleKey: "admin.sidebar.account", collapsible: false, defaultOpen: true, items: accountItems },
];

const employeeNavigationGroups: NavGroup[] = [
  { titleKey: "employee.sidebar.title", collapsible: true, defaultOpen: true, items: workspaceNavigation.EMPLOYEE.filter((i) => i.href !== "/workspace/settings") },
  { titleKey: "admin.sidebar.account", collapsible: false, defaultOpen: true, items: accountItems },
];

const clientNavigationGroups: NavGroup[] = [
  { titleKey: "client.sidebar.title", collapsible: true, defaultOpen: true, items: workspaceNavigation.CLIENT.filter((i) => i.href !== "/workspace/settings") },
  { titleKey: "admin.sidebar.account", collapsible: false, defaultOpen: true, items: accountItems },
];

const infrastructureNavigationGroups: NavGroup[] = [
  { titleKey: "infrastructure.sidebar.title", collapsible: true, defaultOpen: true, items: workspaceNavigation.INFRASTRUCTURE.filter((i) => i.href !== "/workspace/settings") },
  { titleKey: "admin.sidebar.account", collapsible: false, defaultOpen: true, items: accountItems },
];

export const navigation = adminNavigation;

export const getNavigation = (role: string | null) => {
  if (role === "ADMIN") return adminNavigation;
  if (role === "MANAGER") return managerNavigationGroups.flatMap((g) => g.items);
  if (role === "HR") return hrNavigationGroups.flatMap((g) => g.items);
  return workspaceNavigation[role ?? ""] ?? [];
};

export const getNavigationGroups = (role: string | null): NavGroup[] => {
  switch (role) {
    case "ADMIN":
      return adminNavigationGroups;
    case "MANAGER":
      return managerNavigationGroups;
    case "HR":
      return hrNavigationGroups;
    case "FINANCE":
      return financeNavigationGroups;
    case "EMPLOYEE":
      return employeeNavigationGroups;
    case "CLIENT":
      return clientNavigationGroups;
    case "INFRASTRUCTURE":
      return infrastructureNavigationGroups;
    default:
      return [{ items: getNavigation(role) }];
  }
};

export const navTitle = (item: NavItem, language?: LanguageCode) => translate(item.titleKey, language);
export const navGroupTitle = (group: NavGroup, language?: LanguageCode) =>
  group.titleKey ? translate(group.titleKey, language) : "";
export const roleLabel = (role: string | null, language?: LanguageCode) => translate(`role.${role ?? "workspace"}`, language);
export const portalTitle = (role: string | null, language?: LanguageCode) =>
  role === "ADMIN" ? translate("layout.adminWorkspace", language) : roleLabel(role, language);
