import { useEmployeeBudget } from "@/hooks/useEmployee";
import { Calculator, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function BudgetTab({ employee }: { employee: any }) {
  const { data: budget, isLoading } = useEmployeeBudget(employee.id);

  if (isLoading) return <div className="text-sm text-slate-500 py-4">Loading budget projections...</div>;

  if (!budget || !budget.yearProjections) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Budget Projections</h3>
          <p className="text-sm text-slate-500 mt-0.5">3-year budget forecast based on current costs.</p>
        </div>
        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500 bg-slate-50">
          <Calculator className="mx-auto h-8 w-8 text-slate-400 mb-3" />
          <p>Budget projections are available after the first payroll is validated.</p>
        </div>
      </div>
    );
  }

  const chartData = budget.yearProjections.map((p: any) => ({
    name: `Year ${p.year}`,
    "Cost (TND)": p.totalCostTnd,
    "Billed (CAD)": p.totalBilledCad
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Budget Projections</h3>
          <p className="text-sm text-slate-500 mt-0.5">3-year budget forecast based on current costs (assumes 5% annual inflation/raise).</p>
        </div>
        <div className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          Forecast Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Current Monthly Budget</p>
          <p className="text-3xl font-black text-slate-900">{budget.monthlyBudgetTnd.toLocaleString()} <span className="text-base text-slate-500 font-medium">TND</span></p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Current Annual Budget</p>
          <p className="text-3xl font-black text-slate-900">{budget.annualBudgetTnd.toLocaleString()} <span className="text-base text-slate-500 font-medium">TND</span></p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm mt-6">
        <h4 className="font-semibold text-slate-900 mb-4">3-Year Projection</h4>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: '8px' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar yAxisId="left" dataKey="Cost (TND)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="Billed (CAD)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
