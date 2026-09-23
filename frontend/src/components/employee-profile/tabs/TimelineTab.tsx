import { useEmployeeEvents } from "@/hooks/useEmployee";
import { CircleDashed, FileText, CheckCircle2, HardHat, Wallet, User, UserCheck, Calculator } from "lucide-react";

function getEventIcon(type: string) {
  switch (type) {
    case 'CONTRACT_CREATED':
    case 'CONTRACT_UPDATED':
      return <FileText className="w-5 h-5 text-blue-500" />;
    case 'RESOURCE_ASSIGNED':
      return <HardHat className="w-5 h-5 text-emerald-500" />;
    case 'PAYROLL_VALIDATED':
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    case 'PAYROLL_REJECTED':
      return <Wallet className="w-5 h-5 text-red-500" />;
    case 'INVOICE_GENERATED':
      return <Calculator className="w-5 h-5 text-indigo-500" />;
    default:
      return <UserCheck className="w-5 h-5 text-slate-400" />;
  }
}

function getEventColor(type: string) {
  switch (type) {
    case 'CONTRACT_CREATED':
    case 'CONTRACT_UPDATED':
      return 'bg-blue-50 border-blue-200';
    case 'RESOURCE_ASSIGNED':
      return 'bg-emerald-50 border-emerald-200';
    case 'PAYROLL_VALIDATED':
      return 'bg-emerald-50 border-emerald-200';
    case 'PAYROLL_REJECTED':
      return 'bg-red-50 border-red-200';
    case 'INVOICE_GENERATED':
      return 'bg-indigo-50 border-indigo-200';
    default:
      return 'bg-slate-50 border-slate-200';
  }
}

export default function TimelineTab({ employee }: { employee: any }) {
  const { data: events, isLoading } = useEmployeeEvents(employee.id);

  if (isLoading) return <div className="text-sm text-slate-500 py-4">Loading activity timeline...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Activity Timeline</h3>
        <p className="text-sm text-slate-500 mt-0.5">Chronological audit trail of all lifecycle events.</p>
      </div>

      {events && events.length > 0 ? (
        <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8 mt-8">
          {events.map((event, idx) => (
            <div key={event.id} className="relative">
              <div className="absolute -left-[35px] bg-white p-1 rounded-full border-2 border-slate-200">
                {getEventIcon(event.eventType)}
              </div>
              <div className={`rounded-xl border p-4 ${getEventColor(event.eventType)}`}>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-slate-900 text-sm">
                    {event.eventType.replace(/_/g, ' ')}
                  </h4>
                  <span className="text-xs font-medium text-slate-500">
                    {new Date(event.occurredAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{event.description}</p>
                <div className="mt-3 flex items-center text-xs text-slate-500 font-medium">
                  <User className="w-3 h-3 mr-1" />
                  Performed by {event.performedByName || 'System'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500 bg-slate-50">
          <CircleDashed className="mx-auto h-8 w-8 text-slate-400 mb-3" />
          <p>No activity recorded yet.</p>
        </div>
      )}
    </div>
  );
}
