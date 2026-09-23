import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Briefcase, CheckCircle2, XCircle, Search, Clock, Users, Link2, Download,
  ArrowRight, FileText, CalendarClock, ChevronRight, AlertCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import api from "@/api/axios";
import { ResourceRequest, getAllRequests } from "@/api/requests";

interface Candidate {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  cvOriginalFilename: string;
  hasCv: boolean;
  skills: string;
  yearsOfExperience: number;
  expectedSalary: number;
  availabilityDate: string;
  status: "NEW_APPLICATION" | "UNDER_REVIEW" | "INTERVIEW_SCHEDULED" | "OFFER_SENT" | "HIRED" | "REJECTED";
  rejectionReason: string;
  resourceRequestTitle: string;
  createdAt: string;
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  NEW_APPLICATION: { label: "New", color: "text-slate-500", bg: "bg-slate-100", icon: Clock },
  UNDER_REVIEW: { label: "Reviewing", color: "text-blue-600", bg: "bg-blue-50", icon: Search },
  INTERVIEW_SCHEDULED: { label: "Interviewing", color: "text-amber-600", bg: "bg-amber-50", icon: CalendarClock },
  HIRED: { label: "Hired", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "text-red-500", bg: "bg-red-50", icon: XCircle },
};

export default function HrCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [rejectCandidateId, setRejectCandidateId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [hireCandidateId, setHireCandidateId] = useState<number | null>(null);
  const [resourceRequests, setResourceRequests] = useState<ResourceRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get<Candidate[]>("/candidates");
      setCandidates(res.data);
      const reqs = await getAllRequests();
      // Only show requests that are active
      setResourceRequests(reqs.filter(r => ["PENDING", "IN_PROGRESS"].includes(r.status)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: number, action: "review" | "interview") => {
    try {
      await api.put(`/candidates/${id}/${action}`);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async () => {
    if (!rejectCandidateId) return;
    try {
      setActionLoading(true);
      await api.put(`/candidates/${rejectCandidateId}/reject`, { reason: rejectReason });
      setRejectCandidateId(null);
      setRejectReason("");
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleHire = async () => {
    if (!hireCandidateId || !selectedRequestId) return;
    try {
      setActionLoading(true);
      await api.post(`/candidates/${hireCandidateId}/hire`, { resourceRequestId: parseInt(selectedRequestId) });
      setHireCandidateId(null);
      setSelectedRequestId("");
      await loadData();
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to hire candidate");
    } finally {
      setActionLoading(false);
    }
  };

  const downloadCv = async (id: number, filename: string) => {
    try {
      const res = await api.get(`/candidates/${id}/cv`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error("Failed to download CV", e);
    }
  };

  const activeCandidates = candidates.filter(c => !["HIRED", "REJECTED"].includes(c.status));
  const doneCandidates = candidates.filter(c => ["HIRED", "REJECTED"].includes(c.status));

  return (
    <WorkspacePageShell title="Candidates" description="Review applications and hire top talent.">
      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        {[
          { label: "Total", value: candidates.length, color: "text-slate-700" },
          { label: "Active", value: activeCandidates.length, color: "text-blue-600" },
          { label: "Hired", value: candidates.filter(c => c.status === "HIRED").length, color: "text-emerald-600" },
          { label: "Rejected", value: candidates.filter(c => c.status === "REJECTED").length, color: "text-red-500" },
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
      ) : candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4"><Users className="h-8 w-8 text-slate-400" /></div>
          <p className="font-semibold text-slate-700">No candidates yet</p>
          <p className="text-sm text-slate-400 mt-1">Applications from the public site will appear here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {activeCandidates.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Active Pipeline — {activeCandidates.length}</h2>
              <div className="grid gap-4">
                {activeCandidates.map(c => (
                  <CandidateCard 
                    key={c.id} 
                    candidate={c} 
                    onStatusChange={handleStatusChange}
                    onHire={() => setHireCandidateId(c.id)}
                    onReject={() => setRejectCandidateId(c.id)}
                    onDownloadCv={() => downloadCv(c.id, c.cvOriginalFilename)}
                  />
                ))}
              </div>
            </section>
          )}

          {doneCandidates.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Closed — {doneCandidates.length}</h2>
              <div className="grid gap-4 opacity-75">
                {doneCandidates.map(c => (
                  <CandidateCard 
                    key={c.id} 
                    candidate={c} 
                    onStatusChange={() => {}}
                    onHire={() => {}}
                    onReject={() => {}}
                    onDownloadCv={() => downloadCv(c.id, c.cvOriginalFilename)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Reject Modal */}
      <Dialog open={!!rejectCandidateId} onOpenChange={() => setRejectCandidateId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Candidate</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-slate-700 mb-2 block">Reason for rejection</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="E.g. Insufficient experience, salary expectations too high..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectCandidateId(null)} disabled={actionLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading || !rejectReason.trim()}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hire Modal */}
      <Dialog open={!!hireCandidateId} onOpenChange={() => setHireCandidateId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hire Candidate</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-500 mb-4">
              This will create a new Employee profile, generate a user account, and assign them to the selected client request.
            </p>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Match to Client Request</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRequestId}
              onChange={(e) => setSelectedRequestId(e.target.value)}
            >
              <option value="">-- Select a Request --</option>
              {resourceRequests.map(r => (
                <option key={r.id} value={r.id}>
                  {r.clientCompanyName} - {r.title}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHireCandidateId(null)} disabled={actionLoading}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleHire} disabled={actionLoading || !selectedRequestId}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Hire Candidate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WorkspacePageShell>
  );
}

function CandidateCard({ 
  candidate, 
  onStatusChange, 
  onHire, 
  onReject, 
  onDownloadCv 
}: { 
  candidate: Candidate;
  onStatusChange: (id: number, action: "review" | "interview") => void;
  onHire: () => void;
  onReject: () => void;
  onDownloadCv: () => void;
}) {
  const meta = STATUS_META[candidate.status] || STATUS_META.NEW_APPLICATION;
  const StatusIcon = meta.icon;

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Left info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.bg} ${meta.color}`}>
                <StatusIcon className="h-3 w-3" />
                {meta.label}
              </span>
              <span className="text-xs text-slate-400">Applied {format(new Date(candidate.createdAt), "MMM d, yyyy")}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{candidate.fullName}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-slate-600">
              <span className="flex items-center gap-1"><Users className="h-4 w-4 text-slate-400" /> {candidate.email}</span>
              {candidate.phone && <span className="flex items-center gap-1"><Users className="h-4 w-4 text-slate-400" /> {candidate.phone}</span>}
              <span className="flex items-center gap-1"><Briefcase className="h-4 w-4 text-slate-400" /> {candidate.yearsOfExperience} years exp.</span>
            </div>
            
            {candidate.skills && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Skills</p>
                <p className="text-sm text-slate-700">{candidate.skills}</p>
              </div>
            )}
            
            {(candidate.status === "REJECTED" && candidate.rejectionReason) && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-1">Rejection Reason</p>
                <p className="text-sm text-red-600">{candidate.rejectionReason}</p>
              </div>
            )}
            
            {(candidate.status === "HIRED" && candidate.resourceRequestTitle) && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Hired For</p>
                <p className="text-sm text-emerald-600">{candidate.resourceRequestTitle}</p>
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex flex-col gap-2 min-w-[200px] border-l border-slate-100 pl-6">
            {candidate.hasCv && (
              <Button variant="outline" size="sm" onClick={onDownloadCv} className="w-full justify-start text-blue-600 border-blue-100 hover:bg-blue-50">
                <FileText className="w-4 h-4 mr-2" /> CV / Resume
              </Button>
            )}
            {candidate.linkedinUrl && (
              <Button variant="outline" size="sm" asChild className="w-full justify-start text-blue-600 border-blue-100 hover:bg-blue-50">
                <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer">
                  <Link2 className="w-4 h-4 mr-2" /> LinkedIn Profile
                </a>
              </Button>
            )}

            <div className="my-2 border-t border-slate-100"></div>

            {candidate.status === "NEW_APPLICATION" && (
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onStatusChange(candidate.id, "review")}>
                Start Review <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            {candidate.status === "UNDER_REVIEW" && (
              <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white" onClick={() => onStatusChange(candidate.id, "interview")}>
                Schedule Interview <CalendarClock className="w-4 h-4 ml-2" />
              </Button>
            )}

            {["UNDER_REVIEW", "INTERVIEW_SCHEDULED", "OFFER_SENT"].includes(candidate.status) && (
              <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onHire}>
                Hire Candidate <CheckCircle2 className="w-4 h-4 ml-2" />
              </Button>
            )}

            {!["HIRED", "REJECTED"].includes(candidate.status) && (
              <Button size="sm" variant="ghost" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700" onClick={onReject}>
                Reject
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
