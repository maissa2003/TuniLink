import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const invoices = [
  { number: "INV-2026-071", period: "July 2026", amount: "28,400 CAD", status: "SENT" },
  { number: "INV-2026-065", period: "June 2026", amount: "27,900 CAD", status: "PAID" },
  { number: "INV-2026-058", period: "May 2026", amount: "26,800 CAD", status: "PAID" },
];

export default function ClientInvoices() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("client.invoices.title")} description={t("client.invoices.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{t("client.invoices.list")}</CardTitle>
          <CardDescription>{t("client.invoices.listDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("client.fields.invoice")}</TableHead>
                <TableHead>{t("client.fields.period")}</TableHead>
                <TableHead>{t("client.fields.amount")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((item) => (
                <TableRow key={item.number}>
                  <TableCell className="font-medium">{item.number}</TableCell>
                  <TableCell>{item.period}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>
                    <Badge className={item.status === "PAID" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
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
