import { Download, FileText, FolderOpen, ShieldCheck, Upload, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/useLanguage";
import EmployeePageShell from "./EmployeePageShell";
import { useState, useEffect, useRef } from "react";
import { getEmployeeDocuments, uploadDocument, downloadDocument, deleteDocument, Document } from "@/api/documents";
import { toast } from "sonner";

// const documents = [
//   { name: "Employment contract", category: "contract", updated: "15 Jan 2025", size: "1.2 MB" },
//   { name: "June 2026 payslip", category: "payslip", updated: "28 Jun 2026", size: "420 KB" },
//   { name: "May 2026 payslip", category: "payslip", updated: "28 May 2026", size: "415 KB" },
//   { name: "ID copy", category: "identity", updated: "10 Jan 2025", size: "860 KB" },
//   { name: "Work certificate", category: "hr", updated: "01 Mar 2026", size: "310 KB" },
//   { name: "Leave approval — Aug 2026", category: "leave", updated: "05 Jul 2026", size: "180 KB" },
// ];

const categoryIcon: Record<string, any> = {
  CIN: ShieldCheck,
  PASSPORT: ShieldCheck,
  DIPLOMA: FileText,
  CV: FileText,
  BANK_RIB: FileText,
  CONTRACT: FileText,
  PAYSLIP: FileText,
  WORK_CERTIFICATE: FolderOpen,
  LEAVE_APPROVAL: FileText,
};

const documentTypes: { type: Document['type']; label: string }[] = [
  { type: 'CIN', label: 'CIN' },
  { type: 'PASSPORT', label: 'Passport' },
  { type: 'DIPLOMA', label: 'Diploma' },
  { type: 'CV', label: 'CV' },
  { type: 'BANK_RIB', label: 'Bank RIB' },
];

export default function EmployeeDocuments() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocType, setSelectedDocType] = useState<Document['type']>('CIN');

  // TODO: Get employee ID from auth context or user data
  const employeeId = 1; // Replace with actual employee ID

  useEffect(() => {
    loadDocuments();
  }, [employeeId]);

  const loadDocuments = async () => {
    try {
      const data = await getEmployeeDocuments(employeeId);
      setDocuments(data);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadDocument(employeeId, file, selectedDocType);
      toast.success("Document uploaded successfully");
      loadDocuments();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
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
      console.error("Failed to download document:", error);
      toast.error("Failed to download document");
    }
  };

  const handleDelete = async (documentId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await deleteDocument(documentId);
      toast.success("Document deleted successfully");
      loadDocuments();
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <EmployeePageShell title={t("employee.documents.title")} description={t("employee.documents.description")}>
      <Card className="border-slate-200 shadow-sm mb-5">
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>Upload your CIN, Passport, Diploma, CV, or Bank RIB</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <select 
              value={selectedDocType} 
              onChange={(e) => setSelectedDocType(e.target.value as Document['type'])}
              className="px-3 py-2 border border-slate-200 rounded-md"
            >
              {documentTypes.map((docType) => (
                <option key={docType.type} value={docType.type}>{docType.label}</option>
              ))}
            </select>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1"
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((doc) => {
          const Icon = categoryIcon[doc.type] || FileText;
          return (
            <Card key={doc.id} className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <Icon className="h-8 w-8 text-blue-700" />
                  <Badge variant="outline">{doc.type}</Badge>
                </div>
                <CardTitle className="mt-3 text-lg">{doc.fileName}</CardTitle>
                <CardDescription>
                  {t("employee.documents.updated")}: {new Date(doc.uploadedAt).toLocaleDateString()} · {formatFileSize(doc.fileSize)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={() => handleDownload(doc.id, doc.fileName)}
                  >
                    <Download className="h-4 w-4" />
                    {t("employee.documents.download")}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </EmployeePageShell>
  );
}
