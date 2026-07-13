import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const contracts = [
  { employee: "Malek Guemri", client: "NorthBridge Tech", type: "CDI", salary: "3,200 TND", end: "Open-ended", status: "ACTIVE" },
  { employee: "Ahmed Ben Ali", client: "MapleSoft", type: "CDD", salary: "2,800 TND", end: "Dec 2026", status: "ACTIVE" },
  { employee: "Sarra Khelifi", client: "NorthBridge Tech", type: "CDI", salary: "2,950 TND", end: "Pending signature", status: "PENDING" },
];

export default function HrContracts() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("hr.contracts.title")} description={t("hr.contracts.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{t("hr.contracts.list")}</CardTitle>
          <CardDescription>{t("hr.contracts.listDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.user")}</TableHead>
                <TableHead>{t("hr.fields.client")}</TableHead>
                <TableHead>{t("hr.fields.contractType")}</TableHead>
                <TableHead>{t("hr.fields.salary")}</TableHead>
                <TableHead>{t("hr.fields.endDate")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((item) => (
                <TableRow key={item.employee}>
                  <TableCell className="font-medium">{item.employee}</TableCell>
                  <TableCell>{item.client}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.salary}</TableCell>
                  <TableCell>{item.end}</TableCell>
                  <TableCell>
                    <Badge className={item.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </WorkspacePageShell>
  );
}
