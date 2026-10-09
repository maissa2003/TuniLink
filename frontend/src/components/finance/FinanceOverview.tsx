import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Wallet, Receipt, TrendingUp, ArrowRight } from "lucide-react";

const DATA = [
  { month: "Sep '25", invoicedCAD: 34 },
  { month: "Oct '25", invoicedCAD: 35 },
  { month: "Nov '25", invoicedCAD: 37 },
  { month: "Dec '25", invoicedCAD: 36 },
  { month: "Jan '26", invoicedCAD: 38 },
  { month: "Feb '26", invoicedCAD: 40 },
  { month: "Mar '26", invoicedCAD: 41 },
  { month: "Apr '26", invoicedCAD: 43 },
  { month: "May '26", invoicedCAD: 45 },
  { month: "Jun '26", invoicedCAD: 48 },
  { month: "Jul '26", invoicedCAD: 50 },
  { month: "Aug '26", invoicedCAD: 56 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #ede9fe",
      borderRadius: 16,
      padding: "14px 20px",
      boxShadow: "0 8px 32px rgba(109,40,217,0.12)",
      minWidth: 160,
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: "#7c3aed", margin: 0 }}>
        {payload[0].value}k
        <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", marginLeft: 6 }}>CAD</span>
      </p>
    </div>
  );
}

export default function FinanceOverview() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#faf5ff 0%,#ffffff 60%)" }}>

      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#4c1d95 0%,#6d28d9 55%,#7c3aed 100%)",
          borderRadius: 24,
          padding: "40px 48px 36px",
          marginBottom: 40,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: -30, bottom: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: 0 }}>Finance Dashboard 💼</h1>
        <p style={{ color: "#ddd6fe", fontSize: 14, marginTop: 6, marginBottom: 0 }}>
          Monthly revenue invoiced to client — Sep 2025 → Aug 2026
        </p>
      </div>

      {/* Hero Chart */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          border: "1px solid #ede9fe",
          boxShadow: "0 4px 40px rgba(109,40,217,0.08)",
          padding: "40px 40px 32px",
          marginBottom: 36,
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Revenue Intelligence</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "6px 0 4px" }}>Invoiced to Client (k CAD)</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>12-month billing curve — steady growth from 34k to 56k CAD</p>
        </div>
        <div style={{ height: 480 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA} margin={{ top: 20, right: 40, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="financeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f3ff" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                domain={[28, 62]}
                tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(v) => `${v}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#7c3aed", strokeWidth: 1.5, strokeDasharray: "4 3" }} />
              <ReferenceLine x="Aug '26" stroke="#ede9fe" strokeWidth={2} strokeDasharray="5 4"
                label={{ value: "Today", position: "top", fontSize: 11, fill: "#9ca3af" }} />
              <Area
                type="monotone"
                dataKey="invoicedCAD"
                stroke="#6d28d9"
                strokeWidth={3.5}
                fill="url(#financeGrad)"
                dot={{ r: 5, fill: "#6d28d9", stroke: "#fff", strokeWidth: 2.5 }}
                activeDot={{ r: 8, fill: "#6d28d9", stroke: "#fff", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #f5f3ff", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-block", width: 32, height: 3, borderRadius: 99, background: "#6d28d9" }} />
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Monthly invoiced revenue in k CAD</span>
        </div>
      </div>

      {/* Quick Access */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          { label: "Payroll", desc: "Validate monthly payroll", href: "/workspace/finance/payroll", icon: Wallet, color: "#7c3aed" },
          { label: "Invoices", desc: "Track client billing", href: "/workspace/finance/invoices", icon: Receipt, color: "#059669" },
          { label: "Margins", desc: "Configure profit margins", href: "/workspace/finance/margins", icon: TrendingUp, color: "#2563eb" },
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
