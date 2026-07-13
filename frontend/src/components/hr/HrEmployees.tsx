import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const employees = [
  { name: "Malek Guemri", role: "Full Stack Developer", client: "NorthBridge Tech", status: "ACTIVE", start: "Jan 2025" },
  { name: "Ahmed Ben Ali", role: "QA Engineer", client: "MapleSoft", status: "ACTIVE", start: "Mar 2025" },
  { name: "Sarra Khelifi", role: "Business Analyst", client: "NorthBridge Tech", status: "PENDING", start: "Jul 2026" },
  { name: "Youssef Mabrouk", role: "DevOps Engineer", client: "GreenLeaf Corp", status: "ACTIVE", start: "Nov 2024" },
];

export default function HrEmployees() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("hr.employees.title")} description={t("hr.employees.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("hr.employees.list")}</CardTitle>
            <CardDescription>{t("hr.employees.listDesc")}</CardDescription>
          </div>
          <Button>{t("hr.employees.add")}</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("hr.fields.position")}</TableHead>
                <TableHead>{t("hr.fields.client")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead>{t("hr.fields.startDate")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.client}</TableCell>
                  <TableCell>
                    <Badge className={item.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.start}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </WorkspacePageShell>
  );
}
