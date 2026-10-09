import { Link } from "react-router-dom";
import {
  ComposedChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  Building2, Users, CreditCard, ShieldCheck, ArrowRight, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/useLanguage";
import { getDashboardGreeting } from "@/lib/greeting";

const DATA = [
  { month: "Sep '25", mrr: 15, users: 180, companies: 12 },
  { month: "Oct '25", mrr: 22, users: 205, companies: 14 },
  { month: "Nov '25", mrr: 28, users: 240, companies: 16 },
  { month: "Dec '25", mrr: 24, users: 235, companies: 16 },
  { month: "Jan '26", mrr: 32, users: 270, companies: 19 },
  { month: "Feb '26", mrr: 36, users: 285, companies: 20 },
  { month: "Mar '26", mrr: 40, users: 295, companies: 21 },
  { month: "Apr '26", mrr: 42, users: 310, companies: 22 },
  { month: "May '26", mrr: 45, users: 325, companies: 22 },
  { month: "Jun '26", mrr: 48, users: 330, companies: 23 },
  { month: "Jul '26", mrr: 52, users: 338, companies: 24 },
  { month: "Aug '26", mrr: 56, users: 350, companies: 26 },
];

const CURR = DATA[DATA.length - 1];

const STATS = [
  { label: "Platform MRR", value: `${CURR.mrr}k USD`, sub: "Monthly Recurring Revenue", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Active Users", value: CURR.users, sub: "Across all tenants", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Active Companies", value: CURR.companies, sub: "Registered clients & agencies", icon: Building2, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "System Status", value: "Healthy", sub: "All services operational", icon: ShieldCheck, color: "text-violet-600", bg: "bg-violet-50" },
];

const QUICK_ACTIONS = [
  { label: "Manage Users", desc: "View all accounts and roles", href: "/admin/users", icon: Users, color: "bg-blue-600 hover:bg-blue-700" },
  { label: "Manage Companies", desc: "View registered tenants", href: "/admin/companies", icon: Building2, color: "bg-emerald-600 hover:bg-emerald-700" },
  { label: "System Settings", desc: "Platform configuration", href: "/admin/settings", icon: Activity, color: "bg-violet-600 hover:bg-violet-700" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xl p-4 min-w-[200px]">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-6 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
            <span className="text-xs text-slate-600">{p.name}</span>
          </div>
          <span className="text-xs font-bold text-slate-900">{p.value}{p.name.includes("MRR") ? "k" : ""}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 text-white"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)" }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <h1 className="text-3xl font-bold relative">{getDashboardGreeting(language)} ⚙️</h1>
        <p className="mt-1 text-slate-300 text-sm relative">
          Platform-wide administrative overview — user growth, tenant adoption, and MRR.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                <Icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{s.label}</p>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-[11px] text-slate-400">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Chart */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-slate-700" />
                12-Month Platform Growth Overview
              </CardTitle>
              <CardDescription className="mt-1 max-w-xl">
                Monthly Recurring Revenue (area, k USD), total active users across all tenants (solid line), and onboarded companies (dashed line).
              </CardDescription>
            </div>
            <Badge className="bg-slate-100 text-slate-700 font-semibold text-xs">Super Admin</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[420px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                
                {/* Left Y - Users & Companies */}
                <YAxis yAxisId="users" orientation="left" domain={[0, 400]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={36}
                  label={{ value: "Users / Orgs", angle: -90, position: "insideLeft", offset: 14, style: { fontSize: 10, fill: "#94a3b8" } }} />
                
                {/* Right Y - MRR */}
                <YAxis yAxisId="mrr" orientation="right" domain={[0, 70]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={36}
                  label={{ value: "k USD", angle: 90, position: "insideRight", offset: 14, style: { fontSize: 10, fill: "#94a3b8" } }} />
                
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} formatter={(v) => <span style={{ color: "#475569", fontWeight: 500 }}>{v}</span>} />
                
                <ReferenceLine yAxisId="mrr" x="Aug '26" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="4 3"
                  label={{ value: "Today", position: "top", fontSize: 10, fill: "#94a3b8" }} />
                
                <Area yAxisId="mrr" type="monotone" dataKey="mrr" name="Platform MRR (k USD)" stroke="#3b82f6" strokeWidth={2.5}
                  fill="url(#mrrGrad)" dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span><span className="font-semibold text-blue-600">━━</span> Platform MRR (k USD, area)</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <div className="grid gap-4 sm:grid-cols-3">
        {QUICK_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.href} to={a.href}>
              <div className={`group flex items-center justify-between rounded-xl p-4 text-white transition-all ${a.color}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20"><Icon className="h-4 w-4 text-white" /></div>
                  <div>
                    <p className="text-sm font-semibold">{a.label}</p>
                    <p className="text-[11px] opacity-80">{a.desc}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
