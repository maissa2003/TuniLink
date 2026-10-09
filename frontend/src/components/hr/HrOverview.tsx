import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Users, FileText, Wallet, ArrowRight } from "lucide-react";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useHrBasePath } from "@/lib/hrPaths";

const DATA = [
  { month: "Sep '25", employees: 78 },
  { month: "Oct '25", employees: 80 },
  { month: "Nov '25", employees: 82 },
  { month: "Dec '25", employees: 82 },
  { month: "Jan '26", employees: 84 },
  { month: "Feb '26", employees: 85 },
  { month: "Mar '26", employees: 86 },
  { month: "Apr '26", employees: 87 },
  { month: "May '26", employees: 88 },
  { month: "Jun '26", employees: 89 },
  { month: "Jul '26", employees: 90 },
  { month: "Aug '26", employees: 90 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #dbeafe",
      borderRadius: 16,
      padding: "14px 20px",
      boxShadow: "0 8px 32px rgba(37,99,235,0.12)",
      minWidth: 160,
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: "#2563eb", margin: 0 }}>
        {payload[0].value}
        <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", marginLeft: 6 }}>employees</span>
      </p>
    </div>
  );
}

export default function HrOverview() {
  const hrBase = useHrBasePath();

  return (
    <WorkspacePageShell title="HR Overview" description="Headcount growth across 12 months.">

      {/* Hero Chart */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          border: "1px solid #dbeafe",
          boxShadow: "0 4px 40px rgba(37,99,235,0.08)",
          padding: "40px 40px 32px",
          marginBottom: 36,
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>HR Intelligence</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "6px 0 4px" }}>Total Employees</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>12-month headcount growth — Sep 2025 → Aug 2026</p>
        </div>
        <div style={{ height: 480 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA} margin={{ top: 20, right: 40, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eff6ff" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                domain={[72, 96]}
                tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2563eb", strokeWidth: 1.5, strokeDasharray: "4 3" }} />
              <ReferenceLine x="Aug '26" stroke="#dbeafe" strokeWidth={2} strokeDasharray="5 4"
                label={{ value: "Today", position: "top", fontSize: 11, fill: "#9ca3af" }} />
              <Area
                type="monotone"
                dataKey="employees"
                stroke="#1d4ed8"
                strokeWidth={3.5}
                fill="url(#hrGrad)"
                dot={{ r: 5, fill: "#1d4ed8", stroke: "#fff", strokeWidth: 2.5 }}
                activeDot={{ r: 8, fill: "#1d4ed8", stroke: "#fff", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #eff6ff", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-block", width: 32, height: 3, borderRadius: 99, background: "#1d4ed8" }} />
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Total active employees per month</span>
        </div>
      </div>

      {/* Quick Access */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          { label: "Employees", desc: "Manage employee records", href: `${hrBase}/employees`, icon: Users, color: "#2563eb" },
          { label: "Contracts", desc: "Review and create contracts", href: `${hrBase}/contracts`, icon: FileText, color: "#7c3aed" },
          { label: "Payroll Inputs", desc: "Submit monthly payroll data", href: `${hrBase}/payroll-inputs`, icon: Wallet, color: "#059669" },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.href} to={a.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: a.color,
                  borderRadius: 16,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "transform 0.18s, box-shadow 0.18s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color="#fff" />
                  </div>
                  <div>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0 }}>{a.label}</p>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, margin: "2px 0 0" }}>{a.desc}</p>
                  </div>
                </div>
                <ArrowRight size={16} color="rgba(255,255,255,0.7)" />
              </div>
            </Link>
          );
        })}
      </div>
    </WorkspacePageShell>
  );
}
