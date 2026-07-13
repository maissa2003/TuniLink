import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const payrollRuns = [
  { period: "July 2026", employees: 24, total: "78,400 TND", status: "IN_REVIEW" },
  { period: "June 2026", employees: 24, total: "77,900 TND", status: "PAID" },
  { period: "May 2026", employees: 23, total: "75,200 TND", status: "PAID" },
];

export default function FinancePayroll() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("finance.payroll.title")} description={t("finance.payroll.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("finance.payroll.runs")}</CardTitle>
            <CardDescription>{t("finance.payroll.runsDesc")}</CardDescription>
          </div>
          <Button>{t("finance.payroll.process")}</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("finance.fields.period")}</TableHead>
                <TableHead>{t("finance.fields.employees")}</TableHead>
                <TableHead>{t("finance.fields.total")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollRuns.map((item) => (
                <TableRow key={item.period}>
                  <TableCell className="font-medium">{item.period}</TableCell>
                  <TableCell>{item.employees}</TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell>
                    <Badge className={item.status === "PAID" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
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
