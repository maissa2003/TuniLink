import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, FileText, Eye, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

const generateInvoices = () => {
  const clients = ["TechCorp Inc.", "Global Solutions Ltd.", "Nexus Industries", "Apex Systems", "CloudScale Partners", "DataMinds", "FinServe Group"];
  const employees = ["Alexandre Dubois", "Marie Tremblay", "Jean-Baptiste P.", "Sarah Connor", "Ahmed Ben Ali", "Youssef Klibi"];
  const statuses = ["Paid", "Pending", "Overdue", "Cancelled"];
  
  return Array.from({ length: 30 }).map((_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = 3000 + Math.floor(Math.random() * 8000);
    const dateObj = new Date(2024, 9, Math.floor(Math.random() * 28) + 1);
    
    // Make older invoices more likely to be paid or overdue
    if (dateObj.getDate() < 10 && status === "Pending") dateObj.setDate(20);

    return {
      id: `INV-2024-${String(i + 1).padStart(3, '0')}`,
      client: clients[Math.floor(Math.random() * clients.length)],
      employee: employees[Math.floor(Math.random() * employees.length)],
      amount: amount.toFixed(2),
      currency: "CAD",
      status: status,
      date: dateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const initialData = generateInvoices();

export default function FinanceInvoices() {
  const [data] = useState(initialData);
  const [search, setSearch] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = data.filter(inv => 
    inv.id.toLowerCase().includes(search.toLowerCase()) || 
    inv.client.toLowerCase().includes(search.toLowerCase()) ||
    inv.employee.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Paid</Badge>;
      case "Pending": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">Pending</Badge>;
      case "Overdue": return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none">Overdue</Badge>;
      case "Cancelled": return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoices</h1>
          <p className="text-slate-500 mt-1">Manage client billing, view invoice details, and track payments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-200 bg-white">
            <Download className="mr-2 h-4 w-4 text-emerald-600" /> Export Excel
          </Button>
          <Button variant="outline" className="border-slate-200 bg-white">
            <FileText className="mr-2 h-4 w-4 text-rose-600" /> Export PDF
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="text" 
                  placeholder="Search invoices, clients, employees..." 
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Invoice Number</TableHead>
                  <TableHead className="font-semibold text-slate-700">Client</TableHead>
                  <TableHead className="font-semibold text-slate-700">Assigned Employee</TableHead>
                  <TableHead className="font-semibold text-slate-700">Date</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Amount</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? currentData.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-900">{inv.id}</TableCell>
                    <TableCell className="text-slate-600">{inv.client}</TableCell>
                    <TableCell className="text-slate-600">{inv.employee}</TableCell>
                    <TableCell className="text-slate-600">{inv.date}</TableCell>
                    <TableCell className="text-right font-medium text-slate-900">{inv.amount} {inv.currency}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(inv.status)}</TableCell>
                    <TableCell className="text-right">
                      <Sheet>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <SheetTrigger className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                <Eye className="mr-2 h-4 w-4 text-slate-500" /> View Details
                            </SheetTrigger>
                            <DropdownMenuItem className="cursor-pointer">
                              <Download className="mr-2 h-4 w-4 text-slate-500" /> Download PDF
                            </DropdownMenuItem>
                            {inv.status === "Pending" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-emerald-600 font-medium">Mark as Paid</DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        {/* Invoice Details Preview (Sheet) */}
                        <SheetContent className="sm:max-w-md overflow-y-auto">
                          <SheetHeader className="mb-6">
                            <SheetTitle>Invoice Details</SheetTitle>
                            <SheetDescription>Overview for {inv.id}</SheetDescription>
                          </SheetHeader>
                          
                          <div className="space-y-6">
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
                              <div>
                                <p className="text-sm text-slate-500">Amount Due</p>
                                <p className="text-2xl font-bold text-slate-900">{inv.amount} {inv.currency}</p>
                              </div>
                              {getStatusBadge(inv.status)}
                            </div>
                            
                            <div className="space-y-3 border-t border-slate-100 pt-4">
                              <h3 className="font-semibold text-slate-900">Information</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-slate-500 block mb-1">Client</span>
                                  <span className="font-medium text-slate-900">{inv.client}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500 block mb-1">Assigned Employee</span>
                                  <span className="font-medium text-slate-900">{inv.employee}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500 block mb-1">Issue Date</span>
                                  <span className="font-medium text-slate-900">{inv.date}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500 block mb-1">Due Date</span>
                                  <span className="font-medium text-slate-900">Oct 30, 2024</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 border-t border-slate-100 pt-4">
                              <h3 className="font-semibold text-slate-900">Line Items</h3>
                              <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
                                <div className="flex justify-between p-3 border-b border-slate-100 bg-slate-50 text-sm font-medium text-slate-500">
                                  <span>Description</span>
                                  <span>Total</span>
                                </div>
                                <div className="flex justify-between p-3 border-b border-slate-100 text-sm text-slate-700">
                                  <span>Base Payroll Services</span>
                                  <span>{Math.floor(Number(inv.amount) * 0.7).toFixed(2)} CAD</span>
                                </div>
                                <div className="flex justify-between p-3 border-b border-slate-100 text-sm text-slate-700">
                                  <span>Infrastructure Margin</span>
                                  <span>{Math.floor(Number(inv.amount) * 0.15).toFixed(2)} CAD</span>
                                </div>
                                <div className="flex justify-between p-3 text-sm text-slate-700">
                                  <span>Agency Margin</span>
                                  <span>{Math.floor(Number(inv.amount) * 0.15).toFixed(2)} CAD</span>
                                </div>
                                <div className="flex justify-between p-3 bg-slate-900 text-white font-medium">
                                  <span>Total</span>
                                  <span>{inv.amount} CAD</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                      No invoices match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
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
