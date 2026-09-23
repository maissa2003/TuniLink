import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, X, PlusCircle } from "lucide-react";
import { useActiveContract, useCreateContract, useUpdateEmployeeStatus } from "@/hooks/useEmployee";

export default function ContractTab({ role, employee }: { role: string, employee: any }) {
  const isHr = role === "HR" || role === "ADMIN" || role === "SUPER_ADMIN";
  
  const { data: activeContract, isLoading } = useActiveContract(employee.id);
  const createContractMutation = useCreateContract();
  const updateStatusMutation = useUpdateEmployeeStatus();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    grossSalary: 0,
    bonus: 0,
    contractType: "CDI" as "CDI" | "CDD" | "FREELANCE",
    startDate: "",
    endDate: "",
    position: "",
  });

  // Sync form data with active contract when loaded or editing starts
  useEffect(() => {
    if (activeContract) {
      setFormData({
        grossSalary: activeContract.grossSalary || 0,
        bonus: activeContract.bonus || 0,
        contractType: activeContract.contractType || "CDI",
        startDate: activeContract.startDate || "",
        endDate: activeContract.endDate || "",
        position: activeContract.position || employee.role || "",
      });
    } else {
      setFormData({
        grossSalary: 0,
        bonus: 0,
        contractType: "CDI",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        position: employee.role || "",
      });
    }
  }, [activeContract, employee]);

  const handleSave = () => {
    createContractMutation.mutate({
      employeeId: employee.id,
      data: {
        contractType: formData.contractType,
        position: formData.position || employee.role || "Consultant",
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        grossSalary: formData.grossSalary,
        bonus: formData.bonus || undefined,
      }
    }, {
      onSuccess: () => {
        setIsEditing(false);
        // Advance workflow status if it's currently RECRUITED
        if (employee.status === "RECRUITED") {
          updateStatusMutation.mutate({ id: employee.id, status: "CONTRACT_CREATED" });
        }
      }
    });
  };

  if (isLoading) {
    return <div className="text-sm text-slate-500 py-4">Loading contract details...</div>;
  }

  const hasContract = !!activeContract;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Employment Contract</h3>
          <p className="text-sm text-slate-500">Official position, dates, and salary details.</p>
        </div>
        {isHr && !isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2" 
            onClick={() => setIsEditing(true)}
          >
            {hasContract ? <Edit className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {hasContract ? "Edit Contract" : "Create Contract"}
          </Button>
        )}
        {isEditing && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button 
              size="sm" 
              className="bg-blue-600 text-white hover:bg-blue-700" 
              onClick={handleSave}
              disabled={createContractMutation.isPending}
            >
              <Save className="h-4 w-4 mr-1" /> {createContractMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </div>

      {!hasContract && !isEditing ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
          <p className="text-slate-500 text-sm mb-4">No active employment contract exists for this employee.</p>
          {isHr && (
            <Button size="sm" onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Create Contract Now
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
            <div className="grid grid-cols-3 p-4">
              <div className="col-span-1 text-sm font-medium text-slate-500">Position</div>
              <div className="col-span-2 text-sm text-slate-900 font-medium">
                {isEditing ? (
                  <Input 
                    value={formData.position} 
                    onChange={e => setFormData({ ...formData, position: e.target.value })} 
                    className="h-8 w-64 bg-white" 
                  />
                ) : (
                  activeContract?.position || employee.role
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 p-4 bg-slate-50">
              <div className="col-span-1 text-sm font-medium text-slate-500">Contract Type</div>
              <div className="col-span-2 text-sm text-slate-900">
                {isEditing ? (
                  <Select 
                    value={formData.contractType} 
                    onValueChange={v => setFormData({ ...formData, contractType: v as any })}
                  >
                    <SelectTrigger className="h-8 w-64 bg-white">
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDI">CDI (Permanent)</SelectItem>
                      <SelectItem value="CDD">CDD (Fixed Term)</SelectItem>
                      <SelectItem value="FREELANCE">FREELANCE</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  activeContract?.contractType
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 p-4">
              <div className="col-span-1 text-sm font-medium text-slate-500">Start Date</div>
              <div className="col-span-2 text-sm text-slate-900">
                {isEditing ? (
                  <Input 
                    type="date" 
                    value={formData.startDate} 
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
                    className="h-8 w-64 bg-white" 
                  />
                ) : (
                  activeContract?.startDate
                )}
              </div>
            </div>

            {(formData.contractType === "CDD" || activeContract?.endDate) && (
              <div className="grid grid-cols-3 p-4 bg-slate-50">
                <div className="col-span-1 text-sm font-medium text-slate-500">End Date</div>
                <div className="col-span-2 text-sm text-slate-900">
                  {isEditing ? (
                    <Input 
                      type="date" 
                      value={formData.endDate} 
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })} 
                      className="h-8 w-64 bg-white" 
                    />
                  ) : (
                    activeContract?.endDate || "N/A"
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 p-4">
              <div className="col-span-1 text-sm font-medium text-slate-500">Assigned Client</div>
              <div className="col-span-2 text-sm text-slate-900 font-medium">
                {employee.client}
              </div>
            </div>
          </div>

          <h4 className="text-md font-semibold text-slate-900 mt-6 mb-2">Compensation</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 p-4 bg-white">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Salary (Monthly)</p>
              {isEditing ? (
                <div className="flex items-center gap-2 mt-2">
                  <Input 
                    type="number" 
                    value={formData.grossSalary} 
                    onChange={e => setFormData({ ...formData, grossSalary: Number(e.target.value) })} 
                    className="w-32 bg-white" 
                  />
                  <span className="text-sm font-medium text-slate-500">TND</span>
                </div>
              ) : (
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {activeContract?.grossSalary?.toLocaleString() || 0} <span className="text-sm font-medium text-slate-500">TND</span>
                </p>
              )}
            </div>
            <div className="rounded-lg border border-slate-200 p-4 bg-white">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Annual Bonus</p>
              {isEditing ? (
                <div className="flex items-center gap-2 mt-2">
                  <Input 
                    type="number" 
                    value={formData.bonus} 
                    onChange={e => setFormData({ ...formData, bonus: Number(e.target.value) })} 
                    className="w-32 bg-white" 
                  />
                  <span className="text-sm font-medium text-slate-500">TND</span>
                </div>
              ) : (
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {activeContract?.bonus?.toLocaleString() || 0} <span className="text-sm font-medium text-slate-500">TND</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
