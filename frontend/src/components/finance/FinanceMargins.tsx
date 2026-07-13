import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const margins = [
  { client: "NorthBridge Tech", role: "Full Stack Developer", costTnd: "3,200", priceCad: "5,800", margin: "24%" },
  { client: "MapleSoft", role: "QA Engineer", costTnd: "2,800", priceCad: "4,900", margin: "21%" },
  { client: "GreenLeaf Corp", role: "DevOps Engineer", costTnd: "3,500", priceCad: "6,200", margin: "23%" },
];

export default function FinanceMargins() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("finance.margins.title")} description={t("finance.margins.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{t("finance.margins.config")}</CardTitle>
          <CardDescription>{t("finance.margins.configDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("finance.fields.client")}</TableHead>
                <TableHead>{t("finance.fields.role")}</TableHead>
                <TableHead>{t("finance.fields.costTnd")}</TableHead>
                <TableHead>{t("finance.fields.priceCad")}</TableHead>
                <TableHead>{t("finance.fields.margin")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {margins.map((item) => (
                <TableRow key={`${item.client}-${item.role}`}>
                  <TableCell className="font-medium">{item.client}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.costTnd} TND</TableCell>
                  <TableCell>{item.priceCad} CAD</TableCell>
                  <TableCell>{item.margin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </WorkspacePageShell>
  );
}
