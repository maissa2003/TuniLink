import { useEffect, useState } from "react";
import { Building2, Briefcase, Calculator, Receipt, UserCheck, UserPlus, Users } from "lucide-react";
import api from "@/api/axios";
import PageHeader from "@/components/layouts/PageHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import RevenueCard from "@/components/dashboard/RevenueCard";
import ActivityCard, { DashboardActivity } from "@/components/dashboard/ActivityCard";
import QuickActions from "@/components/dashboard/QuickActions";
import { useLanguage } from "@/lib/useLanguage";
import { getDashboardGreeting } from "@/lib/greeting";

interface AdminDashboardData {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  totalCompanies: number;
  totalEmployees: number;
  totalAssignments: number;
  totalSimulations: number;
  totalInvoices: number;
  monthlyPayroll: number;
  currency: string;
  recentUsers: DashboardActivity[];
}

const emptyDashboard: AdminDashboardData = {
  totalUsers: 0,
  activeUsers: 0,
  pendingUsers: 0,
  totalCompanies: 0,
  totalEmployees: 0,
  totalAssignments: 0,
  totalSimulations: 0,
  totalInvoices: 0,
  monthlyPayroll: 0,
  currency: "TND",
  recentUsers: [],
};

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const [dashboard, setDashboard] = useState<AdminDashboardData>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get<AdminDashboardData>("/dashboard/admin");
        setDashboard({ ...emptyDashboard, ...response.data });
      } catch (err) {
        console.error(err);
        setError(t("admin.dashboard.loadError"));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [language]);

  if (loading) {
    return <div className="rounded-xl border bg-white p-16 text-center text-slate-400 shadow-sm">{t("admin.dashboard.loading")}</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader title={getDashboardGreeting(language)} description={t("admin.dashboard.description")} />
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title={t("admin.dashboard.users")} value={dashboard.totalUsers} icon={Users} />
        <StatsCard title={t("admin.dashboard.companies")} value={dashboard.totalCompanies} icon={Building2} color="bg-violet-100 text-violet-600" />
        <StatsCard title={t("admin.dashboard.employees")} value={dashboard.totalEmployees} icon={Briefcase} color="bg-green-100 text-green-600" />
        <RevenueCard amount={Number(dashboard.monthlyPayroll ?? 0)} currency={dashboard.currency ?? "TND"} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title={t("admin.dashboard.activeUsers")} value={dashboard.activeUsers} icon={UserCheck} color="bg-emerald-100 text-emerald-600" />
        <StatsCard title={t("admin.dashboard.pendingUsers")} value={dashboard.pendingUsers} icon={UserPlus} color="bg-amber-100 text-amber-600" />
        <StatsCard title={t("admin.dashboard.simulations")} value={dashboard.totalSimulations} icon={Calculator} color="bg-orange-100 text-orange-600" />
        <StatsCard title={t("admin.dashboard.invoices")} value={dashboard.totalInvoices} icon={Receipt} color="bg-pink-100 text-pink-600" />
      </div>

      <StatsCard title={t("admin.dashboard.assignments")} value={dashboard.totalAssignments} icon={Briefcase} color="bg-slate-100 text-slate-600" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityCard activities={dashboard.recentUsers ?? []} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
