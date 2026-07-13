import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const reports = [
  { title: "Cost breakdown by category", value: "Rent 47% · Cloud 13% · Equipment 26%" },
  { title: "Resource utilization", value: "87% of assets assigned" },
  { title: "Monthly trend", value: "+3.2% vs last month" },
];

export default function InfrastructureReports() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("infrastructure.reports.title")} description={t("infrastructure.reports.description")}>
      <div className="grid gap-5 md:grid-cols-3">
        {reports.map((item) => (
          <Card key={item.title} className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{t("infrastructure.reports.mockNote")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-slate-900">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </WorkspacePageShell>
  );
}
