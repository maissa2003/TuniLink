import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/lib/useLanguage";
import EmployeePageShell from "./EmployeePageShell";
import { useState, useEffect, useRef } from "react";
import { getEmployeeLeaveRequests, createLeaveRequest, LeaveRequest } from "@/api/leaveRequests";

import { toast } from "sonner";

// const requests = [
//   { type: "Annual leave", from: "10 Aug 2026", to: "14 Aug 2026", days: 5, status: "approved" },
//   { type: "Sick leave", from: "02 Jun 2026", to: "03 Jun 2026", days: 2, status: "approved" },
//   { type: "Annual leave", from: "20 Jul 2026", to: "22 Jul 2026", days: 3, status: "pending" },
// ];

const statusClass: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export default function EmployeeLeaveRequests() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [type, setType] = useState<"ANNUAL" | "SICK" | "UNPAID">("ANNUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [comments, setComments] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);


  // TODO: Get employee ID from auth context or user data
  const employeeId = 1; // Replace with actual employee ID

  useEffect(() => {
    loadLeaveRequests();
  }, [employeeId]);

  const loadLeaveRequests = async () => {
    try {
      const data = await getEmployeeLeaveRequests(employeeId);
      setRequests(data);
    } catch (error) {
      console.error("Failed to load leave requests:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    setLoading(true);
    try {
      await createLeaveRequest({
        employeeId,
        type,
        startDate,
        endDate,
        comments,
        proof: proof || undefined,
      });
      toast.success("Leave request submitted successfully");
      setStartDate("");
      setEndDate("");
      setComments("");
      setProof(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setType("ANNUAL");
      loadLeaveRequests();

    } catch (error) {
      console.error("Failed to submit leave request:", error);
      toast.error("Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployeePageShell
      title={t("employee.leave.title")}
      description={t("employee.leave.description")}
      action={
        <Button className="gap-2 bg-white text-blue-900 hover:bg-blue-50">
          <Plus className="h-4 w-4" />
          {t("employee.leave.newRequest")}
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="border-slate-200 shadow-sm xl:col-span-1">
          <CardHeader>
            <CardTitle>{t("employee.leave.newRequest")}</CardTitle>
            <CardDescription>{t("employee.leave.formDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("employee.leave.type")}</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANNUAL">{t("employee.leave.annual")}</SelectItem>
                  <SelectItem value="SICK">{t("employee.leave.sick")}</SelectItem>
                  <SelectItem value="UNPAID">{t("employee.leave.unpaid")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("employee.leave.from")}</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t("employee.leave.to")}</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Comments (Optional)</Label>
              <textarea 
                value={comments} 
                onChange={(e) => setComments(e.target.value)} 
                placeholder="Reason for leave..."
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Proof Document (Medical certificate, etc.)</Label>
              <Input 
                ref={fileInputRef}
                type="file" 
                onChange={(e) => setProof(e.target.files?.[0] || null)} 
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={loading}>

              {loading ? "Submitting..." : t("employee.leave.submit")}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>{t("employee.leave.history")}</CardTitle>
            <CardDescription>{t("employee.leave.historyDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("employee.leave.type")}</TableHead>
                  <TableHead>{t("employee.leave.from")}</TableHead>
                  <TableHead>{t("employee.leave.to")}</TableHead>
                  <TableHead>{t("employee.leave.days")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{new Date(item.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(item.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{item.days}</TableCell>
                    <TableCell>
                      <Badge className={statusClass[item.status?.toLowerCase() || 'pending']}>
                        {t(`employee.leave.status.${item.status?.toLowerCase() || 'pending'}`)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </EmployeePageShell>
  );
}
