import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";

/* ─── Data ─── */

const monthlyTrend = [
  { month: "Jan", total: 15200, budget: 17000 },
  { month: "Feb", total: 15800, budget: 17000 },
  { month: "Mar", total: 16200, budget: 17000 },
  { month: "Apr", total: 15600, budget: 17000 },
  { month: "May", total: 17100, budget: 17000 },
  { month: "Jun", total: 17800, budget: 17000 },
  { month: "Jul", total: 18200, budget: 17000 },
];

const categoryYoY = [
  { name: "Laptop", lastYear: 2400, thisYear: 3950 },
  { name: "Office Rent", lastYear: 7200, thisYear: 7200 },
  { name: "Cloud", lastYear: 1800, thisYear: 3250 },
  { name: "MS License", lastYear: 490, thisYear: 650 },
  { name: "Internet", lastYear: 380, thisYear: 410 },
  { name: "Electricity", lastYear: 510, thisYear: 590 },
  { name: "IT Support", lastYear: 150, thisYear: 150 },
];

const departmentData = [
  { dept: "Engineering", cost: 10920, color: "#3b82f6" },
  { dept: "Product", cost: 800, color: "#8b5cf6" },
  { dept: "Design", cost: 960, color: "#06b6d4" },
  { dept: "Marketing", cost: 800, color: "#f59e0b" },
];

const quarterlyROI = [
  { quarter: "Q1 2025", cost: 47800, productivity: 87 },
  { quarter: "Q2 2025", cost: 49200, productivity: 89 },
  { quarter: "Q3 2025", cost: 51400, productivity: 91 },
  { quarter: "Q4 2025", cost: 50100, productivity: 90 },
  { quarter: "Q1 2026", cost: 52600, productivity: 92 },
  { quarter: "Q2 2026", cost: 54000, productivity: 94 },
];

const alerts = [
  { type: "warning", msg: "Cloud services cost exceeded budget by 14% in July 2026." },
  { type: "info", msg: "Microsoft 365 licenses renewed — next renewal: July 2027." },
  { type: "success", msg: "Asset utilization improved from 82% to 87% over 6 months." },
  { type: "warning", msg: "2 laptops approaching end-of-life (EOL) in Q3 2026." },
];

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl text-xs">
        <p className="font-bold text-slate-800 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex justify-between gap-4 my-0.5">
            <span style={{ color: p.stroke || p.fill }}>{p.name}</span>
            <span className="font-semibold text-slate-700">
              {typeof p.value === "number" && p.value > 1000 ? `${p.value.toLocaleString()} TND` : `${p.value}%`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function InfrastructureReports() {
  const { t } = useLanguage();

  const currentTotal = monthlyTrend[monthlyTrend.length - 1].total;
  const prevTotal = monthlyTrend[monthlyTrend.length - 2].total;
  const momChange = (((currentTotal - prevTotal) / prevTotal) * 100).toFixed(1);

  return (
    <WorkspacePageShell title={t("infrastructure.reports.title")} description={t("infrastructure.reports.description")}>

      {/* ── KPI Strip ── */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 animate-in fade-in duration-500">
        {[
          {
            label: "July 2026 Cost", value: "18,200 TND",
            sub: `+${momChange}% vs June`, up: true,
          },
          {
            label: "Budget Variance", value: "+1,200 TND",
            sub: "7.1% over budget", up: true,
          },
          {
            label: "YoY Cloud Growth", value: "+80.5%",
            sub: "1,800 → 3,250 TND", up: true,
          },
          {
            label: "Asset Utilization", value: "87%",
            sub: "+5pts vs Jan 2026", up: false,
          },
        ].map((kpi, i) => (
          <div
            key={kpi.label}
            className={`rounded-xl border p-4 ${
              i === 0 ? "bg-blue-50 border-blue-100" :
              i === 1 ? "bg-red-50 border-red-100" :
              i === 2 ? "bg-violet-50 border-violet-100" :
              "bg-emerald-50 border-emerald-100"
            }`}
          >
            <p className={`text-xs font-semibold uppercase tracking-widest ${
              i === 0 ? "text-blue-500" : i === 1 ? "text-red-500" : i === 2 ? "text-violet-500" : "text-emerald-500"
            }`}>{kpi.label}</p>
            <p className={`mt-1 text-2xl font-bold ${
              i === 0 ? "text-blue-700" : i === 1 ? "text-red-700" : i === 2 ? "text-violet-700" : "text-emerald-700"
            }`}>{kpi.value}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              {kpi.up ? <TrendingUp className="h-3 w-3 text-red-400" /> : <TrendingDown className="h-3 w-3 text-emerald-400" />}
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 2: Monthly vs Budget (Area) + YoY Comparison (Bar) ── */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2 animate-in fade-in duration-500 delay-100">

        {/* Area – Actual vs Budget */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">Actual Cost vs Budget (TND)</CardTitle>
            <CardDescription>Monthly trend vs allocated budget line</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={32} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="total" name="Actual" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorActual)" dot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="budget" name="Budget" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" fill="url(#colorBudget)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Grouped Bar – YoY by category */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">Year-over-Year by Category (TND)</CardTitle>
            <CardDescription>2025 vs 2026 monthly average per category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryYoY} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `${v}`} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#1e293b" }} width={80} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} formatter={(v: any) => [`${Number(v).toLocaleString()} TND`, ""]} />
                  <Legend verticalAlign="top" height={32} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="lastYear" name="2025" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={10} />
                  <Bar dataKey="thisYear" name="2026" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: By Department (Pie) + Quarterly ROI (Line) ── */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3 animate-in fade-in duration-500 delay-200">

        {/* Pie – by department */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">Cost by Department</CardTitle>
            <CardDescription>Monthly infra cost distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={departmentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="cost">
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${Number(v).toLocaleString()} TND`, ""]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {departmentData.map((d) => (
                <div key={d.dept} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600">{d.dept}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{d.cost.toLocaleString()} TND</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Line – Quarterly Cost vs Productivity */}
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">Quarterly Cost vs Productivity Index</CardTitle>
            <CardDescription>Correlating infrastructure spend with team efficiency score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quarterlyROI} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} dy={8} />
                  <YAxis yAxisId="cost" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis yAxisId="prod" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[80, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                  <Legend verticalAlign="top" height={32} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  <Line yAxisId="cost" type="monotone" dataKey="cost" name="Total Cost (TND)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="prod" type="monotone" dataKey="productivity" name="Productivity Index (%)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Alerts & Insights ── */}
      <div className="mt-8 animate-in fade-in duration-500 delay-300">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">Insights & Alerts</CardTitle>
            <CardDescription>Automated observations from infrastructure data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-xl p-4 border text-sm ${
                    alert.type === "warning"
                      ? "bg-amber-50 border-amber-100 text-amber-800"
                      : alert.type === "success"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                      : "bg-blue-50 border-blue-100 text-blue-800"
                  }`}
                >
                  {alert.type === "warning" ? (
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                  ) : alert.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  )}
                  {alert.msg}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </WorkspacePageShell>
  );
}
