import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, Clock, CheckCircle2, CircleDashed, Loader2,
  ArrowRight, Users, CalendarClock, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { ResourceRequest, getAllRequests, updateRequestStatus } from "@/api/requests";

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:            { label: "Pending",             color: "text-slate-500",  bg: "bg-slate-100",  icon: CircleDashed   },
  IN_PROGRESS:        { label: "Sourcing",            color: "text-blue-600",   bg: "bg-blue-50",    icon: Loader2        },
  SIMULATION_PENDING: { label: "Simulation sent",     color: "text-amber-600",  bg: "bg-amber-50",   icon: CalendarClock  },
  FULFILLED:          { label: "Fulfilled",           color: "text-emerald-600",bg: "bg-emerald-50", icon: CheckCircle2   },
  CANCELLED:          { label: "Cancelled",           color: "text-red-500",    bg: "bg-red-50",     icon: CircleDashed   },
};

const PIPELINE_STEPS = ["PENDING", "IN_PROGRESS", "SIMULATION_PENDING", "FULFILLED"];

function StepBar({ status }: { status: string }) {
  const current = PIPELINE_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-3">
      {PIPELINE_STEPS.map((s, i) => {
        const done = i <= current;
        return (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className={`h-1.5 w-full rounded-full transition-all ${done ? "bg-blue-500" : "bg-slate-200"}`} />
            {i < PIPELINE_STEPS.length - 1 && (
              <ChevronRight className={`h-3 w-3 flex-shrink-0 ${done ? "text-blue-400" : "text-slate-300"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function RequestCard({ req, onAction }: { req: ResourceRequest; onAction: (id: number, status: string) => void }) {
  const role = localStorage.getItem("role") ?? "HR";
  const simBase = role === "MANAGER" ? "/workspace/hr/simulation" : "/workspace/simulation";
  const navigate = useNavigate();
  const meta = STATUS_META[req.status] ?? STATUS_META["PENDING"];
  const StatusIcon = meta.icon;

  const handleSimulate = async () => {
    await onAction(req.id, "SIMULATION_PENDING");
    navigate(`${simBase}?requestId=${req.id}&title=${encodeURIComponent(req.title)}&client=${encodeURIComponent(req.clientCompanyName)}`);
  };

  return (
    <Card className="group border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white overflow-hidden">
      {/* Colored top bar */}
      <div className={`h-1 w-full ${req.status === "FULFILLED" ? "bg-emerald-400" : req.status === "SIMULATION_PENDING" ? "bg-amber-400" : req.status === "IN_PROGRESS" ? "bg-blue-500" : "bg-slate-200"}`} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.bg} ${meta.color}`}>
                <StatusIcon className="h-3 w-3" />
                {meta.label}
              </span>
              <span className="text-xs text-slate-400">#{req.id}</span>
            </div>
            <h3 className="font-semibold text-slate-900 truncate text-base">{req.title}</h3>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{req.clientCompanyName}</span>
              {req.targetDate && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(req.targetDate), "MMM d, yyyy")}
                </span>
              )}
            </div>
            {req.description && (
              <p className="mt-2 text-xs text-slate-400 line-clamp-2">{req.description}</p>
            )}
            <StepBar status={req.status} />
          </div>

          {/* Right: action */}
          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            {req.status === "PENDING" && (
              <Button size="sm" variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => onAction(req.id, "IN_PROGRESS")}>
                Start Sourcing <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
            {req.status === "IN_PROGRESS" && (
              <Button size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
                onClick={handleSimulate}>
                Create Simulation <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
            {req.status === "SIMULATION_PENDING" && (
              <Button size="sm" variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => navigate(`${simBase}?requestId=${req.id}&title=${encodeURIComponent(req.title)}&client=${encodeURIComponent(req.clientCompanyName)}`)}>
                View Simulation <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
            {req.status === "FULFILLED" && (
              <Button size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                onClick={() => {
                  let name = "";
                  try {
                    const sim = JSON.parse(req.simulationDetails || "{}");
                    name = sim.candidateName || "";
                  } catch (e) {}
                  navigate(`/workspace/hr/employees?new=1&name=${encodeURIComponent(name)}&client=${encodeURIComponent(req.clientCompanyName)}`);
                }}>
                Onboard Employee <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HrRequestsPage() {
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try { setRequests(await getAllRequests()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleAction = async (id: number, status: string) => {
    try { await updateRequestStatus(id, status); await loadRequests(); }
    catch (e) { console.error(e); }
  };

  const groups = {
    active: requests.filter(r => ["PENDING", "IN_PROGRESS"].includes(r.status)),
    simulation: requests.filter(r => r.status === "SIMULATION_PENDING"),
    done: requests.filter(r => ["FULFILLED", "CANCELLED"].includes(r.status)),
  };

  return (
    <WorkspacePageShell title="Recruitment Pipeline" description="Manage incoming client requests and create financial simulations.">
      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        {[
          { label: "Total",      value: requests.length,          color: "text-slate-700" },
          { label: "Active",     value: groups.active.length,     color: "text-blue-600"  },
          { label: "Simulated",  value: groups.simulation.length, color: "text-amber-600" },
          { label: "Fulfilled",  value: groups.done.length,       color: "text-emerald-600"},
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
          <div className="mb-4 rounded-full bg-slate-100 p-4"><Briefcase className="h-8 w-8 text-slate-400" /></div>
          <p className="font-semibold text-slate-700">No requests yet</p>
          <p className="text-sm text-slate-400 mt-1">Client requests will appear here once submitted.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.active.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Active — {groups.active.length}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {groups.active.map(r => <RequestCard key={r.id} req={r} onAction={handleAction} />)}
              </div>
            </section>
          )}
          {groups.simulation.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Awaiting Approval — {groups.simulation.length}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {groups.simulation.map(r => <RequestCard key={r.id} req={r} onAction={handleAction} />)}
              </div>
            </section>
          )}
          {groups.done.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Closed — {groups.done.length}</h2>
              <div className="grid gap-3 md:grid-cols-2 opacity-60">
                {groups.done.map(r => <RequestCard key={r.id} req={r} onAction={handleAction} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </WorkspacePageShell>
  );
}
