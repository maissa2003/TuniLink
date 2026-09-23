import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/useLanguage";
import EmployeePageShell from "./EmployeePageShell";
import { useState, useEffect } from "react";
import { getEmployeeDocuments, downloadDocument, Document } from "@/api/documents";
import { toast } from "sonner";

export default function EmployeeContract() {
  const { t } = useLanguage();
  const [contractDoc, setContractDoc] = useState<Document | null>(null);

  // TODO: Get employee ID from auth context or user data
  const employeeId = 1; // Replace with actual employee ID

  useEffect(() => {
    loadContract();
  }, [employeeId]);

  const loadContract = async () => {
    try {
      const allDocs = await getEmployeeDocuments(employeeId);
      const contract = allDocs.find(doc => doc.type === 'CONTRACT');
      setContractDoc(contract || null);
    } catch (error) {
      console.error("Failed to load contract:", error);
    }
  };

  const handleDownload = async () => {
    if (!contractDoc) return;
    try {
      const blob = await downloadDocument(contractDoc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = contractDoc.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download contract:", error);
      toast.error("Failed to download contract");
    }
  };

  const rows = [
    { label: t("employee.fields.contractType"), value: t("employee.contract.typeValue") },
    { label: t("employee.fields.client"), value: "NorthBridge Tech Inc." },
    { label: t("employee.fields.position"), value: "Full Stack Developer" },
    { label: t("employee.fields.startDate"), value: "15 Jan 2025" },
    { label: t("employee.fields.endDate"), value: t("employee.contract.openEnded") },
    { label: t("employee.fields.workMode"), value: t("employee.contract.remote") },
    { label: t("employee.fields.netSalary"), value: "3,200 TND" },
    { label: t("employee.fields.agency"), value: "TuniLink Recruitment" },
  ];

  return (
    <EmployeePageShell title={t("employee.contract.title")} description={t("employee.contract.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{t("employee.contract.details")}</CardTitle>
            <CardDescription>{t("employee.contract.detailsDesc")}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700">{t("employee.stats.active")}</Badge>
            {contractDoc && (
              <Button onClick={handleDownload} size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 md:grid-cols-2">
            {rows.map((row) => (
              <div key={row.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">{row.label}</dt>
                <dd className="mt-1 text-base font-semibold text-slate-900">{row.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{t("employee.contract.notes")}</CardTitle>
          <CardDescription>{t("employee.contract.notesDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          <p>{t("employee.contract.notesText")}</p>
        </CardContent>
      </Card>
    </EmployeePageShell>
  );
}
