import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Laptop, Building2, ArrowRight } from "lucide-react";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useEmployees } from "@/hooks/useEmployee";

const MONTHLY = [
  { month: "Sep '25", totalTND: 52 },
  { month: "Oct '25", totalTND: 53 },
  { month: "Nov '25", totalTND: 56 },
  { month: "Dec '25", totalTND: 58 },
  { month: "Jan '26", totalTND: 60 },
  { month: "Feb '26", totalTND: 62 },
  { month: "Mar '26", totalTND: 64 },
  { month: "Apr '26", totalTND: 67 },
  { month: "May '26", totalTND: 70 },
  { month: "Jun '26", totalTND: 72 },
  { month: "Jul '26", totalTND: 76 },
  { month: "Aug '26", totalTND: 82 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #fef3c7",
      borderRadius: 16,
      padding: "14px 20px",
      boxShadow: "0 8px 32px rgba(245,158,11,0.12)",
      minWidth: 160,
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: "#d97706", margin: 0 }}>
        {payload[0].value}k
        <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", marginLeft: 6 }}>TND</span>
      </p>
    </div>
  );
}

export default function InfrastructureOverview() {
  const { data: employees = [] } = useEmployees();
  const realTotal = employees.reduce((s, e) => s + Number(e.infraCostTotal || 0), 0);
  const displayData = realTotal > 0
    ? [...MONTHLY.slice(0, -1), { month: "Aug '26", totalTND: Math.round(realTotal / 1000) }]
    : MONTHLY;

  return (
    <WorkspacePageShell title="Infrastructure Overview" description="Monthly infrastructure spend over 12 months.">

      {/* Hero Chart */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          border: "1px solid #fef3c7",
          boxShadow: "0 4px 40px rgba(245,158,11,0.08)",
          padding: "40px 40px 32px",
          marginBottom: 36,
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Infra Intelligence</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "6px 0 4px" }}>Total Infrastructure Cost (k TND)</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>12-month spend curve — growing from 52k to 82k TND</p>
        </div>
        <div style={{ height: 480 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 20, right: 40, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="infraGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#fffbeb" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                domain={[44, 92]}
                tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(v) => `${v}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#f59e0b", strokeWidth: 1.5, strokeDasharray: "4 3" }} />
              <ReferenceLine x="Aug '26" stroke="#fef3c7" strokeWidth={2} strokeDasharray="5 4"
                label={{ value: "Today", position: "top", fontSize: 11, fill: "#9ca3af" }} />
              <Area
                type="monotone"
                dataKey="totalTND"
                stroke="#d97706"
                strokeWidth={3.5}
                fill="url(#infraGrad)"
                dot={{ r: 5, fill: "#d97706", stroke: "#fff", strokeWidth: 2.5 }}
                activeDot={{ r: 8, fill: "#d97706", stroke: "#fff", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #fffbeb", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-block", width: 32, height: 3, borderRadius: 99, background: "#d97706" }} />
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Total monthly infrastructure spend in k TND</span>
        </div>
      </div>

      {/* Quick Access */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
        {[
          { label: "Assign Resources", desc: "Allocate laptops, licenses, and equipment", href: "/workspace/infrastructure/resources", icon: Laptop, color: "#2563eb" },
          { label: "Cost Reports", desc: "Analyse infrastructure spend by category", href: "/workspace/infrastructure/reports", icon: Building2, color: "#7c3aed" },
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
