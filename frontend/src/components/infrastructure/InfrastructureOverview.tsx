import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, HardHat, Landmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

export default function InfrastructureOverview() {
  const { t } = useLanguage();
  const quickLinks = [
    { titleKey: "nav.operatingCosts", textKey: "infrastructure.overview.costsCard", href: "/workspace/costs", icon: Landmark },
    { titleKey: "nav.resources", textKey: "infrastructure.overview.resourcesCard", href: "/workspace/resources", icon: HardHat },
    { titleKey: "nav.reports", textKey: "infrastructure.overview.reportsCard", href: "/workspace/reports", icon: BarChart3 },
  ] as const;

  return (
    <WorkspacePageShell title={t("infrastructure.overview.title")} description={t("infrastructure.overview.description")}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title={t("infrastructure.stats.monthlyCosts")} value="18,200 TND" icon={Landmark} color="bg-blue-100 text-blue-600" />
        <StatsCard title={t("infrastructure.stats.resources")} value="12" icon={HardHat} color="bg-green-100 text-green-600" />
        <StatsCard title={t("infrastructure.stats.utilization")} value="87%" icon={BarChart3} color="bg-amber-100 text-amber-600" />
        <StatsCard title={t("infrastructure.stats.offices")} value="2" icon={Landmark} color="bg-purple-100 text-purple-600" />
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
