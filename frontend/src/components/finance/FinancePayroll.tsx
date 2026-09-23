import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpRight } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployee";
import { Badge } from "@/components/ui/badge";

export default function FinancePayroll() {
  const navigate = useNavigate();
  const { data: employees = [], isLoading } = useEmployees();
  const [search, setSearch] = useState("");

  // Pagination (simple client side)
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = employees.filter(emp => 
    emp.fullName.toLowerCase().includes(search.toLowerCase()) || 
    emp.employeeNumber.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleRowClick = (empId: number) => {
    const role = localStorage.getItem("role");
    const prefix = role === "ADMIN" ? "/admin" : "/workspace";
    navigate(`${prefix}/employee-profile/${empId}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payroll Costs</h1>
        <p className="text-slate-500 mt-1">Manage employee compensation, taxes, and total employer costs.</p>
      </div>

      <Card className="shadow-sm border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg text-slate-800">Employee Payroll Directory</CardTitle>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="text" 
                  placeholder="Search employee..." 
                  className="pl-9 bg-slate-50 border-slate-200" 
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <Button variant="outline" size="icon" className="border-slate-200">
                <Filter className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-sm text-slate-500 py-8 text-center">Loading payroll data...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700">Employee</TableHead>
                    <TableHead className="font-semibold text-slate-700">Contract Type</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Gross Salary (TND)</TableHead>
                    <TableHead className="font-semibold text-slate-700">Department</TableHead>
                    <TableHead className="font-semibold text-slate-700">Workflow Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length > 0 ? currentData.map((emp) => (
                    <TableRow 
                      key={emp.id} 
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(emp.id)}
                    >
                      <TableCell>
                        <div className="font-medium text-slate-900">{emp.fullName}</div>
                        <div className="text-xs text-slate-500">{emp.employeeNumber}</div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {emp.contractType ? (
                          <Badge variant="outline" className="text-slate-700 font-medium">
                            {emp.contractType}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No Active Contract</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-slate-900 font-medium">
                        {emp.contractGrossSalary ? (
                          `${emp.contractGrossSalary.toLocaleString()} TND`
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-slate-600">{emp.position || emp.department || "Consultant"}</TableCell>
                      <TableCell>
                        <Badge className={
                          emp.status === "ACTIVE" 
                            ? "bg-green-100 text-green-700 hover:bg-green-100" 
                            : emp.status === "FINANCIAL_VALIDATED"
                            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                        }>
                          {emp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                        No employees found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <div className="text-sm text-slate-500">
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <div className="text-sm font-medium px-2">
                Page {page} of {totalPages || 1}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
