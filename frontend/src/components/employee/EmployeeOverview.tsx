import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, FileText, FolderOpen, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import { useEmployeeBasePath } from "@/lib/employeePaths";
import { useLanguage } from "@/lib/useLanguage";
import EmployeePageShell from "./EmployeePageShell";

export default function EmployeeOverview() {
  const { t } = useLanguage();
  const basePath = useEmployeeBasePath();

  const quickLinks = [
    { titleKey: "nav.myContract", textKey: "employee.overview.contractCard", href: `${basePath}/contract`, icon: FileText },
    { titleKey: "nav.payslips", textKey: "employee.overview.payslipsCard", href: `${basePath}/payslips`, icon: Wallet },
    { titleKey: "nav.leaveRequests", textKey: "employee.overview.leaveCard", href: `${basePath}/leave`, icon: CalendarDays },
    { titleKey: "nav.documents", textKey: "employee.overview.documentsCard", href: `${basePath}/documents`, icon: FolderOpen },
  ] as const;

  return (
    <EmployeePageShell title={t("employee.overview.title")} description={t("employee.overview.description")}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title={t("employee.stats.contractStatus")} value={t("employee.stats.active")} icon={FileText} color="bg-green-100 text-green-600" />
        <StatsCard title={t("employee.stats.nextPayslip")} value="28 Jul" icon={Wallet} color="bg-blue-100 text-blue-600" />
        <StatsCard title={t("employee.stats.leaveBalance")} value="12" icon={CalendarDays} color="bg-amber-100 text-amber-600" />
        <StatsCard title={t("employee.stats.documents")} value="6" icon={FolderOpen} color="bg-purple-100 text-purple-600" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>{t("employee.overview.assignment")}</CardTitle>
            <CardDescription>{t("employee.overview.assignmentDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>{t("employee.fields.client")}</span>
              <span className="font-medium text-slate-900">NorthBridge Tech Inc.</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>{t("employee.fields.position")}</span>
              <span className="font-medium text-slate-900">Full Stack Developer</span>
            </div>
            <div className="flex justify-between">
              <span>{t("employee.fields.startDate")}</span>
              <span className="font-medium text-slate-900">15 Jan 2025</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>{t("employee.overview.recentActivity")}</CardTitle>
            <CardDescription>{t("employee.overview.recentActivityDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-medium text-slate-900">{t("employee.activity.payslipReady")}</p>
              <p className="text-slate-500">{t("employee.activity.junePayslip")}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-medium text-slate-900">{t("employee.activity.leaveApproved")}</p>
              <p className="text-slate-500">{t("employee.activity.leaveDates")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
                <Link
                  to={item.href}
                  className="flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                >
                  {t("workspace.open")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </EmployeePageShell>
  );
}
