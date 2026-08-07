import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { usePayrollPreview, useValidatePayroll, usePayrollHistory } from "@/hooks/useEmployee";
import { toast } from "sonner";

export default function PayrollTab({ role, employee }: { role: string, employee: any }) {
  const isFinance = role === "FINANCE" || role === "ADMIN" || role === "SUPER_ADMIN";

  const { data: calc, isLoading, error } = usePayrollPreview(employee.id);
  const validateMutation = useValidatePayroll();
  const { data: history } = usePayrollHistory(employee.id);

  const handleValidate = () => {
    validateMutation.mutate(employee.id, {
      onSuccess: () => {
        toast.success("Payroll successfully validated and invoice generated!");
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || err.message || "Failed to validate payroll";
        toast.error(msg);
      }
    });
  };

  if (isLoading) {
    return <div className="text-sm text-slate-500 py-4">Calculating payroll preview...</div>;
  }

  if (error || !calc) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-6 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-amber-800">Payroll Calculation Unavailable</h4>
          <p className="text-sm text-amber-700 mt-1">
            Please verify that this employee has an active contract configured. HR must create a contract before Finance can validate payroll.
          </p>
        </div>
      </div>
    );
  }

  // Check if this month's payroll is already validated in history
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const isAlreadyValidated = history?.some(record => record.periodMonth.startsWith(currentMonthStr) && record.status === 'VALIDATED');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Payroll & Cost Breakdown</h3>
          <p className="text-sm text-slate-500">Automatically calculated from HR and Infrastructure inputs.</p>
        </div>
        {isFinance && (
          <Button 
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleValidate}
            disabled={validateMutation.isPending || isAlreadyValidated}
          >
            <CheckCircle className="h-4 w-4" /> 
            {isAlreadyValidated ? "Payroll Validated" : validateMutation.isPending ? "Validating..." : "Validate Payroll"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Payroll Breakdown */}
        <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
            <h4 className="font-semibold text-slate-900">Employee Payslip (Estimated)</h4>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Gross Salary</span>
              <span className="font-medium text-slate-900">{calc.grossSalary?.toFixed(2)} TND</span>
            </div>
            <div className="flex justify-between items-center text-sm text-red-600">
              <span>Employee CNSS (9.18%)</span>
              <span>- {calc.employeeCnss?.toFixed(2)} TND</span>
            </div>
            <div className="flex justify-between items-center text-sm text-red-600 border-b border-slate-100 pb-4">
              <span>Income Tax (IRPP)</span>
              <span>- {calc.irppTax?.toFixed(2)} TND</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold text-slate-900">Net Salary</span>
              <span className="text-xl font-bold text-emerald-600">{calc.netSalary?.toFixed(2)} TND</span>
            </div>
          </div>
        </div>

        {/* Employer Cost Breakdown */}
        <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
            <h4 className="font-semibold text-slate-900">Total Employer Cost</h4>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Gross Salary</span>
              <span className="font-medium text-slate-900">{calc.grossSalary?.toFixed(2)} TND</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Employer CNSS (16.57%)</span>
              <span className="font-medium text-slate-900">+{calc.employerCnss?.toFixed(2)} TND</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Infrastructure Costs</span>
              <span className="font-medium text-slate-900">+{calc.infraCostTotal?.toFixed(2)} TND</span>
            </div>
            
            <div className="border-t border-slate-100 my-2 pt-2" />
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Recruitment Margin</span>
              <span className="font-medium text-indigo-600">+{calc.recruitmentMargin?.toFixed(2)} TND</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-4">
              <span className="text-slate-500">Infra Margin</span>
              <span className="font-medium text-indigo-600">+{calc.infraMargin?.toFixed(2)} TND</span>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold text-slate-900">Total Cost (TND)</span>
              <span className="text-lg font-bold text-slate-900">{calc.totalEmployerCostTnd?.toFixed(2)} TND</span>
            </div>
            
            <div className="flex justify-between items-center text-sm text-amber-700 mt-2">
              <span>Exchange Rate Used</span>
              <span>1 TND = {calc.exchangeRateUsed} CAD</span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-2">
              <span className="font-bold text-slate-900 uppercase tracking-wide">Final Client Invoice</span>
              <span className="text-2xl font-black text-blue-700">
                {calc.finalInvoiceCad?.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* History section */}
      {history && history.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold text-slate-900 mb-3">Validation History</h4>
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Salary</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Employer Cost (TND)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Billed (CAD)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Validated By</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {history.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{record.periodMonth}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-600">{record.grossSalary?.toFixed(2)} TND</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-600">{record.totalEmployerCostTnd?.toFixed(2)} TND</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-blue-600">{record.finalInvoiceCad?.toFixed(2)} CAD</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{record.validatedByName || "System"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
