import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus, Save, CheckCircle2, X,
  Laptop, Building2, Wifi, Zap, MonitorCheck, Cloud, Wrench, Package, Calendar, Trash2
} from "lucide-react";
import { useInfrastructureCosts, useAddInfrastructureCost, useDeleteInfrastructureCost, useCompleteAssignment } from "@/hooks/useEmployee";
import { InfrastructureCostCategory, CreateInfrastructureCostDto } from "@/api/infrastructure";

const categories = [
  { apiKey: "LAPTOP" as InfrastructureCostCategory, label: "Laptop", icon: Laptop, color: "#8b5cf6", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700" },
  { apiKey: "OFFICE_RENT" as InfrastructureCostCategory, label: "Office Rent", icon: Building2, color: "#3b82f6", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  { apiKey: "INTERNET" as InfrastructureCostCategory, label: "Internet", icon: Wifi, color: "#f97316", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
  { apiKey: "ELECTRICITY" as InfrastructureCostCategory, label: "Electricity", icon: Zap, color: "#10b981", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  { apiKey: "MS_LICENSE" as InfrastructureCostCategory, label: "MS License", icon: MonitorCheck, color: "#f59e0b", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  { apiKey: "CLOUD_SERVICES" as InfrastructureCostCategory, label: "Cloud Services", icon: Cloud, color: "#06b6d4", bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700" },
  { apiKey: "IT_SUPPORT" as InfrastructureCostCategory, label: "IT Support", icon: Wrench, color: "#ec4899", bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700" },
  { apiKey: "OTHER" as InfrastructureCostCategory, label: "Other", icon: Package, color: "#64748b", bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700" },
];

export default function InfrastructureTab({ role, employee }: { role: string, employee: any }) {
  const isInfra = role === "INFRASTRUCTURE" || role === "ADMIN" || role === "SUPER_ADMIN";
  
  const { data: dbCosts, isLoading } = useInfrastructureCosts(employee.id);
  const addCostMutation = useAddInfrastructureCost();
  const deleteCostMutation = useDeleteInfrastructureCost(employee.id);
  const completeAssignmentMutation = useCompleteAssignment(employee.id);

  const [isAdding, setIsAdding] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);
  
  const [newResource, setNewResource] = useState<CreateInfrastructureCostDto>({
    category: "LAPTOP",
    amount: 0,
    resourceName: "",
    description: "",
    assignmentDate: new Date().toISOString().split('T')[0]
  });

  const handleAdd = () => {
    addCostMutation.mutate({ employeeId: employee.id, data: newResource }, {
      onSuccess: () => {
        setIsAdding(false);
        setSavedBanner(true);
        setTimeout(() => setSavedBanner(false), 3000);
        setNewResource({
          category: "LAPTOP",
          amount: 0,
          resourceName: "",
          description: "",
          assignmentDate: new Date().toISOString().split('T')[0]
        });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this resource?")) {
      deleteCostMutation.mutate(id);
    }
  };

  const total = dbCosts?.reduce((sum, item) => sum + item.amount, 0) || 0;

  if (isLoading) {
    return <div className="text-sm text-slate-500 py-4">Loading infrastructure details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Assigned Resources</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Active infrastructure resources and monthly costs.
          </p>
        </div>
        {isInfra && !isAdding && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-2" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4" /> Assign Resource
            </Button>
            {employee.status === "CONTRACT_CREATED" && (
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => {
                  if (employee.assignmentId) {
                    completeAssignmentMutation.mutate(employee.assignmentId);
                  } else {
                    alert("No assignment linked to this employee.");
                  }
                }}
                disabled={completeAssignmentMutation.isPending || !employee.assignmentId}
              >
                Submit to Finance
              </Button>
            )}
          </div>
        )}
      </div>

      {savedBanner && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 animate-in fade-in duration-300">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
          Resource assigned successfully.
        </div>
      )}

      {isAdding && isInfra && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-blue-900">New Resource Assignment</h4>
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)} className="h-8 w-8 p-0"><X className="h-4 w-4" /></Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <select 
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                value={newResource.category}
                onChange={e => setNewResource({...newResource, category: e.target.value as InfrastructureCostCategory})}
              >
                {categories.map(c => <option key={c.apiKey} value={c.apiKey}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <Label>Resource Name</Label>
              <Input className="mt-1" placeholder="e.g. Dell Latitude 5540" value={newResource.resourceName} onChange={e => setNewResource({...newResource, resourceName: e.target.value})} />
            </div>
            <div>
              <Label>Monthly Cost (TND)</Label>
              <Input className="mt-1" type="number" min="0" value={newResource.amount || ''} onChange={e => setNewResource({...newResource, amount: Number(e.target.value)})} />
            </div>
            <div>
              <Label>Assignment Date</Label>
              <Input className="mt-1" type="date" value={newResource.assignmentDate} onChange={e => setNewResource({...newResource, assignmentDate: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <Label>Description / Notes</Label>
              <Input className="mt-1" placeholder="Optional details..." value={newResource.description} onChange={e => setNewResource({...newResource, description: e.target.value})} />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button onClick={handleAdd} disabled={addCostMutation.isPending || !newResource.amount || !newResource.resourceName}>
              <Save className="h-4 w-4 mr-2" /> Assign Resource
            </Button>
          </div>
        </div>
      )}

      {dbCosts && dbCosts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dbCosts.map(cost => {
            const cat = categories.find(c => c.apiKey === cost.category) || categories[categories.length - 1];
            const Icon = cat.icon;
            return (
              <div key={cost.id} className="relative group rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                {isInfra && (
                  <button 
                    onClick={() => handleDelete(cost.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.bg} border ${cat.border}`}>
                    <Icon className="h-5 w-5" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{cost.resourceName || cat.label}</h4>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${cat.text}`}>{cat.label}</span>
                  </div>
                </div>
                
                {cost.description && (
                  <p className="mt-3 text-sm text-slate-600 line-clamp-2">{cost.description}</p>
                )}
                
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {cost.assignmentDate ? new Date(cost.assignmentDate).toLocaleDateString() : '-'}
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {cost.amount.toLocaleString()} <span className="text-xs font-medium text-slate-500">TND/mo</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500 bg-slate-50">
          <Package className="mx-auto h-8 w-8 text-slate-400 mb-3" />
          <p>No resources assigned yet.</p>
        </div>
      )}

      {dbCosts && dbCosts.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-4 text-white shadow-md">
          <div>
            <p className="text-xs font-semibold opacity-80 uppercase tracking-widest">Total Infrastructure Cost</p>
            <p className="text-sm opacity-70 mt-0.5">Sum of all active assigned resources</p>
          </div>
          <p className="text-3xl font-black">{total.toLocaleString()} <span className="text-base font-semibold opacity-80">TND / mo</span></p>
        </div>
      )}
    </div>
  );
}
