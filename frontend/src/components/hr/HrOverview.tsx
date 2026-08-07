import { Link } from "react-router-dom";
import { ArrowRight, FileText, Users, Wallet, Activity, CalendarClock, Briefcase, FileSignature } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";
import { useHrBasePath } from "@/lib/hrPaths";
import { useState, useEffect } from "react";

/* --- Fake Data --- */
const departmentData = [
  { name: 'Engineering', employees: 45 },
  { name: 'Product', employees: 12 },
  { name: 'Design', employees: 8 },
  { name: 'Marketing', employees: 10 },
  { name: 'Sales', employees: 15 },
];

const statusData = [
  { name: 'Active', value: 85 },
  { name: 'On Leave', value: 5 },
  { name: 'Inactive', value: 10 },
];

const leaveData = [
  { name: 'Jan', Accepted: 12, Pending: 4, Rejected: 2 },
  { name: 'Feb', Accepted: 8, Pending: 2, Rejected: 1 },
  { name: 'Mar', Accepted: 15, Pending: 6, Rejected: 3 },
  { name: 'Apr', Accepted: 10, Pending: 3, Rejected: 1 },
];

const contractsData = [
  { name: 'CDI', value: 65 },
  { name: 'CDD', value: 20 },
  { name: 'Freelance', value: 10 },
  { name: 'Internship', value: 5 },
];

const hiresData = [
  { name: 'Jan', hires: 3 },
  { name: 'Feb', hires: 5 },
  { name: 'Mar', hires: 2 },
  { name: 'Apr', hires: 8 },
  { name: 'May', hires: 6 },
  { name: 'Jun', hires: 10 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const STATUS_COLORS = ['#10b981', '#f59e0b', '#64748b'];

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

export default function HrOverview() {
  const { t } = useLanguage();
  const hrBase = useHrBasePath();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const quickLinks = [
    { titleKey: "nav.employees", textKey: "hr.overview.employeesCard", href: `${hrBase}/employees`, icon: Users },
    { titleKey: "nav.contracts", textKey: "hr.overview.contractsCard", href: `${hrBase}/contracts`, icon: FileText },
    { titleKey: "nav.payrollInputs", textKey: "hr.overview.payrollCard", href: `${hrBase}${hrBase === "/workspace/hr" ? "/payroll-inputs" : "/payroll"}`, icon: Wallet },
  ] as const;

  if (loading) {
    return (
      <WorkspacePageShell title={t("hr.overview.title")} description={t("hr.overview.description")}>
        <div className="flex h-[60vh] items-center justify-center space-x-2">
          <Activity className="h-6 w-6 animate-pulse text-blue-600" />
          <span className="text-sm font-medium text-slate-500">Loading HR dashboard...</span>
        </div>
      </WorkspacePageShell>
    );
  }

  return (
    <WorkspacePageShell title={t("hr.overview.title")} description={t("hr.overview.description")}>
      
      {/* KPI Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 animate-in fade-in duration-500">
        <ModernStatCard title="Total Employees" value="90" subtext="85 Active, 5 On Leave" icon={Users} colorClass="bg-blue-100 text-blue-600" />
        <ModernStatCard title="New Hires" value="10" subtext="This month" icon={Briefcase} colorClass="bg-emerald-100 text-emerald-600" />
        <ModernStatCard title="Leave Requests" value="6" subtext="Pending approval" icon={CalendarClock} colorClass="bg-amber-100 text-amber-600" />
        <ModernStatCard title="Contracts Expiring" value="3" subtext="Next 30 days" icon={FileSignature} colorClass="bg-purple-100 text-purple-600" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 animate-in fade-in duration-500 delay-100">
        
        {/* Employees by Department (Bar Chart) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1e293b' }} width={80} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="employees" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests (Stacked Bar Chart) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Leave Requests Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leaveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Accepted" stackId="a" fill="#10b981" />
                  <Bar dataKey="Pending" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="Rejected" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3 animate-in fade-in duration-500 delay-200">
        
        {/* Status Distribution (Pie Chart) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Workforce Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Contracts (Donut Chart) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Contract Types</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={contractsData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                    {contractsData.map((_, index) => (
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

        {/* New Hires (Line Chart) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Hiring Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hiresData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="hires" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Quick Links */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
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
