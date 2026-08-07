import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { LeaveRequest, updateLeaveRequestStatus, getAllLeaveRequests, downloadProof } from "@/api/leaveRequests";
import { toast } from "sonner";
import { Download } from "lucide-react";


const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING: { label: "Pending", color: "text-amber-700", bg: "bg-amber-100", icon: Clock },
  APPROVED: { label: "Approved", color: "text-emerald-700", bg: "bg-emerald-100", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "text-red-700", bg: "bg-red-100", icon: XCircle },
};

export default function HrLeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const data = await getAllLeaveRequests();
      setRequests(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleApprove = async (requestId: number) => {
    try {
      await updateLeaveRequestStatus(requestId, "APPROVED");
      toast.success("Leave request approved");
      loadRequests();
    } catch (e) {
      console.error(e);
      toast.error("Failed to approve leave request");
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await updateLeaveRequestStatus(requestId, "REJECTED");
      toast.success("Leave request rejected");
      loadRequests();
    } catch (e) {
      console.error(e);
      toast.error("Failed to reject leave request");
    }
  };

  const handleDownloadProof = async (requestId: number) => {
    try {
      const blob = await downloadProof(requestId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proof-${requestId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download proof:", error);
      toast.error("Failed to download proof");
    }
  };

  const groups = {
    pending: requests.filter(r => r.status === "PENDING"),
    approved: requests.filter(r => r.status === "APPROVED"),
    rejected: requests.filter(r => r.status === "REJECTED"),
  };

  return (
    <WorkspacePageShell title="Leave Requests" description="Review and manage employee leave requests.">
      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        {[
          { label: "Total", value: requests.length, color: "text-slate-700" },
          { label: "Pending", value: groups.pending.length, color: "text-amber-600" },
          { label: "Approved", value: groups.approved.length, color: "text-emerald-600" },
          { label: "Rejected", value: groups.rejected.length, color: "text-red-600" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Clock className="h-8 w-8 text-slate-400 mb-4" />
          <p className="font-semibold text-slate-700">No leave requests yet</p>
          <p className="text-sm text-slate-400 mt-1">Employee leave requests will appear here once submitted.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.pending.length > 0 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>{groups.pending.length} request(s) awaiting review</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Proof</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.pending.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">
                          {req.employee?.fullName || `Employee #${req.employee?.id}`}
                        </TableCell>
                        <TableCell>{req.type}</TableCell>

                        <TableCell>{format(new Date(req.startDate), "MMM d, yyyy")}</TableCell>
                        <TableCell>{format(new Date(req.endDate), "MMM d, yyyy")}</TableCell>
                        <TableCell>{req.days}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={req.comments}>
                          {req.comments || <span className="text-slate-400 italic">None</span>}
                        </TableCell>
                        <TableCell>
                          {req.proofDocumentPath ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDownloadProof(req.id)}
                              className="h-8 px-2 text-blue-600 hover:text-blue-700"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Proof
                            </Button>
                          ) : (
                            <span className="text-slate-400 italic text-sm">No file</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">

                            <Button
                              size="sm"
                              variant="outline"
                              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              onClick={() => handleApprove(req.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-700 hover:bg-red-50"
                              onClick={() => handleReject(req.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {(groups.approved.length > 0 || groups.rejected.length > 0) && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Processed Requests</CardTitle>
                <CardDescription>Previously approved or rejected requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Proof</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...groups.approved, ...groups.rejected].map((req) => {
                      const meta = STATUS_META[req.status] || STATUS_META.PENDING;
                      const StatusIcon = meta.icon;
                      return (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">
                            {req.employee?.fullName || `Employee #${req.employee?.id}`}
                          </TableCell>
                          <TableCell>{req.type}</TableCell>

                          <TableCell>{format(new Date(req.startDate), "MMM d, yyyy")}</TableCell>
                          <TableCell>{format(new Date(req.endDate), "MMM d, yyyy")}</TableCell>
                          <TableCell>{req.days}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={req.comments}>
                            {req.comments || <span className="text-slate-400 italic">None</span>}
                          </TableCell>
                          <TableCell>
                            {req.proofDocumentPath ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDownloadProof(req.id)}
                                className="h-8 px-2 text-blue-600 hover:text-blue-700"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Proof
                              </Button>
                            ) : (
                              <span className="text-slate-400 italic text-sm">No file</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${meta.bg} ${meta.color}`}>

                              <StatusIcon className="h-3 w-3 mr-1" />
                              {meta.label}
                            </Badge>
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
