import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";
import { Laptop, Building2, Wifi, Zap, Cloud, Wrench, MonitorCheck, Package } from "lucide-react";

/* ─── Fake Data ─── */

const employees = [
  {
    id: 1, name: "Ahmed Ben Ali", role: "Senior Full Stack Engineer", dept: "Engineering",
    costs: { laptop: 250, office: 400, internet: 50, electricity: 65, msLicense: 35, cloud: 180, itSupport: 30, other: 20 },
  },
  {
    id: 2, name: "Malek Guemri", role: "DevOps Engineer", dept: "Engineering",
    costs: { laptop: 280, office: 400, internet: 50, electricity: 65, msLicense: 35, cloud: 320, itSupport: 30, other: 0 },
  },
  {
    id: 3, name: "Sara Mansouri", role: "Product Manager", dept: "Product",
    costs: { laptop: 220, office: 350, internet: 50, electricity: 55, msLicense: 35, cloud: 80, itSupport: 20, other: 40 },
  },
  {
    id: 4, name: "Youssef Trabelsi", role: "UX Designer", dept: "Design",
    costs: { laptop: 300, office: 350, internet: 50, electricity: 55, msLicense: 35, cloud: 100, itSupport: 20, other: 50 },
  },
  {
    id: 5, name: "Amira Chedly", role: "Marketing Specialist", dept: "Marketing",
    costs: { laptop: 200, office: 350, internet: 50, electricity: 55, msLicense: 35, cloud: 60, itSupport: 20, other: 30 },
  },
  {
    id: 6, name: "Rami Letaief", role: "Backend Engineer", dept: "Engineering",
    costs: { laptop: 270, office: 400, internet: 50, electricity: 65, msLicense: 35, cloud: 260, itSupport: 30, other: 0 },
  },
];

const categoryMeta = [
  { key: "laptop", label: "Laptop", icon: Laptop, color: "#8b5cf6" },
  { key: "office", label: "Office Rent", icon: Building2, color: "#3b82f6" },
  { key: "internet", label: "Internet", icon: Wifi, color: "#f97316" },
  { key: "electricity", label: "Electricity", icon: Zap, color: "#10b981" },
  { key: "msLicense", label: "MS License", icon: MonitorCheck, color: "#f59e0b" },
  { key: "cloud", label: "Cloud Services", icon: Cloud, color: "#06b6d4" },
  { key: "itSupport", label: "IT Support", icon: Wrench, color: "#ec4899" },
  { key: "other", label: "Other", icon: Package, color: "#64748b" },
];

function calcTotal(costs: Record<string, number>) {
  return Object.values(costs).reduce((a, b) => a + b, 0);
}

/* ─── Recharts custom tooltip ─── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl text-xs max-w-[220px]">
        <p className="font-bold text-slate-800 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex justify-between gap-4">
            <span style={{ color: p.fill }}>{p.name}</span>
            <span className="font-semibold text-slate-700">{p.value} TND</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/* ─── Bar chart data ─── */
const barData = employees.map((emp) => ({
  name: emp.name.split(" ")[0], // first name only for readability
  ...emp.costs,
  total: calcTotal(emp.costs),
}));

/* ─── Pie – total per category ─── */
const pieData = categoryMeta.map((cat) => ({
  name: cat.label,
  value: employees.reduce((sum, e) => sum + (e.costs as any)[cat.key], 0),
  color: cat.color,
}));

/* ─── Main Component ─── */
export default function InfrastructureCosts() {
  const { t } = useLanguage();
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  const filteredEmployees = selectedEmployee
    ? employees.filter((e) => e.id === selectedEmployee)
    : employees;

  const grandTotal = employees.reduce((s, e) => s + calcTotal(e.costs), 0);

  return (
    <WorkspacePageShell title={t("infrastructure.costs.title")} description={t("infrastructure.costs.description")}>

      {/* ── Summary KPI Strip ── */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 animate-in fade-in duration-500">
        {[
          { label: "Total Monthly Cost", value: `${grandTotal.toLocaleString()} TND`, color: "bg-blue-50 border-blue-100 text-blue-700" },
          { label: "Employees Tracked", value: `${employees.length}`, color: "bg-violet-50 border-violet-100 text-violet-700" },
          { label: "Avg. Cost / Employee", value: `${Math.round(grandTotal / employees.length).toLocaleString()} TND`, color: "bg-cyan-50 border-cyan-100 text-cyan-700" },
          { label: "Top Category", value: "Office Rent", color: "bg-amber-50 border-amber-100 text-amber-700" },
        ].map((kpi) => (
          <div key={kpi.label} className={`rounded-xl border p-4 ${kpi.color}`}>
            <p className="text-xs font-medium uppercase tracking-wide opacity-70">{kpi.label}</p>
            <p className="mt-1 text-2xl font-bold">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3 animate-in fade-in duration-500 delay-100">

        {/* Stacked Bar – per employee */}
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">Cost Breakdown per Employee (TND/mo)</CardTitle>
            <CardDescription>All operational cost categories stacked by employee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  {categoryMeta.map((cat, i) => (
                    <Bar
                      key={cat.key}
                      dataKey={cat.key}
                      name={cat.label}
                      stackId="a"
                      fill={cat.color}
                      radius={i === categoryMeta.length - 1 ? [4, 4, 0, 0] : undefined}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie – category totals */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">Total by Category</CardTitle>
            <CardDescription>All employees combined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${Number(v).toLocaleString()} TND`, ""]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1.5">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{item.value.toLocaleString()} TND</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Employee Costs Table ── */}
      <div className="mt-8 animate-in fade-in duration-500 delay-200">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-slate-800">Employee Infrastructure Costs</CardTitle>
              <CardDescription>Monthly operational costs per employee</CardDescription>
            </div>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSelectedEmployee(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All employees</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">Employee</TableHead>
                  {categoryMeta.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <TableHead key={cat.key} className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Icon className="h-3.5 w-3.5" style={{ color: cat.color }} />
                          <span className="text-[10px]">{cat.label}</span>
                        </div>
                      </TableHead>
                    );
                  })}
                  <TableHead className="text-right font-semibold text-slate-700">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((emp) => {
                  const total = calcTotal(emp.costs);
                  return (
                    <TableRow key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.dept}</p>
                        </div>
                      </TableCell>
                      {categoryMeta.map((cat) => (
                        <TableCell key={cat.key} className="text-center text-sm text-slate-600">
                          {(emp.costs as any)[cat.key] > 0 ? `${(emp.costs as any)[cat.key]}` : <span className="text-slate-300">—</span>}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-bold">
                          {total.toLocaleString()} TND
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 border border-slate-200">
              <span className="text-sm font-semibold text-slate-700">Grand Total (all employees)</span>
              <span className="text-xl font-bold text-blue-700">{grandTotal.toLocaleString()} TND / month</span>
            </div>
          </CardContent>
        </Card>
      </div>

    </WorkspacePageShell>
  );
}
