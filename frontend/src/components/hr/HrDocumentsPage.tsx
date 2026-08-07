import { useEffect, useState } from "react";
import { Download, FileText, ShieldCheck, FolderOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { Document, getAllDocuments, downloadDocument } from "@/api/documents";
import { toast } from "sonner";


const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  CIN: "CIN",
  PASSPORT: "Passport",
  DIPLOMA: "Diploma",
  CV: "CV",
  BANK_RIB: "Bank RIB",
  CONTRACT: "Contract",
  PAYSLIP: "Payslip",
  WORK_CERTIFICATE: "Work Certificate",
  LEAVE_APPROVAL: "Leave Approval",
};

const DOCUMENT_TYPE_ICONS: Record<string, any> = {
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

export default function HrDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {
    try {
      const data = await getAllDocuments();
      setDocuments(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);


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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const groupedDocs = {
    personal: documents.filter(d => ['CIN', 'PASSPORT', 'DIPLOMA', 'CV', 'BANK_RIB'].includes(d.type)),
    hr: documents.filter(d => ['CONTRACT', 'PAYSLIP', 'WORK_CERTIFICATE', 'LEAVE_APPROVAL'].includes(d.type)),
  };

  return (
    <WorkspacePageShell title="Employee Documents" description="View and manage employee documents.">


      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="h-8 w-8 text-slate-400 mb-4" />
          <p className="font-semibold text-slate-700">No documents found</p>
          <p className="text-sm text-slate-400 mt-1">Documents will appear here once uploaded by the employee.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedDocs.personal.length > 0 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Personal Documents</CardTitle>
                <CardDescription>CIN, Passport, Diploma, CV, Bank RIB</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedDocs.personal.map((doc) => {
                      const Icon = DOCUMENT_TYPE_ICONS[doc.type] || FileText;
                      return (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            {doc.employee?.fullName || `Employee #${doc.employee?.id}`}
                          </TableCell>
                          <TableCell>

                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-blue-600" />
                              <Badge variant="outline">{DOCUMENT_TYPE_LABELS[doc.type] || doc.type}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{doc.fileName}</TableCell>
                          <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                          <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(doc.id, doc.fileName)}
                              className="gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {groupedDocs.hr.length > 0 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>HR Documents</CardTitle>
                <CardDescription>Contracts, Payslips, Work Certificates, Leave Approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedDocs.hr.map((doc) => {
                      const Icon = DOCUMENT_TYPE_ICONS[doc.type] || FileText;
                      return (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            {doc.employee?.fullName || `Employee #${doc.employee?.id}`}
                          </TableCell>
                          <TableCell>

                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-blue-600" />
                              <Badge variant="outline">{DOCUMENT_TYPE_LABELS[doc.type] || doc.type}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{doc.fileName}</TableCell>
                          <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                          <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(doc.id, doc.fileName)}
                              className="gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </WorkspacePageShell>
  );
}
