import { Link } from "react-router-dom";
import {
  Users, FileText, Wallet, BarChart3, TrendingUp, TrendingDown,
  ArrowRight, CheckCircle2, Clock, AlertTriangle, Building2,
  CalendarDays, UserCheck, DollarSign, Activity, ShieldCheck,
  UserPlus, ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const managerName = localStorage.getItem("username") ?? "Manager";

const KPI_CARDS = [
  {
    label: "Total Employees",
    value: "48",
    sub: "+3 this month",
    trend: "up",
    icon: Users,
    gradient: "from-blue-500 to-blue-700",
    lightBg: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    label: "Active Contracts",
    value: "42",
    sub: "6 pending renewal",
    trend: "neutral",
    icon: FileText,
    gradient: "from-violet-500 to-violet-700",
    lightBg: "bg-violet-50",
    textColor: "text-violet-700",
  },
  {
    label: "Monthly Payroll",
    value: "€ 184K",
    sub: "+2.4% vs last month",
    trend: "up",
    icon: DollarSign,
    gradient: "from-emerald-500 to-emerald-700",
    lightBg: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
  {
    label: "Pending Leaves",
    value: "7",
    sub: "3 urgent",
    trend: "down",
    icon: CalendarDays,
    gradient: "from-amber-500 to-amber-600",
    lightBg: "bg-amber-50",
    textColor: "text-amber-700",
  },
];

const DEPARTMENT_HEALTH = [
  { dept: "HR", status: "healthy", employees: 5, issues: 0, color: "text-emerald-600", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
  { dept: "Finance", status: "healthy", employees: 6, issues: 1, color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
  { dept: "Engineering", status: "attention", employees: 22, issues: 3, color: "text-amber-600", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700" },
  { dept: "Business Dev.", status: "healthy", employees: 9, issues: 0, color: "text-violet-600", bg: "bg-violet-50", badge: "bg-violet-100 text-violet-700" },
  { dept: "Infrastructure", status: "critical", employees: 6, issues: 2, color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700" },
];

const RECENT_ACTIVITY = [
  { type: "leave", text: "Malek Guemri submitted a sick leave request", time: "2 hours ago", icon: CalendarDays, color: "text-amber-600 bg-amber-100" },
  { type: "contract", text: "New contract signed — Sarra Khelifi (Business Analyst)", time: "Yesterday", icon: FileText, color: "text-blue-600 bg-blue-100" },
  { type: "hire", text: "Ahmed Ben Salah onboarded as DevOps Engineer", time: "2 days ago", icon: UserCheck, color: "text-emerald-600 bg-emerald-100" },
  { type: "payroll", text: "July 2026 payroll inputs submitted by Finance", time: "3 days ago", icon: Wallet, color: "text-violet-600 bg-violet-100" },
  { type: "alert", text: "Contract renewal due: Youssef Mabrouk (Aug 2026)", time: "4 days ago", icon: AlertTriangle, color: "text-red-600 bg-red-100" },
  { type: "hire", text: "Recruitment request approved — NorthBridge Tech", time: "5 days ago", icon: UserPlus, color: "text-blue-600 bg-blue-100" },
];

const QUICK_ACTIONS = [
  { label: "HR Management", desc: "Employees, contracts, leave & documents", href: "/workspace/hr", icon: Users, color: "bg-blue-600 hover:bg-blue-700" },
  { label: "Finance", desc: "Payroll, margins, invoices & reports", href: "/workspace/finance", icon: BarChart3, color: "bg-violet-600 hover:bg-violet-700" },
  { label: "Employee Portal", desc: "View employee self-service area", href: "/workspace/employees", icon: UserCheck, color: "bg-emerald-600 hover:bg-emerald-700" },
];

const PENDING_ITEMS = [
  { label: "Leave requests awaiting approval", count: 7, href: "/workspace/hr/leave-requests", urgency: "high" },
  { label: "Contracts up for renewal (Aug 2026)", count: 4, href: "/workspace/hr/contracts", urgency: "medium" },
  { label: "Payroll inputs to validate", count: 2, href: "/workspace/finance/payroll", urgency: "high" },
  { label: "New recruitment requests", count: 3, href: "/workspace/hr/requests", urgency: "low" },
];

const urgencyConfig = {
  high: { badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
  medium: { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  low: { badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
};

export default function ManagerOverview() {
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 text-white"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)" }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-8 right-32 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute bottom-4 -left-8 h-24 w-24 rounded-full bg-white/10" />

        <div className="relative flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-2">
              <Building2 className="h-4 w-4" />
              <span>TuniLink — Agency Manager Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold">
              Good {getGreeting()}, {managerName} 👋
            </h1>
            <p className="mt-1 text-blue-200 text-sm">{today}</p>
            <p className="mt-3 text-blue-100 max-w-md text-sm leading-relaxed">
              Here's a full overview of your agency's performance. You have{" "}
              <span className="font-semibold text-white">7 pending actions</span> requiring your attention.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <Link
              to="/workspace/hr"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/30 transition-all"
            >
              <Users className="h-4 w-4" />
              Manage HR
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${kpi.gradient} opacity-[0.04]`} />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{kpi.label}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{kpi.value}</p>
                    <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${kpi.trend === "up" ? "text-emerald-600" : kpi.trend === "down" ? "text-red-500" : "text-slate-500"}`}>
                      {kpi.trend === "up" && <TrendingUp className="h-3 w-3" />}
                      {kpi.trend === "down" && <TrendingDown className="h-3 w-3" />}
                      {kpi.sub}
                    </div>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.gradient} shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left: Pending Actions */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Pending Actions
                  </CardTitle>
                  <CardDescription>Items that require your immediate attention</CardDescription>
                </div>
                <Badge className="bg-red-100 text-red-700 font-semibold">7 total</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {PENDING_ITEMS.map((item) => {
                const cfg = urgencyConfig[item.urgency as keyof typeof urgencyConfig];
                return (
                  <Link key={item.label} to={item.href}>
                    <div className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 hover:border-blue-200 hover:bg-blue-50/40 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${cfg.badge} font-semibold text-xs`}>{item.count}</Badge>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* Department Health */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Department Health
              </CardTitle>
              <CardDescription>Overview of each department's current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEPARTMENT_HEALTH.map((dept) => (
                  <div key={dept.dept} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${dept.bg}`}>
                        <Users className={`h-4 w-4 ${dept.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{dept.dept}</p>
                        <p className="text-xs text-slate-400">{dept.employees} employees</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {dept.issues > 0 ? (
                        <span className="text-xs text-slate-500">{dept.issues} issue{dept.issues > 1 ? "s" : ""}</span>
                      ) : null}
                      <Badge className={`${dept.badge} capitalize text-xs font-semibold`}>
                        {dept.status === "healthy" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {dept.status === "attention" && <Clock className="h-3 w-3 mr-1" />}
                        {dept.status === "critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {dept.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Activity + Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} to={action.href}>
                    <div className={`group flex items-center justify-between rounded-xl p-4 text-white transition-all cursor-pointer ${action.color}`}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{action.label}</p>
                          <p className="text-[11px] opacity-80 mt-0.5">{action.desc}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Activity className="h-4 w-4 text-slate-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {RECENT_ACTIVITY.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-700 leading-snug">{item.text}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
