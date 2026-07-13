import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Calculator, FileText, Receipt } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

export default function ClientOverview() {
  const { t } = useLanguage();
  const quickLinks = [
    { titleKey: "nav.myTeam", textKey: "client.overview.teamCard", href: "/workspace/team", icon: Briefcase },
    { titleKey: "nav.simulations", textKey: "client.overview.simulationsCard", href: "/workspace/simulations", icon: Calculator },
    { titleKey: "nav.invoices", textKey: "client.overview.invoicesCard", href: "/workspace/invoices", icon: Receipt },
    { titleKey: "nav.history", textKey: "client.overview.historyCard", href: "/workspace/history", icon: FileText },
  ] as const;

  return (
    <WorkspacePageShell title={t("client.overview.title")} description={t("client.overview.description")}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title={t("client.stats.teamSize")} value="8" icon={Briefcase} color="bg-blue-100 text-blue-600" />
        <StatsCard title={t("client.stats.activeSimulations")} value="3" icon={Calculator} color="bg-green-100 text-green-600" />
        <StatsCard title={t("client.stats.monthlyCost")} value="42,800 CAD" icon={Receipt} color="bg-amber-100 text-amber-600" />
        <StatsCard title={t("client.stats.contracts")} value="8" icon={FileText} color="bg-purple-100 text-purple-600" />
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
