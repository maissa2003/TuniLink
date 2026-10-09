import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  Users, BarChart3,
  ArrowRight, Building2, UserCheck,
} from "lucide-react";

const managerName = localStorage.getItem("username") ?? "Manager";

const MRR_DATA = [
  { month: "Sep '25", mrr: 112 },
  { month: "Oct '25", mrr: 116 },
  { month: "Nov '25", mrr: 120 },
  { month: "Dec '25", mrr: 118 },
  { month: "Jan '26", mrr: 126 },
  { month: "Feb '26", mrr: 130 },
  { month: "Mar '26", mrr: 134 },
  { month: "Apr '26", mrr: 140 },
  { month: "May '26", mrr: 148 },
  { month: "Jun '26", mrr: 156 },
  { month: "Jul '26", mrr: 164 },
  { month: "Aug '26", mrr: 184 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #dbeafe",
      borderRadius: 16,
      padding: "14px 20px",
      boxShadow: "0 8px 32px rgba(30,58,138,0.12)",
      minWidth: 160,
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: "#1d4ed8", margin: 0 }}>
        {payload[0].value}k
        <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", marginLeft: 6 }}>TND</span>
      </p>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

export default function ManagerOverview() {
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#eff6ff 0%,#ffffff 60%)" }}>

      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 55%,#2563eb 100%)",
          borderRadius: 24,
          padding: "40px 48px 36px",
          marginBottom: 40,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 130, bottom: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#93c5fd", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
          <Building2 size={15} />
          <span>TuniLink — Agency Manager Dashboard</span>
        </div>
        <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: 0 }}>
          Good {getGreeting()}, {managerName} 👋
        </h1>
        <p style={{ color: "#93c5fd", fontSize: 13, marginTop: 4, marginBottom: 0 }}>{today}</p>
        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <Link to="/workspace/hr"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
              borderRadius: 12, padding: "10px 20px", color: "#fff",
              fontWeight: 600, fontSize: 13, textDecoration: "none",
              transition: "background 0.18s",
            }}
          >
            <Users size={15} /> Manage HR
          </Link>
        </div>
      </div>

      {/* Hero Chart */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          border: "1px solid #dbeafe",
          boxShadow: "0 4px 40px rgba(30,58,138,0.08)",
          padding: "40px 40px 32px",
          marginBottom: 36,
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Agency Performance</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "6px 0 4px" }}>Monthly Payroll (k TND)</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>12-month payroll growth — from 112k to 184k TND, reflecting team expansion</p>
        </div>
        <div style={{ height: 480 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MRR_DATA} margin={{ top: 20, right: 40, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="managerGrad" x1="0" y1="0" x2="0" y2="1">
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
                domain={[100, 200]}
                tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={52}
                tickFormatter={(v) => `${v}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2563eb", strokeWidth: 1.5, strokeDasharray: "4 3" }} />
              <ReferenceLine x="Aug '26" stroke="#dbeafe" strokeWidth={2} strokeDasharray="5 4"
                label={{ value: "Today", position: "top", fontSize: 11, fill: "#9ca3af" }} />
              <Area
                type="monotone"
                dataKey="mrr"
                stroke="#1d4ed8"
                strokeWidth={3.5}
                fill="url(#managerGrad)"
                dot={{ r: 5, fill: "#1d4ed8", stroke: "#fff", strokeWidth: 2.5 }}
                activeDot={{ r: 8, fill: "#1d4ed8", stroke: "#fff", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #eff6ff", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-block", width: 32, height: 3, borderRadius: 99, background: "#1d4ed8" }} />
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Total monthly payroll in k TND</span>
        </div>
      </div>

      {/* Quick Access */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          { label: "HR Management", desc: "Employees, contracts, leave & documents", href: "/workspace/hr", icon: Users, color: "#2563eb" },
          { label: "Finance", desc: "Payroll, margins, invoices & reports", href: "/workspace/finance", icon: BarChart3, color: "#7c3aed" },
          { label: "Employee Portal", desc: "View employee self-service area", href: "/workspace/employees", icon: UserCheck, color: "#059669" },
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
    </div>
  );
}
