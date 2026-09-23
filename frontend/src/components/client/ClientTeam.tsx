import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";
import { useEmployees } from "@/hooks/useEmployee";
import { calculateEmployerCost, DEFAULT_ERP_CONFIG } from "@/lib/business-logic/payrollEngine";

export default function ClientTeam() {
  const { t } = useLanguage();
  const { data: employees = [], isLoading } = useEmployees();
  
  // Filter for ACTIVE/ASSIGNED employees, usually you would filter by client name as well
  const team = employees.filter(e => e.status !== "RECRUITED" && e.status !== "CONTRACT_CREATED");

  return (
    <WorkspacePageShell title={t("client.team.title")} description={t("client.team.description")}>
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle>{t("client.team.list")}</CardTitle>
          <CardDescription>{t("client.team.listDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-slate-500 py-4 text-center">Loading team directory...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.name")}</TableHead>
                  <TableHead>{t("client.fields.role")}</TableHead>
                  <TableHead>{t("client.fields.rate")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((item) => {
                  // Calculate client rate in CAD using payrollEngine
                  const contract = {
                    grossSalary: item.contractGrossSalary || 0,
                    bonus: 0,
                  };
                  const infra = {
                    laptopCost: Number(item.infraCostTotal) || 0,
                    officeRent: 0,
                    internet: 0,
                    electricity: 0,
                    softwareLicenses: 0,
                    cloudServices: 0,
                    itSupport: 0,
                    other: 0,
                  };
                  const calc = calculateEmployerCost(contract, infra, DEFAULT_ERP_CONFIG);

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-slate-900">{item.fullName}</TableCell>
                      <TableCell className="text-slate-600">{item.position || item.department || "Consultant"}</TableCell>
                      <TableCell className="font-semibold text-blue-700">
                        {calc.finalInvoiceCad.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}/mo
                      </TableCell>
                      <TableCell>
                        <Badge className={item.status === "ACTIVE" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-blue-100 text-blue-700 hover:bg-blue-100"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">{item.email || "—"}</TableCell>
                    </TableRow>
                  );
                })}
                {team.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                      No team members assigned yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </WorkspacePageShell>
  );
}
