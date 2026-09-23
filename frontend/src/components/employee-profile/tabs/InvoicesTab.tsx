import { useEmployeeInvoices } from "@/hooks/useEmployee";
import { FileText, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function InvoicesTab({ employee }: { employee: any }) {
  const { data: invoices, isLoading } = useEmployeeInvoices(employee.id);

  if (isLoading) return <div className="text-sm text-slate-500 py-4">Loading invoices...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Invoices</h3>
        <p className="text-sm text-slate-500 mt-0.5">Billing history and generated invoices for this employee.</p>
      </div>

      {invoices && invoices.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount (CAD)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{inv.periodMonth}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">${inv.netAmountCad?.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                      inv.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                      inv.status === 'DRAFT' ? 'bg-slate-100 text-slate-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {inv.status === 'PAID' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {inv.status === 'SENT' && <Clock className="w-3 h-3 mr-1" />}
                      {inv.status === 'OVERDUE' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full">
                      <Download className="w-4 h-4 mr-1" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500 bg-slate-50">
          <FileText className="mx-auto h-8 w-8 text-slate-400 mb-3" />
          <p>No invoices generated yet.</p>
        </div>
      )}
    </div>
  );
}
