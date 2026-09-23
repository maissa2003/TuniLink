import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Save } from "lucide-react";
import { calculateEmployerCost, DEFAULT_ERP_CONFIG, EmployeeContract, InfrastructureCosts } from "@/lib/business-logic/payrollEngine";
import { useActiveContract, useInfrastructureCosts } from "@/hooks/useEmployee";
import { toast } from "sonner";

export default function SimulationsTab({ employee }: { role: string, employee: any }) {
  const { data: activeContract } = useActiveContract(employee.id);
  const { data: dbCosts } = useInfrastructureCosts(employee.id);

  // Map database contract and infra costs to payrollEngine types
  const currentContract: EmployeeContract = {
    grossSalary: activeContract?.grossSalary || 0,
    bonus: activeContract?.bonus || 0,
  };

  const currentInfraCosts: InfrastructureCosts = {
    laptopCost: 0,
    officeRent: 0,
    internet: 0,
    electricity: 0,
    softwareLicenses: 0,
    cloudServices: 0,
    itSupport: 0,
    other: 0,
  };

  if (dbCosts) {
    dbCosts.forEach((item) => {
      if (item.category === "LAPTOP") currentInfraCosts.laptopCost = item.amount;
      if (item.category === "OFFICE_RENT") currentInfraCosts.officeRent = item.amount;
      if (item.category === "INTERNET") currentInfraCosts.internet = item.amount;
      if (item.category === "ELECTRICITY") currentInfraCosts.electricity = item.amount;
      if (item.category === "MS_LICENSE") currentInfraCosts.softwareLicenses = item.amount;
      if (item.category === "CLOUD_SERVICES") currentInfraCosts.cloudServices = item.amount;
      if (item.category === "IT_SUPPORT") currentInfraCosts.itSupport = item.amount;
      if (item.category === "OTHER") currentInfraCosts.other = item.amount;
    });
  }

  const currentCost = calculateEmployerCost(currentContract, currentInfraCosts, DEFAULT_ERP_CONFIG);

  const [simulatedGross, setSimulatedGross] = useState(currentContract.grossSalary);
  const [simulatedInfra, setSimulatedInfra] = useState(currentCost.totalInfrastructureCost);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Sync inputs with loaded DB data
  useEffect(() => {
    if (activeContract) {
      setSimulatedGross(activeContract.grossSalary);
    }
  }, [activeContract]);

  useEffect(() => {
    if (dbCosts) {
      setSimulatedInfra(currentCost.totalInfrastructureCost);
    }
  }, [dbCosts, currentCost.totalInfrastructureCost]);

  // Simulated values
  const simulatedContract = { grossSalary: simulatedGross, bonus: currentContract.bonus };
  const simulatedInfraCosts = { laptopCost: simulatedInfra, officeRent: 0, internet: 0, electricity: 0, softwareLicenses: 0, cloudServices: 0, itSupport: 0, other: 0 };
  const baseSimulatedCost = calculateEmployerCost(simulatedContract, simulatedInfraCosts, DEFAULT_ERP_CONFIG);

  // Apply discount logic
  const discountedTotalTnd = baseSimulatedCost.totalEmployerCost * (1 - discountPercent / 100);
  const simulatedCostCad = discountedTotalTnd * DEFAULT_ERP_CONFIG.globalExchangeRateTndToCad;

  const diff = discountedTotalTnd - currentCost.totalEmployerCost;
  const diffPercentage = currentCost.totalEmployerCost > 0 
    ? (diff / currentCost.totalEmployerCost) * 100 
    : 0;

  const handleSaveScenario = () => {
    toast.success("Simulation scenario saved to session drafts.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Salary Simulations</h3>
          <p className="text-sm text-slate-500">Run "what-if" scenarios without modifying the real contract.</p>
        </div>
        <Button onClick={handleSaveScenario} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="h-4 w-4" /> Save Scenario
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Panel */}
        <div className="col-span-1 rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-slate-500" /> Scenario Parameters
            </h4>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Gross Salary (TND)</label>
              <input 
                type="number" 
                value={simulatedGross}
                onChange={(e) => setSimulatedGross(Number(e.target.value))}
                className="w-full p-2.5 rounded-md border border-slate-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Infra Costs (TND)</label>
              <input 
                type="number" 
                value={simulatedInfra}
                onChange={(e) => setSimulatedInfra(Number(e.target.value))}
                className="w-full p-2.5 rounded-md border border-slate-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              />
            </div>
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Client Discount ({discountPercent}%)
              </label>
              <input 
                type="range" 
                min="0" max="25" step="1"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-slate-500 mt-1">Applies to the final billed cost. Used for loyalty or volume discounts.</p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-span-2 rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
            <h4 className="font-semibold text-slate-900">Simulation Results</h4>
            {diff !== 0 && (
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${diff > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {diff > 0 ? '+' : ''}{diff.toFixed(0)} TND ({diffPercentage.toFixed(1)}%)
              </span>
            )}
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 font-medium">Metric</th>
                  <th className="px-5 py-3 font-medium text-right">Current Contract</th>
                  <th className="px-5 py-3 font-medium text-right text-blue-700">Simulated Scenario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-5 py-4 font-medium text-slate-700">Gross Salary</td>
                  <td className="px-5 py-4 text-right">{currentCost.payroll.grossSalary.toFixed(2)}</td>
                  <td className="px-5 py-4 text-right font-medium text-blue-700">{baseSimulatedCost.payroll.grossSalary.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-slate-700">Net Salary (Employee Take-home)</td>
                  <td className="px-5 py-4 text-right">{currentCost.payroll.netSalary.toFixed(2)}</td>
                  <td className="px-5 py-4 text-right font-medium text-emerald-600">{baseSimulatedCost.payroll.netSalary.toFixed(2)}</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="px-5 py-4 font-medium text-slate-700">Infrastructure Costs</td>
                  <td className="px-5 py-4 text-right">{currentCost.totalInfrastructureCost.toFixed(2)}</td>
                  <td className="px-5 py-4 text-right font-medium text-blue-700">{baseSimulatedCost.totalInfrastructureCost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-slate-700">Client Discount</td>
                  <td className="px-5 py-4 text-right">—</td>
                  <td className="px-5 py-4 text-right font-medium text-amber-600">-{discountPercent}%</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-bold text-slate-900">Total Employer Cost (Final Billed TND)</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900">{currentCost.totalEmployerCost.toFixed(2)}</td>
                  <td className="px-5 py-4 text-right font-bold text-blue-700">{discountedTotalTnd.toFixed(2)}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-5 py-4 font-black text-slate-900 uppercase tracking-wider">Final Invoice CAD</td>
                  <td className="px-5 py-4 text-right font-black text-slate-900">{currentCost.finalInvoiceCad.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</td>
                  <td className="px-5 py-4 text-right font-black text-blue-700">{simulatedCostCad.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
