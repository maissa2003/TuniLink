import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const reports = [
  { title: "Monthly Revenue Summary", period: "June 2026", value: "124,500 CAD" },
  { title: "Payroll Cost Analysis", period: "Q2 2026", value: "231,800 TND" },
  { title: "Margin Performance", period: "H1 2026", value: "22.4% avg" },
  { title: "Client Billing Status", period: "July 2026", value: "3 unpaid" },
];

export default function FinanceReports() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("finance.reports.title")} description={t("finance.reports.description")}>
      <div className="grid gap-5 md:grid-cols-2">
        {reports.map((item) => (
          <Card key={item.title} className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.period}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{t("finance.reports.mockNote")}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </WorkspacePageShell>
  );
}
