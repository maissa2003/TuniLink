import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/lib/useLanguage";
import EmployeePageShell from "./EmployeePageShell";
import { useState, useEffect } from "react";
import { getEmployeeDocuments, downloadDocument, Document } from "@/api/documents";
import { toast } from "sonner";

// const payslips = [
//   { period: "June 2026", net: "3,200 TND", gross: "4,180 TND", status: "available" },
//   { period: "May 2026", net: "3,200 TND", gross: "4,180 TND", status: "available" },
//   { period: "April 2026", net: "3,200 TND", gross: "4,180 TND", status: "available" },
//   { period: "March 2026", net: "3,150 TND", gross: "4,120 TND", status: "available" },
// ];

export default function EmployeePayslips() {
  const { t } = useLanguage();
  const [payslips, setPayslips] = useState<Document[]>([]);

  // TODO: Get employee ID from auth context or user data
  const employeeId = 1; // Replace with actual employee ID

  useEffect(() => {
    loadPayslips();
  }, [employeeId]);

  const loadPayslips = async () => {
    try {
      const allDocs = await getEmployeeDocuments(employeeId);
      const payslipDocs = allDocs.filter(doc => doc.type === 'PAYSLIP');
      setPayslips(payslipDocs);
    } catch (error) {
      console.error("Failed to load payslips:", error);
    }
  };

  const handleDownload = async (documentId: number, fileName: string) => {
    try {
      const blob = await downloadDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download payslip:", error);
      toast.error("Failed to download payslip");
    }
  };

  const extractPeriodFromFileName = (fileName: string) => {
    // Try to extract period from filename (e.g., "June_2026_payslip.pdf" -> "June 2026")
    const match = fileName.match(/([A-Za-z]+)_(\d{4})/);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
    return fileName.replace(/\.[^/.]+$/, ""); // Remove extension
  };

  return (
    <EmployeePageShell title={t("employee.payslips.title")} description={t("employee.payslips.description")}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{t("employee.payslips.history")}</CardTitle>
          <CardDescription>{t("employee.payslips.historyDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("employee.payslips.period")}</TableHead>
                <TableHead>{t("employee.payslips.net")}</TableHead>
                <TableHead>{t("employee.payslips.gross")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{extractPeriodFromFileName(item.fileName)}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700">{t("employee.payslips.available")}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleDownload(item.id, item.fileName)}
                    >
                      <Download className="h-4 w-4" />
                      {t("employee.payslips.download")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {payslips.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500">
                    No payslips available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </EmployeePageShell>
  );
}
