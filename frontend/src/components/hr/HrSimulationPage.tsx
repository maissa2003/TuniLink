import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Calculator, TrendingUp, ChevronDown, ChevronUp,
  ArrowLeft, Send, RefreshCw, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { runSimulation, SimulationResult, SimulationInput } from "@/api/simulations";
import { saveSimulationForRequest } from "@/api/requests";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

/* ── Formatters ─────────────────────────────────────────────────────────── */
const fmt = (n: number) => n.toLocaleString("fr-TN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtCad = (n: number) => `CA$${n.toLocaleString("en-CA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

/* ── Calculation steps shown in the detail panel ───────────────────────── */
type StepDefinition = {
  id: string;
  label: string;
  key: string;
  unit: string;
  note: string;
  color: string;
  bold?: boolean;
  final?: boolean;
};

const STEPS: StepDefinition[] = [
  { id: "①", label: "Net Salary",               key: "netSalaryTnd",               unit: "TND", note: "Candidate's take-home pay",            color: "text-slate-700" },
  { id: "②", label: "Gross Salary",             key: "grossSalaryTnd",             unit: "TND", note: "After employee CNSS (9.18%) & IRPP",   color: "text-slate-700" },
  { id: "③", label: "Employer CNSS",            key: "employerChargesTnd",          unit: "TND", note: "Employer social charges (16.57%)",      color: "text-orange-600" },
  { id: "④", label: "Total Payroll Cost",       key: "totalPayrollCostTnd",         unit: "TND", note: "② + ③",                              color: "text-blue-700",  bold: true },
  { id: "⑤", label: "Infrastructure Costs",    key: "infrastructureCostTnd",       unit: "TND", note: "Office, PC, internet, support",        color: "text-slate-700" },
  { id: "⑥", label: "Sub-total before margins",key: "subTotalBeforeMarginTnd",     unit: "TND", note: "④ + ⑤",                              color: "text-blue-700",  bold: true },
  { id: "⑦", label: "Recruitment Margin",      key: "recruitmentMarginAmountTnd",  unit: "TND", note: "Agency profit margin applied",          color: "text-indigo-600" },
  { id: "⑧", label: "Infrastructure Margin",   key: "infrastructureMarginAmountTnd",unit:"TND", note: "Infra company profit margin",           color: "text-indigo-600" },
  { id: "⑨", label: "Total Cost (TND)",        key: "totalCostTnd",                unit: "TND", note: "⑥ + ⑦ + ⑧",                         color: "text-blue-800",  bold: true },
  { id: "⑩", label: "Exchange Rate",           key: "exchangeRateUsed",            unit: "",    note: "1 TND = x CAD",                        color: "text-amber-700" },
  { id: "⑪", label: "Monthly Invoice",         key: "finalInvoicedCad",            unit: "CAD", note: "Billed to the Canadian client",         color: "text-emerald-700", bold: true, final: true },
];

/* ── Default inputs ─────────────────────────────────────────────────────── */
const DEFAULTS: SimulationInput = {
  scenarioName: "Base Scenario",
  baseNetSalaryTnd: 3000,
  durationYears: 3,
  annualIncreasePercent: 5,
  recruitmentMarginPercent: 10,
  infrastructureMarginPercent: 10,
  fixedInfrastructureCostTnd: 500,
  exchangeRateTndToCad: 0.45,
};

/* ── Helper: range slider-style input ───────────────────────────────────── */
function ParamInput({ label, note, value, onChange, step = 1, min, max, unit }:
  { label: string; note?: string; value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; unit?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-slate-600">{label}</Label>
        {note && <span className="text-xs text-slate-400">{note}</span>}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number" step={step} min={min} max={max}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="h-8 text-sm font-semibold tabular-nums"
        />
        {unit && <span className="text-xs text-slate-500 w-8">{unit}</span>}
      </div>
    </div>
  );
}

/* ── KPI card ───────────────────────────────────────────────────────────── */
function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className={`rounded-xl p-4 ${accent ?? "bg-slate-50"} border border-slate-100`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function HrSimulationPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role") ?? "HR";
  const backHref = role === "MANAGER" ? "/workspace/hr/requests" : "/workspace/requests";

  /* Context from request pipeline */
  const requestId = params.get("requestId") ? Number(params.get("requestId")) : undefined;
  const requestTitle = params.get("title") ?? "";
  const clientName = params.get("client") ?? "";

  const [inputs, setInputs] = useState<SimulationInput>({
    ...DEFAULTS,
    scenarioName: requestTitle ? `Scenario for ${requestTitle}` : DEFAULTS.scenarioName,
    resourceRequestId: requestId,
  });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(1);
  const [candidateName, setCandidateName] = useState("");
  const [candidateBio, setCandidateBio] = useState("");

  const set = <K extends keyof SimulationInput>(k: K, v: SimulationInput[K]) =>
    setInputs(prev => ({ ...prev, [k]: v }));

  const handleCalculate = async () => {
    setLoading(true); setError(null);
    try {
      const res = await runSimulation(inputs);
      setResult(res); setExpandedYear(1); setSent(false);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Calculation failed. Check inputs.");
    } finally { setLoading(false); }
  };

  const handleSendToClient = async () => {
    if (!requestId || !result) return;
    setSending(true);
    const payload: SimulationResult = {
      ...result,
      candidateName,
      candidateBio
    };
    try {
      await saveSimulationForRequest(requestId, payload);
      setSent(true);
    } catch { /* ignore */ }
    finally { setSending(false); }
  };

  /* Auto-calculate on first load if coming from a request */
  useEffect(() => {
    if (requestId) handleCalculate();
  }, []);

  const years = result?.years ?? [];

  return (
    <WorkspacePageShell
      title="Financial Simulation"
      description={requestTitle ? `Simulating cost for: ${requestTitle} — ${clientName}` : "Compute the full cost chain: net salary → CAD invoice."}
    >
      {/* ── Back button + request context ── */}
      {requestId && (
        <div className="mb-5 flex items-center justify-between">
          <button onClick={() => navigate(backHref)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Pipeline
          </button>
          <div className="flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs font-medium text-blue-700">
              {requestTitle} &nbsp;·&nbsp; {clientName}
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">

        {/* ═══════════════════════════════════════════
            LEFT: Parameter Panel
        ═══════════════════════════════════════════ */}
        <div className="space-y-4">

          {/* Scenario name */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-5 pb-4 space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-500 uppercase tracking-wide">Scenario Name</Label>
                <Input
                  value={inputs.scenarioName as string}
                  onChange={e => set("scenarioName", e.target.value)}
                  className="font-medium"
                  placeholder="e.g. Optimistic – 5% raise/yr"
                />
              </div>
            </CardContent>
          </Card>

          {/* Candidate Profile */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-slate-500">Candidate Profile</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Candidate Name</Label>
                <Input value={candidateName} onChange={e => setCandidateName(e.target.value)} placeholder="e.g. Ahmed Ben Ali" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Experience Summary</Label>
                <Input value={candidateBio} onChange={e => setCandidateBio(e.target.value)} placeholder="e.g. 5+ years React, bilingual" />
              </div>
            </CardContent>
          </Card>

          {/* Salary */}
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-blue-700">Candidate Salary</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <ParamInput label="Net Salary" note="(TND / month)" value={inputs.baseNetSalaryTnd} min={0} step={100}
                onChange={v => set("baseNetSalaryTnd", v)} />
              <p className="mt-2 text-xs text-blue-600">
                ≈ <strong>CA${((inputs.baseNetSalaryTnd || 0) * (inputs.exchangeRateTndToCad || 0.45)).toFixed(0)}</strong> / month net to employee
              </p>
            </CardContent>
          </Card>

          {/* Projection */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-slate-500">Projection</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              <ParamInput label="Duration" note="years" value={inputs.durationYears} min={1} max={20} step={1}
                onChange={v => set("durationYears", v)} />
              <ParamInput label="Annual Salary Raise" unit="%" value={inputs.annualIncreasePercent} min={0} max={30} step={0.5}
                onChange={v => set("annualIncreasePercent", v)} />
            </CardContent>
          </Card>

          {/* Margins */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-slate-500">Margins & Costs</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              <ParamInput label="Recruitment Agency Margin" unit="%" value={inputs.recruitmentMarginPercent!} min={0} step={0.5}
                onChange={v => set("recruitmentMarginPercent", v)} />
              <ParamInput label="Infrastructure Margin" unit="%" value={inputs.infrastructureMarginPercent!} min={0} step={0.5}
                onChange={v => set("infrastructureMarginPercent", v)} />
              <ParamInput label="Fixed Infra Cost" note="(TND/month)" value={inputs.fixedInfrastructureCostTnd!} min={0} step={50}
                onChange={v => set("fixedInfrastructureCostTnd", v)} />
            </CardContent>
          </Card>

          {/* Exchange rate */}
          <Card className="border-amber-100 bg-amber-50 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-amber-700">Exchange Rate</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <ParamInput label="TND → CAD" value={inputs.exchangeRateTndToCad!} step={0.001} min={0.001}
                onChange={v => set("exchangeRateTndToCad", v)} />
              <p className="mt-2 text-xs text-amber-700">1 TND = {inputs.exchangeRateTndToCad} CAD</p>
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <Button onClick={handleCalculate} disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md h-11 text-sm font-semibold">
            {loading ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Calculating...</>
                     : <><Calculator className="mr-2 h-4 w-4" /> Run Simulation</>}
          </Button>
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT: Results Panel
        ═══════════════════════════════════════════ */}
        <div className="space-y-5">
          {!result ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-24 text-center">
              <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
                <Calculator className="h-8 w-8 text-slate-300" />
              </div>
              <p className="font-medium text-slate-500">Configure parameters and click</p>
              <p className="text-sm text-slate-400 mt-1"><strong className="text-blue-600">Run Simulation</strong> to see the full cost projection.</p>
            </div>
          ) : (
            <>
              {/* KPI Summary */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Kpi label="Avg monthly (CAD)" value={fmtCad(result.averageMonthlyCostCad)}
                  sub="over full period" accent="bg-emerald-50 border-emerald-100" />
                <Kpi label={`Total (${result.durationYears} yr, CAD)`} value={fmtCad(result.totalCostOverPeriodCad)}
                  sub="cumulative billing" accent="bg-blue-50 border-blue-100" />
                <Kpi label="Year 1 monthly" value={fmtCad(years[0].finalInvoicedCad)}
                  sub={`${fmt(years[0].netSalaryTnd)} TND net`} />
                <Kpi label={`Year ${result.durationYears} monthly`} value={fmtCad(years[years.length-1].finalInvoicedCad)}
                  sub={`+${result.annualIncreasePercent}%/yr applied`} />
              </div>

              {/* Projections Charts */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Monthly Invoice Trend */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" /> Invoice Projection (CAD)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={years} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="year" tickFormatter={(val) => `Y${val}`} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val/1000}k`} />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                            labelFormatter={(val) => `Year ${val}`}
                            formatter={(val: any) => [fmtCad(Number(val)), 'Monthly Invoice']}
                          />
                          <Area type="monotone" dataKey="finalInvoicedCad" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInvoiced)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Salary & Cost Evolution */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-emerald-500" /> Cost Evolution (TND)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={years} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="year" tickFormatter={(val) => `Y${val}`} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `${val/1000}k`} />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                            labelFormatter={(val) => `Year ${val}`}
                            formatter={(val: any, name: any) => [
                              `${fmt(Number(val))} TND`, 
                              name === 'netSalaryTnd' ? 'Net Salary' : 'Total Cost'
                            ]}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Line type="monotone" name="Total Cost" dataKey="totalCostTnd" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" name="Net Salary" dataKey="netSalaryTnd" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Year breakdown accordion */}
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-2 border-b border-slate-100">
                  <CardTitle className="text-sm font-semibold text-slate-700">Year-by-Year Cost Breakdown</CardTitle>
                  <p className="text-xs text-slate-400">Click a year to see the full 11-step calculation chain.</p>
                </CardHeader>
                <div className="divide-y divide-slate-100">
                  {years.map(yr => (
                    <div key={yr.year}>
                      {/* Summary row */}
                      <button
                        onClick={() => setExpandedYear(expandedYear === yr.year ? null : yr.year)}
                        className="flex w-full items-center px-5 py-3.5 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                            Y{yr.year}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {fmtCad(yr.finalInvoicedCad)}<span className="font-normal text-slate-400"> / month</span>
                            </p>
                            <p className="text-xs text-slate-400">
                              Net: <span className="font-medium text-slate-600">{fmt(yr.netSalaryTnd)} TND</span>
                              &nbsp;·&nbsp; Total payroll: <span className="font-medium text-slate-600">{fmt(yr.totalPayrollCostTnd)} TND</span>
                              &nbsp;·&nbsp; Rate: <span className="font-medium text-slate-600">{yr.exchangeRateUsed}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="hidden sm:inline text-xs text-slate-400">
                            CA$<strong className="text-slate-700 font-bold"> {fmt(yr.finalInvoicedCad * 12)}</strong>/yr
                          </span>
                          {expandedYear === yr.year
                            ? <ChevronUp className="h-4 w-4 text-slate-400" />
                            : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </div>
                      </button>

                      {/* Detail panel */}
                      {expandedYear === yr.year && (
                        <div className="px-5 py-4 bg-gradient-to-br from-slate-50 to-blue-50/30 border-t border-slate-100">
                          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                  <th className="px-4 py-2 text-left text-slate-500 font-medium">Step</th>
                                  <th className="px-4 py-2 text-left text-slate-500 font-medium">Description</th>
                                  <th className="px-4 py-2 text-right text-slate-500 font-medium">Amount</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {STEPS.map(step => {
                                  const raw = (yr as any)[step.key];
                                  const isExchange = step.key === "exchangeRateUsed";
                                  const isFinal = step.final;
                                  const displayVal = isExchange
                                    ? `× ${raw}`
                                    : isFinal
                                      ? fmtCad(raw)
                                      : `${fmt(raw)} TND`;

                                  return (
                                    <tr key={step.id} className={isFinal ? "bg-emerald-50" : ""}>
                                      <td className="px-4 py-2.5 font-bold text-slate-700 whitespace-nowrap">{step.id}</td>
                                      <td className="px-4 py-2.5">
                                        <p className={`font-${step.bold ? "semibold" : "normal"} ${step.color}`}>{step.label}</p>
                                        <p className="text-slate-400 text-[10px] mt-0.5">{step.note}</p>
                                      </td>
                                      <td className={`px-4 py-2.5 text-right tabular-nums font-${step.bold ? "bold" : "medium"} ${isFinal ? "text-emerald-700 text-sm" : step.color}`}>
                                        {displayVal}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Send to client CTA */}
              {requestId && (
                <Card className={`border-0 shadow-md ${sent ? "bg-emerald-50" : "bg-gradient-to-r from-blue-600 to-indigo-600"}`}>
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {sent ? (
                      <>
                        <div>
                          <p className="font-semibold text-emerald-800">Simulation sent to client ✓</p>
                          <p className="text-sm text-emerald-600 mt-0.5">The client has been notified and can now review the cost projection.</p>
                        </div>
                        <Button variant="outline" onClick={() => navigate(backHref)} className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                          Back to Pipeline
                        </Button>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="font-semibold text-white">Ready to send to {clientName || "the client"}?</p>
                          <p className="text-sm text-blue-200 mt-0.5">
                            Monthly cost: <strong className="text-white">{fmtCad(years[0]?.finalInvoicedCad ?? 0)}</strong> in year 1
                            &nbsp;→&nbsp; <strong className="text-white">{fmtCad(years[years.length-1]?.finalInvoicedCad ?? 0)}</strong> in year {result.durationYears}
                          </p>
                        </div>
                        <Button onClick={handleSendToClient} disabled={sending}
                          className="bg-white text-blue-700 hover:bg-blue-50 shadow font-semibold shrink-0">
                          {sending
                            ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                            : <><Send className="mr-2 h-4 w-4" /> Send to Client</>}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </WorkspacePageShell>
  );
}
