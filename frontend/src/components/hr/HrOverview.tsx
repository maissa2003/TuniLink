import { Link } from "react-router-dom";
import { ArrowRight, FileText, Users, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

export default function HrOverview() {
  const { t } = useLanguage();
  const quickLinks = [
    { titleKey: "nav.employees", textKey: "hr.overview.employeesCard", href: "/workspace/employees", icon: Users },
    { titleKey: "nav.contracts", textKey: "hr.overview.contractsCard", href: "/workspace/contracts", icon: FileText },
    { titleKey: "nav.payrollInputs", textKey: "hr.overview.payrollCard", href: "/workspace/payroll", icon: Wallet },
  ] as const;

  return (
    <WorkspacePageShell title={t("hr.overview.title")} description={t("hr.overview.description")}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title={t("hr.stats.activeEmployees")} value="24" icon={Users} color="bg-blue-100 text-blue-600" />
        <StatsCard title={t("hr.stats.pendingContracts")} value="3" icon={FileText} color="bg-amber-100 text-amber-600" />
        <StatsCard title={t("hr.stats.onboarding")} value="2" icon={Users} color="bg-green-100 text-green-600" />
        <StatsCard title={t("hr.stats.payrollDue")} value="5" icon={Wallet} color="bg-purple-100 text-purple-600" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>{t("hr.overview.pipeline")}</CardTitle>
            <CardDescription>{t("hr.overview.pipelineDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>{t("hr.fields.openPositions")}</span>
              <span className="font-medium text-slate-900">6</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>{t("hr.fields.candidates")}</span>
              <span className="font-medium text-slate-900">14</span>
            </div>
            <div className="flex justify-between">
              <span>{t("hr.fields.clientProjects")}</span>
              <span className="font-medium text-slate-900">NorthBridge, MapleSoft</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>{t("hr.overview.recentActivity")}</CardTitle>
            <CardDescription>{t("hr.overview.recentActivityDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-medium text-slate-900">{t("hr.activity.contractSigned")}</p>
              <p className="text-slate-500">Malek Guemri — Full Stack Developer</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-medium text-slate-900">{t("hr.activity.payrollSubmitted")}</p>
              <p className="text-slate-500">June 2026 inputs for 24 employees</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.href} className="border-slate-200 shadow-sm">
              <CardHeader>
                <Icon className="h-8 w-8 text-blue-700" />
                <CardTitle className="mt-3">{t(item.titleKey)}</CardTitle>
                <CardDescription>{t(item.textKey)}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={item.href} className="flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80">
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
