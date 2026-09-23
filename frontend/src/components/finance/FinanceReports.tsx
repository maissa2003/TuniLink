import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, PieChart, Pie, Cell } from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fake Data for Charts
const monthlyData = [
  { name: "Jan", revenue: 42000, expenses: 28000, profit: 14000 },
  { name: "Feb", revenue: 48000, expenses: 31000, profit: 17000 },
  { name: "Mar", revenue: 51000, expenses: 32000, profit: 19000 },
  { name: "Apr", revenue: 46000, expenses: 29000, profit: 17000 },
  { name: "May", revenue: 54000, expenses: 34000, profit: 20000 },
  { name: "Jun", revenue: 62000, expenses: 38000, profit: 24000 },
  { name: "Jul", revenue: 59000, expenses: 35000, profit: 24000 },
  { name: "Aug", revenue: 65000, expenses: 40000, profit: 25000 },
  { name: "Sep", revenue: 71000, expenses: 42000, profit: 29000 },
  { name: "Oct", revenue: 68000, expenses: 41000, profit: 27000 },
  { name: "Nov", revenue: 75000, expenses: 45000, profit: 30000 },
  { name: "Dec", revenue: 82000, expenses: 48000, profit: 34000 },
];

const costBreakdownData = [
  { name: "Rent & Facilities", value: 45000 },
  { name: "Software Licenses", value: 12000 },
  { name: "Cloud & Hosting", value: 25000 },
  { name: "HR & Team Building", value: 8000 },
  { name: "Hardware & PCs", value: 18000 },
  { name: "Admin & Legal", value: 20000 },
];

const topClientsData = [
  { name: "TechCorp Inc.", value: 125000 },
  { name: "Global Solutions", value: 98000 },
  { name: "Nexus Industries", value: 85000 },
  { name: "CloudScale", value: 72000 },
  { name: "DataMinds", value: 65000 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function FinanceReports() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Reports</h1>
          <p className="text-slate-500 mt-1">Deep dive into revenues, expenses, and operational costs.</p>
        </div>
        <Button variant="outline" className="border-slate-200 bg-white">
          <Download className="mr-2 h-4 w-4 text-slate-600" /> Export All Reports
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Revenue vs Expenses vs Profit */}
        <Card className="shadow-sm border-slate-200 lg:col-span-2">
          <CardHeader>
            <CardTitle>Annual Overview: Revenue, Expenses & Profit</CardTitle>
            <CardDescription>Monthly breakdown of total cash flow.</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                  <Legend iconType="circle" />
                  <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
                  <Area type="monotone" dataKey="expenses" name="Total Expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={0} />
                  <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Top Clients by Revenue</CardTitle>
            <CardDescription>Highest grossing clients year to date.</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topClientsData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <Tooltip
                    cursor={{fill: 'rgba(241, 245, 249, 0.5)'}}
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="value" name="Revenue" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Cost Breakdown */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Infrastructure Cost Breakdown</CardTitle>
            <CardDescription>Distribution of operational expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {costBreakdownData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Cost"]}
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                  <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
