import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const invoices = [
  { number: "INV-2026-071", client: "NorthBridge Tech", amount: "28,400 CAD", due: "31 Jul 2026", status: "SENT" },
  { number: "INV-2026-068", client: "MapleSoft", amount: "14,700 CAD", due: "15 Jul 2026", status: "OVERDUE" },
  { number: "INV-2026-065", client: "GreenLeaf Corp", amount: "19,200 CAD", due: "30 Jun 2026", status: "PAID" },
];

export default function FinanceInvoices() {
  const { t } = useLanguage();

  const statusClass = (status: string) => {
    if (status === "PAID") return "bg-green-100 text-green-700";
    if (status === "OVERDUE") return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <WorkspacePageShell title={t("finance.invoices.title")} description={t("finance.invoices.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("finance.invoices.list")}</CardTitle>
            <CardDescription>{t("finance.invoices.listDesc")}</CardDescription>
          </div>
          <Button>{t("finance.invoices.create")}</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("finance.fields.invoice")}</TableHead>
                <TableHead>{t("finance.fields.client")}</TableHead>
                <TableHead>{t("finance.fields.amount")}</TableHead>
                <TableHead>{t("finance.fields.dueDate")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((item) => (
                <TableRow key={item.number}>
                  <TableCell className="font-medium">{item.number}</TableCell>
                  <TableCell>{item.client}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.due}</TableCell>
                  <TableCell>
                    <Badge className={statusClass(item.status)}>{item.status}</Badge>
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
