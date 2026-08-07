import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Calculator, FileText, Receipt, Activity, Users, ShieldAlert, CreditCard } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";
import { useState, useEffect } from "react";

/* --- Fake Data --- */
const invoiceHistory = [
  { name: 'Jan', cost: 35000 },
  { name: 'Feb', cost: 42000 },
  { name: 'Mar', cost: 38000 },
  { name: 'Apr', cost: 45000 },
  { name: 'May', cost: 42800 },
  { name: 'Jun', cost: 48000 },
];

const payrollEvolution = [
  { name: 'Jan', payroll: 28000 },
  { name: 'Feb', payroll: 32000 },
  { name: 'Mar', payroll: 31500 },
  { name: 'Apr', payroll: 36000 },
  { name: 'May', payroll: 35500 },
  { name: 'Jun', payroll: 40000 },
];

const teamComposition = [
  { name: 'Frontend Dev', value: 3 },
  { name: 'Backend Dev', value: 2 },
  { name: 'QA Engineer', value: 2 },
  { name: 'DevOps', value: 1 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

function ModernStatCard({ title, value, subtext, icon: Icon, colorClass }: any) {
  return (
    <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-slate-400">
          {subtext}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ClientOverview() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const quickLinks = [
    { titleKey: "nav.myTeam", textKey: "client.overview.teamCard", href: "/workspace/team", icon: Briefcase },
    { titleKey: "nav.simulations", textKey: "client.overview.simulationsCard", href: "/workspace/simulations", icon: Calculator },
    { titleKey: "nav.invoices", textKey: "client.overview.invoicesCard", href: "/workspace/invoices", icon: Receipt },
    { titleKey: "nav.history", textKey: "client.overview.historyCard", href: "/workspace/history", icon: FileText },
  ] as const;

  if (loading) {
    return (
      <WorkspacePageShell title={t("client.overview.title")} description={t("client.overview.description")}>
        <div className="flex h-[60vh] items-center justify-center space-x-2">
          <Activity className="h-6 w-6 animate-pulse text-blue-600" />
          <span className="text-sm font-medium text-slate-500">Loading Client Dashboard...</span>
        </div>
      </WorkspacePageShell>
    );
  }

  return (
    <WorkspacePageShell title={t("client.overview.title")} description={t("client.overview.description")}>
      
      {/* KPI Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 animate-in fade-in duration-500">
        <ModernStatCard title="Assigned Employees" value="8" subtext="Active consultants" icon={Users} colorClass="bg-blue-100 text-blue-600" />
        <ModernStatCard title="Active Contracts" value="8" subtext="All signed & valid" icon={FileText} colorClass="bg-emerald-100 text-emerald-600" />
        <ModernStatCard title="Running Simulations" value="3" subtext="Pending review" icon={Calculator} colorClass="bg-amber-100 text-amber-600" />
        <ModernStatCard title="Monthly Cost (CAD)" value="$42,800" subtext="Est. for current month" icon={CreditCard} colorClass="bg-purple-100 text-purple-600" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 animate-in fade-in duration-500 delay-100">
        
        {/* Payroll Evolution (Area Chart) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Payroll Evolution (CAD)</CardTitle>
            <CardDescription>Monthly payroll costs over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={payrollEvolution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="payroll" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPayroll)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Invoice History (Bar Chart) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Project Costs (CAD)</CardTitle>
            <CardDescription>Monthly invoiced amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={invoiceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                  />
                  <Bar dataKey="cost" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3 animate-in fade-in duration-500 delay-200">
        
        {/* Team Composition (Donut Chart) */}
        <Card className="border-slate-200 shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Team Composition</CardTitle>
            <CardDescription>Breakdown by role</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={teamComposition} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                    {teamComposition.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Contract Renewals List */}
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Upcoming Contract Renewals</CardTitle>
            <CardDescription>Contracts expiring in the next 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "John Doe", role: "Frontend Dev", date: "Aug 15, 2026", days: 23, critical: true },
                { name: "Jane Smith", role: "Backend Dev", date: "Sep 01, 2026", days: 40, critical: false },
                { name: "Alice Johnson", role: "QA Engineer", date: "Sep 20, 2026", days: 59, critical: false },
              ].map((contract, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${contract.critical ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {contract.critical ? <ShieldAlert className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{contract.name}</p>
                      <p className="text-xs text-slate-500">{contract.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${contract.critical ? 'text-red-600' : 'text-slate-700'}`}>
                      Expires in {contract.days} days
                    </p>
                    <p className="text-xs text-slate-400">{contract.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Quick Links */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.href} className="border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
              <CardHeader className="pb-3">
                <Icon className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>{t(item.titleKey)}</CardTitle>
                <CardDescription>{t(item.textKey)}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={item.href} className="flex h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                  {t("workspace.open")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
    </WorkspacePageShell>
  );
}
