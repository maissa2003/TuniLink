import { useEffect, useState } from "react";
import { 
  Plus, UserPlus, CheckCircle2, CircleDashed, Loader2, CalendarClock,
  MapPin, Star, Banknote, Briefcase
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { 
  ResourceRequest, getMyRequests, createRequest, 
  approveSimulation, rejectSimulation 
} from "@/api/requests";
import { SimulationResult } from "@/api/simulations";

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:            { label: "Pending",             color: "text-slate-500",  bg: "bg-slate-100",  icon: CircleDashed   },
  IN_PROGRESS:        { label: "Sourcing Candidates", color: "text-blue-600",   bg: "bg-blue-50",    icon: Loader2        },
  SIMULATION_PENDING: { label: "Action Required",     color: "text-amber-600",  bg: "bg-amber-50",   icon: CalendarClock  },
  FULFILLED:          { label: "Approved & Hired",    color: "text-emerald-600",bg: "bg-emerald-50", icon: CheckCircle2   },
  CANCELLED:          { label: "Cancelled",           color: "text-red-500",    bg: "bg-red-50",     icon: CircleDashed   },
};

const fmtCad = (n: number) => `CA$${n.toLocaleString("en-CA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function ClientRequestsPage() {
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Request Form State
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", description: "", targetDate: "", 
    seniorityLevel: "", workMode: "", requiredSkills: "", estimatedBudgetCad: "", annualRaisePercent: "" 
  });
  const [submitting, setSubmitting] = useState(false);

  // Review Simulation State
  const [selectedReq, setSelectedReq] = useState<ResourceRequest | null>(null);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadRequests = async () => {
    try { setRequests(await getMyRequests()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createRequest({
        ...formData,
        estimatedBudgetCad: formData.estimatedBudgetCad ? Number(formData.estimatedBudgetCad) : undefined,
        annualRaisePercent: formData.annualRaisePercent ? Number(formData.annualRaisePercent) : undefined
      });
      setOpen(false);
      setFormData({ title: "", description: "", targetDate: "", seniorityLevel: "", workMode: "", requiredSkills: "", estimatedBudgetCad: "", annualRaisePercent: "" });
      await loadRequests();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = (req: ResourceRequest) => {
    if (req.simulationDetails) {
      try {
        setSimResult(JSON.parse(req.simulationDetails));
        setSelectedReq(req);
        setRejectionReason("");
      } catch (e) { console.error("Failed to parse simulation", e); }
    }
  };

  const handleApprove = async () => {
    if (!selectedReq) return;
    setActionLoading(true);
    try {
      await approveSimulation(selectedReq.id);
      setSelectedReq(null);
      await loadRequests();
    } catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!selectedReq) return;
    setActionLoading(true);
    try {
      await rejectSimulation(selectedReq.id, rejectionReason);
      setSelectedReq(null);
      await loadRequests();
    } catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  };

  return (
    <WorkspacePageShell title="My Resource Requests" description="Request new talent and review recruitment proposals.">
      {/* ── Header & New Request Button ── */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Your Talent Pipeline</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="bg-blue-600 hover:bg-blue-700 shadow-sm"><Plus className="mr-2 h-4 w-4" /> Request Talent</Button>} />
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request New Talent</DialogTitle>
              <DialogDescription>Provide details about the profile you need. Our team will start sourcing immediately.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-2">
              <div className="col-span-2 space-y-1.5">
                <Label>Job Title <span className="text-red-500">*</span></Label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Senior Full Stack Developer" required />
              </div>
              
              <div className="space-y-1.5">
                <Label>Seniority Level</Label>
                <Select value={formData.seniorityLevel} onValueChange={v => setFormData({ ...formData, seniorityLevel: v || '' })}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Junior">Junior (0-2 years)</SelectItem>
                    <SelectItem value="Mid-Level">Mid-Level (3-5 years)</SelectItem>
                    <SelectItem value="Senior">Senior (5+ years)</SelectItem>
                    <SelectItem value="Lead">Lead / Architect</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Work Mode</Label>
                <Select value={formData.workMode} onValueChange={v => setFormData({ ...formData, workMode: v || '' })}>
                  <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label>Required Skills</Label>
                <Input value={formData.requiredSkills} onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })} placeholder="e.g. React, Node.js, AWS (comma separated)" />
              </div>

              <div className="space-y-1.5">
                <Label>Target Start Date <span className="text-red-500">*</span></Label>
                <Input type="date" value={formData.targetDate} onChange={e => setFormData({ ...formData, targetDate: e.target.value })} required />
              </div>

              <div className="space-y-1.5">
                <Label>Estimated Monthly Budget (CAD)</Label>
                <Input type="number" value={formData.estimatedBudgetCad} onChange={e => setFormData({ ...formData, estimatedBudgetCad: e.target.value })} placeholder="e.g. 5000" />
              </div>
              
              <div className="space-y-1.5">
                <Label>Expected Annual Raise (%)</Label>
                <Input type="number" step="0.5" value={formData.annualRaisePercent} onChange={e => setFormData({ ...formData, annualRaisePercent: e.target.value })} placeholder="e.g. 5.0" />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label>Job Description <span className="text-red-500">*</span></Label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Describe the day-to-day responsibilities..." required rows={4} 
                />
              </div>

              <div className="col-span-2 mt-2">
                <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700">
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Request"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Requests List ── */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
      ) : requests.length === 0 ? (
        <Card className="border-dashed border-slate-200 bg-slate-50 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-white p-4 shadow-sm"><UserPlus className="h-8 w-8 text-slate-300" /></div>
            <p className="font-medium text-slate-600">No requests yet</p>
            <p className="text-sm text-slate-400 mt-1">Click the button above to request new talent.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map(req => {
            const meta = STATUS_META[req.status] || STATUS_META.PENDING;
            const Icon = meta.icon;
            return (
              <Card key={req.id} className="group border-0 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                <div className={`h-1.5 w-full ${req.status === 'FULFILLED' ? 'bg-emerald-400' : req.status === 'SIMULATION_PENDING' ? 'bg-amber-400' : 'bg-blue-500'}`} />
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.bg} ${meta.color}`}>
                      <Icon className="h-3 w-3" /> {meta.label}
                    </span>
                    <span className="text-xs text-slate-400">#{req.id}</span>
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-2">{req.title}</h3>
                  
                  <div className="space-y-2 mt-2 flex-1">
                    {req.seniorityLevel && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Star className="h-3.5 w-3.5 text-slate-400" /> {req.seniorityLevel}
                      </div>
                    )}
                    {req.workMode && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {req.workMode}
                      </div>
                    )}
                    {req.estimatedBudgetCad && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Banknote className="h-3.5 w-3.5 text-slate-400" /> Budget: {fmtCad(req.estimatedBudgetCad)}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <CalendarClock className="h-3.5 w-3.5 text-slate-400" /> Target: {req.targetDate ? format(new Date(req.targetDate), 'MMM d, yyyy') : 'N/A'}
                    </div>
                  </div>

                  {req.status === "SIMULATION_PENDING" && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <Button onClick={() => handleReview(req)} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm">
                        Review Proposal
                      </Button>
                    </div>
                  )}
                  {req.status === "FULFILLED" && (
                    <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                      <span className="text-sm font-medium text-emerald-600">Candidate Approved ✓</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Review Simulation Modal ── */}
      <Dialog open={!!selectedReq} onOpenChange={(open) => !open && setSelectedReq(null)}>
        <DialogContent className="max-w-xl">
          {selectedReq && simResult && (
            <>
              <DialogHeader>
                <DialogTitle>Financial Proposal</DialogTitle>
                <DialogDescription>Review the cost simulation for <strong>{selectedReq.title}</strong>.</DialogDescription>
              </DialogHeader>
              
              <div className="mt-2 space-y-4">
                {/* Candidate Profile */}
                <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Proposed Candidate</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                      {simResult.candidateName ? simResult.candidateName.charAt(0) : "C"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{simResult.candidateName || "Candidate Name Not Provided"}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{simResult.candidateBio || "Experience details not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Monthly Cost (Year 1)</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">{fmtCad(simResult.years[0]?.finalInvoicedCad || 0)}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                
                {/* Detailed Simulation Projection */}
                <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                    <h4 className="text-sm font-semibold text-slate-800">Financial Projection ({simResult.annualIncreasePercent}% Annual Raise)</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2 font-medium">Year</th>
                          <th className="px-4 py-2 font-medium">Monthly Cost (TND)</th>
                          <th className="px-4 py-2 font-medium text-right">Client Price (CAD)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {simResult.years.map((year, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2.5 font-medium text-slate-700">Year {year.yearIndex}</td>
                            <td className="px-4 py-2.5 text-slate-600">{(year.employerCostTnd + year.marginTnd + year.infraCostTnd).toLocaleString()} TND</td>
                            <td className="px-4 py-2.5 text-right font-semibold text-slate-900">{fmtCad(year.finalInvoicedCad)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-50/50 border-t border-slate-100 px-4 py-2.5 text-xs text-slate-500 text-right">
                    Exchange rate used: 1 TND = {simResult.exchangeRateTndToCad} CAD
                  </div>
                </div>

                <div className="text-sm text-slate-600 space-y-3">
                  <p>Our HR team has successfully sourced a candidate matching your requirements.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>This is the final all-inclusive monthly price billed to you in CAD.</li>
                    <li>It covers the candidate's net salary, all Tunisian social charges (employer + employee), and infrastructure (office, PC, internet).</li>
                  </ul>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-slate-700">Negotiation / Reason for rejection (optional)</Label>
                  <textarea 
                    className="flex w-full rounded-md border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500" 
                    placeholder="If you cannot approve this proposal, please tell us why..."
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50" onClick={handleReject} disabled={actionLoading}>
                  Reject Proposal
                </Button>
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleApprove} disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Approve & Hire"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </WorkspacePageShell>
  );
}
