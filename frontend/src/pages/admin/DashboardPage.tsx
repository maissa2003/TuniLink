import { useEffect, useState } from "react";
import { Building2, Calculator, Receipt, UserCheck, Users, ArrowUpRight, ArrowDownRight, Activity, CreditCard, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import PageHeader from "@/components/layouts/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/lib/useLanguage";
import { getDashboardGreeting } from "@/lib/greeting";

/* --- Fake Data --- */
const revenueData = [
  { name: 'Jan', revenue: 15000 },
  { name: 'Feb', revenue: 22000 },
  { name: 'Mar', revenue: 28000 },
  { name: 'Apr', revenue: 24000 },
  { name: 'May', revenue: 32000 },
  { name: 'Jun', revenue: 45000 },
  { name: 'Jul', revenue: 52000 },
];

const usersByRoleData = [
  { name: 'Employee', value: 245 },
  { name: 'Client', value: 45 },
  { name: 'Manager', value: 32 },
  { name: 'HR', value: 12 },
  { name: 'Admin', value: 4 },
];

const usersByCompanyData = [
  { name: 'Nexus Tech', users: 120 },
  { name: 'Vertex Fin', users: 85 },
  { name: 'Aegis Med', users: 65 },
  { name: 'Quantum', users: 40 },
  { name: 'Stark Ind', users: 28 },
];

const registrationsData = [
  { name: 'W1', users: 20 },
  { name: 'W2', users: 45 },
  { name: 'W3', users: 30 },
  { name: 'W4', users: 60 },
];

const PIE_COLORS = ['#0ea5e9', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b'];

/* --- Stat Card Component --- */
function ModernStatCard({ title, value, trend, trendValue, icon: Icon, colorClass }: any) {
  const isPositive = trend === 'up';
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
        <div className="mt-4 flex items-center text-sm">
          <span className={`flex items-center font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
            {trendValue}
          </span>
          <span className="ml-2 text-slate-400">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center space-x-2">
        <Activity className="h-6 w-6 animate-pulse text-blue-600" />
        <span className="text-sm font-medium text-slate-500">Loading metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">
      <PageHeader title={getDashboardGreeting(language)} description="Overview of your platform's performance and activity." />

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ModernStatCard title="Total Revenue" value="$52,000" trend="up" trendValue="15.2%" icon={CreditCard} colorClass="bg-blue-100 text-blue-600" />
        <ModernStatCard title="Active Users" value="338" trend="up" trendValue="8.4%" icon={Users} colorClass="bg-emerald-100 text-emerald-600" />
        <ModernStatCard title="New Companies" value="24" trend="down" trendValue="2.1%" icon={Building2} colorClass="bg-amber-100 text-amber-600" />
        <ModernStatCard title="Pending Sim." value="12" trend="up" trendValue="18.0%" icon={Calculator} colorClass="bg-purple-100 text-purple-600" />
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Revenue Evolution (Area Chart) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Revenue Evolution</CardTitle>
            <CardDescription>Monthly recurring revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Users by Company Type (Bar Chart) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Companies by Users</CardTitle>
            <CardDescription>Distribution of active personnel across clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersByCompanyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Users by Role (Donut Chart) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Users by Role</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByRoleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {usersByRoleData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Registrations (Line Chart) */}
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={registrationsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Recent Activities Timeline */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
          <CardDescription>Latest actions performed across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 pl-2">
            {[
              { time: "2 hours ago", title: "New Simulation Requested", desc: "Vertex Fin requested a simulation for 'Senior Developer'.", icon: Calculator, color: "text-purple-600 bg-purple-100" },
              { time: "5 hours ago", title: "Invoice Paid", desc: "Invoice #INV-2026-042 was paid by Nexus Tech.", icon: Receipt, color: "text-emerald-600 bg-emerald-100" },
              { time: "1 day ago", title: "New Company Onboarded", desc: "Aegis Med has completed the registration process.", icon: Building2, color: "text-blue-600 bg-blue-100" },
              { time: "1 day ago", title: "User Role Updated", desc: "John Doe was promoted to Manager.", icon: UserCheck, color: "text-amber-600 bg-amber-100" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{activity.desc}</p>
                  <div className="mt-1 flex items-center text-xs text-slate-400">
                    <Clock className="mr-1 h-3 w-3" /> {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
