import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, Users, Building2, Wallet, Calculator, Receipt, DollarSign, Activity, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";

const monthlyData = [
  { name: "Jan", revenue: 42000, expenses: 28000 },
  { name: "Feb", revenue: 48000, expenses: 31000 },
  { name: "Mar", revenue: 51000, expenses: 32000 },
  { name: "Apr", revenue: 46000, expenses: 29000 },
  { name: "May", revenue: 54000, expenses: 34000 },
  { name: "Jun", revenue: 62000, expenses: 38000 },
  { name: "Jul", revenue: 59000, expenses: 35000 },
  { name: "Aug", revenue: 65000, expenses: 40000 },
  { name: "Sep", revenue: 71000, expenses: 42000 },
  { name: "Oct", revenue: 68000, expenses: 41000 },
  { name: "Nov", revenue: 75000, expenses: 45000 },
  { name: "Dec", revenue: 82000, expenses: 48000 },
];

const recentInvoices = [
  { id: "INV-2024-001", client: "TechCorp Inc.", amount: "$12,450.00", status: "Paid", date: "Oct 24, 2024" },
  { id: "INV-2024-002", client: "Global Solutions Ltd.", amount: "$8,230.00", status: "Pending", date: "Oct 22, 2024" },
  { id: "INV-2024-003", client: "Nexus Industries", amount: "$15,600.00", status: "Overdue", date: "Oct 15, 2024" },
  { id: "INV-2024-004", client: "Apex Systems", amount: "$4,100.00", status: "Paid", date: "Oct 12, 2024" },
];

const recentModifications = [
  { action: "Updated CNSS Tax Rate", user: "Admin", date: "2 hours ago" },
  { action: "Approved Payroll for Oct 2024", user: "Finance Lead", date: "5 hours ago" },
  { action: "Added new Infrastructure Cost (Cloud)", user: "Admin", date: "1 day ago" },
  { action: "Modified Infrastructure Margin", user: "Finance Lead", date: "2 days ago" },
];

export default function FinanceOverview() {
  const basePath = "/admin/finance"; // Fallback, could be dynamic based on role

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Finance Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your financial performance, payroll, and infrastructure.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Row 1 */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$723,000</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +14% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Expenses</CardTitle>
            <Activity className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$443,000</div>
            <p className="text-xs text-rose-600 flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Net Profit</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$280,000</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +21% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Profit Margin</CardTitle>
            <Activity className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">38.7%</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +2.4% from last month
            </p>
          </CardContent>
        </Card>

        {/* Row 2 */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Payroll Costs</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$315,000</div>
            <p className="text-xs text-slate-500 mt-1">25 Active Employees</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Infrastructure Costs</CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$128,000</div>
            <p className="text-xs text-slate-500 mt-1">20 Active Items</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">142</div>
            <p className="text-xs text-slate-500 mt-1">12 Pending Payment</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Simulations</CardTitle>
            <Calculator className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">854</div>
            <p className="text-xs text-slate-500 mt-1">Generated this year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="md:col-span-4 lg:col-span-5 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly financial performance for the current year</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ fontSize: "14px", fontWeight: 500 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Shortcuts */}
        <Card className="md:col-span-3 lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used finance modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to={`${basePath}/payroll`} className="flex items-center p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group">
              <div className="bg-amber-100 p-2 rounded-md mr-3 group-hover:bg-amber-200 transition-colors">
                <Users className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <div className="font-medium text-sm text-slate-900">Manage Payroll</div>
                <div className="text-xs text-slate-500">Employee salaries & taxes</div>
              </div>
            </Link>
            <Link to={`${basePath}/invoices`} className="flex items-center p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group">
              <div className="bg-teal-100 p-2 rounded-md mr-3 group-hover:bg-teal-200 transition-colors">
                <Receipt className="h-5 w-5 text-teal-700" />
              </div>
              <div>
                <div className="font-medium text-sm text-slate-900">Invoices</div>
                <div className="text-xs text-slate-500">View and track payments</div>
              </div>
            </Link>
            <Link to={`${basePath}/infrastructure`} className="flex items-center p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group">
              <div className="bg-purple-100 p-2 rounded-md mr-3 group-hover:bg-purple-200 transition-colors">
                <Building2 className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <div className="font-medium text-sm text-slate-900">Infrastructure</div>
                <div className="text-xs text-slate-500">Manage operating costs</div>
              </div>
            </Link>
            <Link to={`${basePath}/taxes`} className="flex items-center p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group">
              <div className="bg-slate-100 p-2 rounded-md mr-3 group-hover:bg-slate-200 transition-colors">
                <Settings2 className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <div className="font-medium text-sm text-slate-900">Taxes & Settings</div>
                <div className="text-xs text-slate-500">Configure global rates</div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Invoices */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Latest client billing activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-sm text-slate-900">{inv.client}</div>
                    <div className="text-xs text-slate-500">{inv.id} • {inv.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm text-slate-900">{inv.amount}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 rounded-full px-2 py-0.5 inline-block
                      ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                        inv.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                      {inv.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to={`${basePath}/invoices`} className="mt-6 block text-center text-sm font-medium text-blue-600 hover:text-blue-700">
              View all invoices →
            </Link>
          </CardContent>
        </Card>

        {/* Recent Modifications */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest financial system changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentModifications.map((mod, i) => (
                <div key={i} className="flex items-start">
                  <div className="mt-0.5 bg-blue-100 p-1.5 rounded-full mr-3">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{mod.action}</div>
                    <div className="text-xs text-slate-500 mt-1">By {mod.user} • {mod.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
