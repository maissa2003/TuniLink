import { Download, FileText, FolderOpen, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/useLanguage";
import EmployeePageShell from "./EmployeePageShell";

const documents = [
  { name: "Employment contract", category: "contract", updated: "15 Jan 2025", size: "1.2 MB" },
  { name: "June 2026 payslip", category: "payslip", updated: "28 Jun 2026", size: "420 KB" },
  { name: "May 2026 payslip", category: "payslip", updated: "28 May 2026", size: "415 KB" },
  { name: "ID copy", category: "identity", updated: "10 Jan 2025", size: "860 KB" },
  { name: "Work certificate", category: "hr", updated: "01 Mar 2026", size: "310 KB" },
  { name: "Leave approval — Aug 2026", category: "leave", updated: "05 Jul 2026", size: "180 KB" },
];

const categoryIcon = {
  contract: FileText,
  payslip: FileText,
  identity: ShieldCheck,
  hr: FolderOpen,
  leave: FileText,
};

export default function EmployeeDocuments() {
  const { t } = useLanguage();

  return (
    <EmployeePageShell title={t("employee.documents.title")} description={t("employee.documents.description")}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((doc) => {
          const Icon = categoryIcon[doc.category as keyof typeof categoryIcon] ?? FileText;
          return (
            <Card key={doc.name} className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <Icon className="h-8 w-8 text-blue-700" />
                  <Badge variant="outline">{t(`employee.documents.category.${doc.category}`)}</Badge>
                </div>
                <CardTitle className="mt-3 text-lg">{doc.name}</CardTitle>
                <CardDescription>
                  {t("employee.documents.updated")}: {doc.updated} · {doc.size}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  {t("employee.documents.download")}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </EmployeePageShell>
  );
}
