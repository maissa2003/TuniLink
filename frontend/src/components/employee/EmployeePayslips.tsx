import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/lib/useLanguage";
import EmployeePageShell from "./EmployeePageShell";

const payslips = [
  { period: "June 2026", net: "3,200 TND", gross: "4,180 TND", status: "available" },
  { period: "May 2026", net: "3,200 TND", gross: "4,180 TND", status: "available" },
  { period: "April 2026", net: "3,200 TND", gross: "4,180 TND", status: "available" },
  { period: "March 2026", net: "3,150 TND", gross: "4,120 TND", status: "available" },
];

export default function EmployeePayslips() {
  const { t } = useLanguage();

  return (
    <EmployeePageShell title={t("employee.payslips.title")} description={t("employee.payslips.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{t("employee.payslips.history")}</CardTitle>
          <CardDescription>{t("employee.payslips.historyDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("employee.payslips.period")}</TableHead>
                <TableHead>{t("employee.payslips.net")}</TableHead>
                <TableHead>{t("employee.payslips.gross")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map((item) => (
                <TableRow key={item.period}>
                  <TableCell className="font-medium">{item.period}</TableCell>
                  <TableCell>{item.net}</TableCell>
                  <TableCell>{item.gross}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700">{t("employee.payslips.available")}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      {t("employee.payslips.download")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </EmployeePageShell>
  );
}
