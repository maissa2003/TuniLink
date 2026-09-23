import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, FileText, HardHat, Wallet, Calculator, ArrowLeft, CheckCircle2, CircleDashed } from "lucide-react";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import PersonalInfoTab from "./tabs/PersonalInfoTab";
import ContractTab from "./tabs/ContractTab";
import InfrastructureTab from "./tabs/InfrastructureTab";
import PayrollTab from "./tabs/PayrollTab";
import SimulationsTab from "./tabs/SimulationsTab";
import InvoicesTab from "./tabs/InvoicesTab";
import BudgetTab from "./tabs/BudgetTab";
import TimelineTab from "./tabs/TimelineTab";
import { useEmployee, useUpdateEmployeeStatus } from "@/hooks/useEmployee";

// The strict, sequential enterprise workflow steps
const WORKFLOW_STEPS = [
  { id: "RECRUITED", label: "Recruited", role: "HR" },
  { id: "CONTRACT_CREATED", label: "Contract Created", role: "HR" },
  { id: "INFRASTRUCTURE_ASSIGNED", label: "Infra Assigned", role: "INFRA" },
  { id: "FINANCE_VALIDATED", label: "Finance Validated", role: "FINANCE" },
  { id: "CLIENT_APPROVED", label: "Client Approved", role: "CLIENT" },
  { id: "ACTIVE", label: "Active", role: "SYSTEM" }
];

function getWorkflowProgress(status: string) {
  if (status === "TERMINATED" || status === "CONTRACT_FINISHED") return WORKFLOW_STEPS.length;
  const idx = WORKFLOW_STEPS.findIndex(s => s.id === status);
  return idx >= 0 ? idx : 0;
}

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: employee, isLoading, isError } = useEmployee(id);
  const updateStatusMutation = useUpdateEmployeeStatus();

  // Get current user role to govern access
  const role = localStorage.getItem("role") ?? "HR";

  // Define tabs with strict departmental access controls
  const tabs = [
    { id: "overview", label: "Personal Info", icon: User, allowed: ["SUPER_ADMIN", "ADMIN", "HR", "MANAGER", "FINANCE", "INFRASTRUCTURE", "CLIENT"] },
    { id: "contract", label: "Contract", icon: FileText, allowed: ["SUPER_ADMIN", "ADMIN", "HR", "MANAGER", "FINANCE", "CLIENT"] },
    { id: "infrastructure", label: "Infrastructure", icon: HardHat, allowed: ["SUPER_ADMIN", "ADMIN", "HR", "MANAGER", "INFRASTRUCTURE", "FINANCE"] },
    { id: "payroll", label: "Payroll History", icon: Wallet, allowed: ["SUPER_ADMIN", "ADMIN", "FINANCE", "MANAGER", "HR"] },
    { id: "invoices", label: "Invoices", icon: FileText, allowed: ["SUPER_ADMIN", "ADMIN", "FINANCE", "MANAGER", "CLIENT"] },
    { id: "budget", label: "Budget Projections", icon: Calculator, allowed: ["SUPER_ADMIN", "ADMIN", "FINANCE", "MANAGER", "CLIENT"] },
    { id: "timeline", label: "Activity Timeline", icon: CircleDashed, allowed: ["SUPER_ADMIN", "ADMIN", "HR", "MANAGER", "FINANCE", "INFRASTRUCTURE"] },
    { id: "simulations", label: "Simulations", icon: Calculator, allowed: ["SUPER_ADMIN", "ADMIN", "HR", "CLIENT", "MANAGER", "FINANCE"] },
  ];

  const visibleTabs = tabs.filter(tab => tab.allowed.includes(role));
  
  const currentStepIdx = employee ? getWorkflowProgress(employee.status) : 0;

  const renderTabContent = () => {
    if (!employee) return <div>Employee not found</div>;
    const mappedEmployee = {
      ...employee,
      name: employee.fullName,
      role: employee.position || employee.department || "Consultant",
      client: employee.clientCompanyName || "No Assignment",
    };
    switch (activeTab) {
      case "overview": return <PersonalInfoTab employee={{ ...mappedEmployee, avatar: "https://i.pravatar.cc/150?u=" + employee.id }} />;
      case "contract": return <ContractTab role={role} employee={mappedEmployee} />;
      case "infrastructure": return <InfrastructureTab role={role} employee={mappedEmployee} />;
      case "payroll": return <PayrollTab role={role} employee={mappedEmployee} />;
      case "invoices": return <InvoicesTab employee={mappedEmployee} />;
      case "budget": return <BudgetTab employee={mappedEmployee} />;
      case "timeline": return <TimelineTab employee={mappedEmployee} />;
      case "simulations": return <SimulationsTab role={role} employee={mappedEmployee} />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <WorkspacePageShell title="Loading..." description="Fetching profile...">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-slate-500">Loading employee details...</p>
        </div>
      </WorkspacePageShell>
    );
  }

  if (isError || !employee) {
    return (
      <WorkspacePageShell title="Not Found" description="Employee not found">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-slate-500">The requested employee could not be found.</p>
        </div>
      </WorkspacePageShell>
    );
  }

  return (
    <WorkspacePageShell 
      title={employee.fullName} 
      description={`${employee.position || employee.department || "Consultant"} • ${employee.clientCompanyName || "No Assignment"}`}
      action={
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.id} className="flex items-center gap-1.5" title={step.label}>
                  {isCompleted ? (
                    <CheckCircle2 className={`h-4 w-4 ${isCurrent ? 'text-blue-600' : 'text-emerald-500'}`} />
                  ) : (
                    <CircleDashed className="h-4 w-4 text-slate-300" />
                  )}
                  <span className={isCurrent ? 'text-slate-900 font-semibold' : isCompleted ? 'text-slate-600' : 'text-slate-400'}>
                    {step.role}
                  </span>
                  {idx < WORKFLOW_STEPS.length - 1 && (
                    <div className={`h-px w-4 ${isCompleted ? 'bg-slate-300' : 'bg-slate-100'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
            Status: {employee.status.replace("_", " ")}
          </span>
        </div>
      }
    >
      <div className="mb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Directory
        </button>
      </div>

      {role === "CLIENT" && employee.status === "FINANCE_VALIDATED" && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex flex-col md:flex-row items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-1">Financial Proposal Ready</h3>
            <p className="text-sm text-blue-700 max-w-2xl">Please review the contract and simulations below. Once approved, the candidate will be officially active on your team.</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0 flex-shrink-0">
            <button 
              className="px-4 py-2 text-sm font-medium border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              onClick={() => {
                if(confirm("Are you sure you want to request a revision? HR and Finance will be notified.")) {
                  updateStatusMutation.mutate({ id: employee.id, status: "REVISION_REQUESTED" });
                }
              }}
              disabled={updateStatusMutation.isPending}
            >
              Request Revision
            </button>
            <button 
              className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors flex items-center disabled:opacity-50"
              onClick={() => {
                if(confirm("Approve this proposal and onboard the candidate?")) {
                  updateStatusMutation.mutate({ id: employee.id, status: "ACTIVE" });
                }
              }}
              disabled={updateStatusMutation.isPending}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Proposal
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in fade-in duration-500">
        
        {role === "CLIENT" && currentStepIdx < 3 ? (
          <div className="xl:col-span-4 flex flex-col items-center justify-center p-20 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
            <Calculator className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Proposal In Progress</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Our HR and Finance teams are currently preparing the contract and finalizing the financial simulation for this candidate. You will be notified as soon as the proposal is ready for your review.
            </p>
          </div>
        ) : (
          <>
            {/* Sidebar Navigation */}
            <div className="xl:col-span-1">
              <nav className="flex flex-col space-y-1">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="xl:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm min-h-[500px]">
            {renderTabContent()}
          </div>
        </div>
        </>
        )}
      </div>
    </WorkspacePageShell>
  );
}
