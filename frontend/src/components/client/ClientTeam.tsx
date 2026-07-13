import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const team = [
  { name: "Malek Guemri", role: "Full Stack Developer", rate: "5,800 CAD/mo", status: "ACTIVE", since: "Jan 2025" },
  { name: "Ahmed Ben Ali", role: "QA Engineer", rate: "4,900 CAD/mo", status: "ACTIVE", since: "Mar 2025" },
  { name: "Sarra Khelifi", role: "Business Analyst", rate: "4,600 CAD/mo", status: "ONBOARDING", since: "Jul 2026" },
];

export default function ClientTeam() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("client.team.title")} description={t("client.team.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{t("client.team.list")}</CardTitle>
          <CardDescription>{t("client.team.listDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("client.fields.role")}</TableHead>
                <TableHead>{t("client.fields.rate")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead>{t("client.fields.since")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>
                    <Badge className={item.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.since}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </WorkspacePageShell>
  );
}
