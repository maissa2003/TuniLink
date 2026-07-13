import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Receipt, Wallet, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

export default function FinanceOverview() {
  const { t } = useLanguage();
  const quickLinks = [
    { titleKey: "nav.payroll", textKey: "finance.overview.payrollCard", href: "/workspace/payroll", icon: Wallet },
    { titleKey: "nav.margins", textKey: "finance.overview.marginsCard", href: "/workspace/margins", icon: Calculator },
    { titleKey: "nav.invoices", textKey: "finance.overview.invoicesCard", href: "/workspace/invoices", icon: Receipt },
    { titleKey: "nav.reports", textKey: "finance.overview.reportsCard", href: "/workspace/reports", icon: BarChart3 },
  ] as const;

  return (
    <WorkspacePageShell title={t("finance.overview.title")} description={t("finance.overview.description")}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title={t("finance.stats.monthlyPayroll")} value="78,400 TND" icon={Wallet} color="bg-blue-100 text-blue-600" />
        <StatsCard title={t("finance.stats.pendingInvoices")} value="4" icon={Receipt} color="bg-amber-100 text-amber-600" />
        <StatsCard title={t("finance.stats.avgMargin")} value="22%" icon={Calculator} color="bg-green-100 text-green-600" />
        <StatsCard title={t("finance.stats.revenue")} value="124,500 CAD" icon={BarChart3} color="bg-purple-100 text-purple-600" />
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
