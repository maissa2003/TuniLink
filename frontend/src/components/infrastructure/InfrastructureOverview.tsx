import { Link } from "react-router-dom";
import { ArrowRight, HardHat, Landmark, Users } from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";
import { useEmployees } from "@/hooks/useEmployee";

export default function InfrastructureOverview() {
  const { t } = useLanguage();
  const { data: employees = [], isLoading } = useEmployees();

  // Compute metrics from real employee database
  const employeesCovered = employees.filter(emp => emp.infraCostTotal && Number(emp.infraCostTotal) > 0);
  const totalCost = employees.reduce((sum, emp) => sum + (Number(emp.infraCostTotal) || 0), 0);
  const avgCost = employeesCovered.length > 0 ? totalCost / employeesCovered.length : 0;

  // Chart data: cost per employee
  const costPerEmployee = employees
    .filter(emp => emp.infraCostTotal && Number(emp.infraCostTotal) > 0)
    .map(emp => ({
      name: emp.fullName,
      cost: Number(emp.infraCostTotal),
      dept: emp.position || emp.department || "Consultant"
    }));

  const quickLinks = [
    { 
      title: "Active Directory", 
      text: "Assign and edit infrastructure cost parameters per employee.", 
      href: "/workspace/hr", // Point to HrEmployees or directories
      icon: Users 
    },
    { 
      title: "Workspace Assets", 
      text: "Track allocated software licenses, cloud compute, and workstation leases.", 
      href: "/workspace/resources", 
      icon: HardHat 
    },
  ];

  return (
    <WorkspacePageShell title={t("infrastructure.overview.title")} description={t("infrastructure.overview.description")}>
      {/* ── KPI Row ── */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 animate-in fade-in duration-500">
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Monthly Total Cost</p>
                <p className="text-3xl font-bold tracking-tight text-slate-900">{totalCost.toLocaleString()} TND</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Landmark className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-500">
              Active operational costs allocated to staff
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Employees Covered</p>
                <p className="text-3xl font-bold tracking-tight text-slate-900">{employeesCovered.length} Staff</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-500">
              Out of {employees.length} total registered employees
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Average Allocation</p>
                <p className="text-3xl font-bold tracking-tight text-slate-900">{avgCost.toFixed(0)} TND</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <HardHat className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-500">
              Allocated infrastructure spend per head
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Cost Per Employee Chart + Quick Links ── */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3 animate-in fade-in duration-500 delay-100">
        
        {/* Cost per Employee Bar Chart */}
        <Card className="border-slate-200 shadow-sm lg:col-span-2 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">Monthly Infrastructure Cost by Employee (TND)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">
                Loading cost charts...
              </div>
            ) : costPerEmployee.length > 0 ? (
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costPerEmployee} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#1e293b" }} width={120} />
                    <Tooltip formatter={(v: any) => [`${v} TND`, "Cost"]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} cursor={{ fill: "#f1f5f9" }} />
                    <Bar dataKey="cost" name="Cost" radius={[0, 6, 6, 0]} barSize={18}>
                      {costPerEmployee.map((_, index) => {
                        const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#f97316"];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[260px] flex flex-col items-center justify-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
                <p>No allocated infrastructure costs found in database.</p>
                <p className="text-xs text-slate-400 mt-1">Navigate to an employee profile to add laptop or workspace leases.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Directory & Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Infrastructure Workspaces</h4>
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 mb-2">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-800">{item.title}</CardTitle>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.text}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link
                    to={item.href}
                    className="flex h-9 items-center justify-center rounded-lg bg-slate-900 hover:bg-blue-600 text-sm font-medium text-white transition-colors"
                  >
                    Open Workspace <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </WorkspacePageShell>
  );
}
