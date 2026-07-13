import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/lib/useLanguage";
import EmployeePageShell from "./EmployeePageShell";

const requests = [
  { type: "Annual leave", from: "10 Aug 2026", to: "14 Aug 2026", days: 5, status: "approved" },
  { type: "Sick leave", from: "02 Jun 2026", to: "03 Jun 2026", days: 2, status: "approved" },
  { type: "Annual leave", from: "20 Jul 2026", to: "22 Jul 2026", days: 3, status: "pending" },
];

const statusClass: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export default function EmployeeLeaveRequests() {
  const { t } = useLanguage();

  return (
    <EmployeePageShell
      title={t("employee.leave.title")}
      description={t("employee.leave.description")}
      action={
        <Button className="gap-2 bg-white text-blue-900 hover:bg-blue-50">
          <Plus className="h-4 w-4" />
          {t("employee.leave.newRequest")}
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="border-slate-200 shadow-sm xl:col-span-1">
          <CardHeader>
            <CardTitle>{t("employee.leave.newRequest")}</CardTitle>
            <CardDescription>{t("employee.leave.formDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("employee.leave.type")}</Label>
              <Select defaultValue="annual">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">{t("employee.leave.annual")}</SelectItem>
                  <SelectItem value="sick">{t("employee.leave.sick")}</SelectItem>
                  <SelectItem value="unpaid">{t("employee.leave.unpaid")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("employee.leave.from")}</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>{t("employee.leave.to")}</Label>
              <Input type="date" />
            </div>
            <Button className="w-full">{t("employee.leave.submit")}</Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>{t("employee.leave.history")}</CardTitle>
            <CardDescription>{t("employee.leave.historyDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("employee.leave.type")}</TableHead>
                  <TableHead>{t("employee.leave.from")}</TableHead>
                  <TableHead>{t("employee.leave.to")}</TableHead>
                  <TableHead>{t("employee.leave.days")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((item) => (
                  <TableRow key={`${item.from}-${item.to}`}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.from}</TableCell>
                    <TableCell>{item.to}</TableCell>
                    <TableCell>{item.days}</TableCell>
                    <TableCell>
                      <Badge className={statusClass[item.status]}>
                        {t(`employee.leave.status.${item.status}`)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </EmployeePageShell>
  );
}
