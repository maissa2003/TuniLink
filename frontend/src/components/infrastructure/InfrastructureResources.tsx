import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const resources = [
  { name: "Dell Latitude 5540", type: "Laptop", assignedTo: "Malek Guemri", status: "IN_USE" },
  { name: "MacBook Pro 14", type: "Laptop", assignedTo: "Ahmed Ben Ali", status: "IN_USE" },
  { name: "Dell UltraSharp 27", type: "Monitor", assignedTo: "Available", status: "AVAILABLE" },
  { name: "AWS EC2 t3.large", type: "Server", assignedTo: "Production", status: "IN_USE" },
];

export default function InfrastructureResources() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("infrastructure.resources.title")} description={t("infrastructure.resources.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{t("infrastructure.resources.list")}</CardTitle>
          <CardDescription>{t("infrastructure.resources.listDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("common.type")}</TableHead>
                <TableHead>{t("infrastructure.fields.assignedTo")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.assignedTo}</TableCell>
                  <TableCell>
                    <Badge className={item.status === "AVAILABLE" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
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
