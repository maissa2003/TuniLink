import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const costs = [
  { category: "Office rent", location: "Tunis", amount: "8,500 TND", period: "Monthly" },
  { category: "Cloud hosting", location: "AWS", amount: "2,400 TND", period: "Monthly" },
  { category: "Equipment", location: "Laptops & monitors", amount: "4,800 TND", period: "Quarterly" },
  { category: "Utilities", location: "Tunis office", amount: "1,200 TND", period: "Monthly" },
];

export default function InfrastructureCosts() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("infrastructure.costs.title")} description={t("infrastructure.costs.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{t("infrastructure.costs.list")}</CardTitle>
          <CardDescription>{t("infrastructure.costs.listDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("infrastructure.fields.category")}</TableHead>
                <TableHead>{t("infrastructure.fields.location")}</TableHead>
                <TableHead>{t("infrastructure.fields.amount")}</TableHead>
                <TableHead>{t("infrastructure.fields.period")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costs.map((item) => (
                <TableRow key={item.category}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.period}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </WorkspacePageShell>
  );
}
