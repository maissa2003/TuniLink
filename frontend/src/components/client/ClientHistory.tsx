import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const history = [
  { date: "10 Jul 2026", event: "New team member onboarded", detail: "Sarra Khelifi — Business Analyst" },
  { date: "28 Jun 2026", event: "Invoice paid", detail: "INV-2026-065 — 27,900 CAD" },
  { date: "15 Jun 2026", event: "Simulation approved", detail: "DevOps Engineer — 6,500 CAD/mo" },
  { date: "02 Jun 2026", event: "Contract renewed", detail: "Malek Guemri — 12 months extension" },
];

export default function ClientHistory() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("client.history.title")} description={t("client.history.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{t("client.history.timeline")}</CardTitle>
          <CardDescription>{t("client.history.timelineDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {history.map((item) => (
            <div key={`${item.date}-${item.event}`} className="rounded-lg border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500">{item.date}</p>
              <p className="mt-1 font-medium text-slate-900">{item.event}</p>
              <p className="text-sm text-slate-600">{item.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </WorkspacePageShell>
  );
}
