import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const simulations = [
  { name: "Senior React Developer", salary: "3,500 TND", margin: "24%", clientPrice: "6,200 CAD", status: "DRAFT" },
  { name: "DevOps Engineer", salary: "3,800 TND", margin: "22%", clientPrice: "6,500 CAD", status: "APPROVED" },
  { name: "QA Automation", salary: "2,900 TND", margin: "21%", clientPrice: "5,100 CAD", status: "SENT" },
];

export default function ClientSimulations() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("client.simulations.title")} description={t("client.simulations.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("client.simulations.list")}</CardTitle>
            <CardDescription>{t("client.simulations.listDesc")}</CardDescription>
          </div>
          <Button>{t("client.simulations.new")}</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("client.fields.position")}</TableHead>
                <TableHead>{t("client.fields.salaryTnd")}</TableHead>
                <TableHead>{t("client.fields.margin")}</TableHead>
                <TableHead>{t("client.fields.clientPrice")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {simulations.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.salary}</TableCell>
                  <TableCell>{item.margin}</TableCell>
                  <TableCell>{item.clientPrice}</TableCell>
                  <TableCell>
                    <Badge className="bg-slate-100 text-slate-700">{item.status}</Badge>
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
