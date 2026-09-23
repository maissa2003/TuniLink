import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";

const agencyUsers = [
  { name: "Mayssa RH", email: "rh@vermeg.tn", role: "HR", status: "ACTIVE" },
  { name: "Malek Finance", email: "finance@vermeg.tn", role: "FINANCE", status: "ACTIVE" },
  { name: "Ahmed Employee", email: "employee1@vermeg.tn", role: "EMPLOYEE", status: "ACTIVE" },
  { name: "Sarra Employee", email: "employee2@vermeg.tn", role: "EMPLOYEE", status: "ACTIVE" },
];

export default function HrAgencyUsers() {
  const { t } = useLanguage();

  return (
    <WorkspacePageShell title={t("manager.hrUsers.title")} description={t("manager.hrUsers.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{t("manager.hrUsers.list")}</CardTitle>
          <CardDescription>{t("manager.hrUsers.listDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("common.email")}</TableHead>
                <TableHead>{t("common.role")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agencyUsers.map((user) => (
                <TableRow key={user.email}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700">{user.status}</Badge>
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
