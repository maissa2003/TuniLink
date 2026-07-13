import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const payrollInputs = [
  { employee: "Malek Guemri", period: "July 2026", base: "3,200 TND", bonus: "200 TND", status: "SUBMITTED" },
  { employee: "Ahmed Ben Ali", period: "July 2026", base: "2,800 TND", bonus: "0 TND", status: "DRAFT" },
  { employee: "Youssef Mabrouk", period: "July 2026", base: "3,500 TND", bonus: "150 TND", status: "SUBMITTED" },
];

export default function HrPayrollInputs() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("hr.payroll.title")} description={t("hr.payroll.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("hr.payroll.list")}</CardTitle>
            <CardDescription>{t("hr.payroll.listDesc")}</CardDescription>
          </div>
          <Button>{t("hr.payroll.submit")}</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.user")}</TableHead>
                <TableHead>{t("hr.fields.period")}</TableHead>
                <TableHead>{t("hr.fields.baseSalary")}</TableHead>
                <TableHead>{t("hr.fields.bonus")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollInputs.map((item) => (
                <TableRow key={`${item.employee}-${item.period}`}>
                  <TableCell className="font-medium">{item.employee}</TableCell>
                  <TableCell>{item.period}</TableCell>
                  <TableCell>{item.base}</TableCell>
                  <TableCell>{item.bonus}</TableCell>
                  <TableCell>
                    <Badge className={item.status === "SUBMITTED" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
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
