import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, FileEdit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Fake Data
const CATEGORIES = ["Office", "Internet", "Electricity", "Water", "Rent", "PC", "Support", "Admin", "HR", "Software Licenses", "Cloud", "Others"];
const generateInfraCosts = () => {
  const items = [
    { name: "AWS Hosting", cat: "Cloud", cost: 1250.00, desc: "Production & Staging environments" },
    { name: "Tunis Main Office Rent", cat: "Rent", cost: 3500.00, desc: "Monthly lease" },
    { name: "Google Workspace", cat: "Software Licenses", cost: 450.00, desc: "Email and docs for 50 users" },
    { name: "Topnet Fiber", cat: "Internet", cost: 120.00, desc: "High-speed office internet" },
    { name: "STEG Bill", cat: "Electricity", cost: 340.00, desc: "Monthly power consumption" },
    { name: "SONEDE Bill", cat: "Water", cost: 45.00, desc: "Monthly water consumption" },
    { name: "Dell Laptops Lease", cat: "PC", cost: 2100.00, desc: "Hardware for new hires" },
    { name: "HubSpot CRM", cat: "Software Licenses", cost: 800.00, desc: "Sales and Marketing tools" },
    { name: "IT Support Contract", cat: "Support", cost: 600.00, desc: "External IT maintenance" },
    { name: "Office Supplies", cat: "Office", cost: 150.00, desc: "Paper, pens, whiteboard markers" },
    { name: "Legal Consulting", cat: "Admin", cost: 1200.00, desc: "Contract reviews" },
    { name: "Recruitment Ads", cat: "HR", cost: 400.00, desc: "LinkedIn and local job boards" },
    { name: "Azure Backup", cat: "Cloud", cost: 300.00, desc: "Database redundancy" },
    { name: "Montreal Office Rent", cat: "Rent", cost: 4200.00, desc: "Canadian HQ lease" },
    { name: "Bell Internet", cat: "Internet", cost: 180.00, desc: "Montreal office connection" },
    { name: "Cleaning Services", cat: "Office", cost: 400.00, desc: "Daily cleaning for Tunis office" },
    { name: "Accounting Firm", cat: "Admin", cost: 950.00, desc: "Monthly bookkeeping" },
    { name: "Team Building", cat: "HR", cost: 600.00, desc: "Quarterly dinner" },
    { name: "Jira/Confluence", cat: "Software Licenses", cost: 250.00, desc: "Project management" },
    { name: "Miscellaneous", cat: "Others", cost: 200.00, desc: "Petty cash" },
  ];

  return items.map((item, index) => ({
    id: `INF-${1000 + index}`,
    name: item.name,
    category: item.cat,
    cost: item.cost.toFixed(2),
    date: new Date(2024, 9, Math.floor(Math.random() * 28) + 1).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
    description: item.desc,
  }));
};

const initialData = generateInfraCosts();

export default function FinanceInfrastructure() {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      Cloud: "bg-blue-100 text-blue-700 border-blue-200",
      Rent: "bg-purple-100 text-purple-700 border-purple-200",
      "Software Licenses": "bg-indigo-100 text-indigo-700 border-indigo-200",
      Internet: "bg-teal-100 text-teal-700 border-teal-200",
      Electricity: "bg-amber-100 text-amber-700 border-amber-200",
      Water: "bg-cyan-100 text-cyan-700 border-cyan-200",
      PC: "bg-slate-100 text-slate-700 border-slate-200",
      Support: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Office: "bg-orange-100 text-orange-700 border-orange-200",
      Admin: "bg-rose-100 text-rose-700 border-rose-200",
      HR: "bg-pink-100 text-pink-700 border-pink-200",
      Others: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[cat] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Infrastructure Costs</h1>
        <p className="text-slate-500 mt-1">Manage all operational and facility expenses.</p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg">Operating Expenses</CardTitle>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="text" 
                  placeholder="Search expenses..." 
                  className="pl-9 bg-slate-50 border-slate-200" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val ?? "All")}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white shadow">
                  <Plus className="mr-2 h-4 w-4" /> Add Expense
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Infrastructure Expense</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Expense Name</Label>
                      <Input placeholder="e.g., Google Cloud Storage" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Monthly Cost ($)</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input placeholder="Brief details about this expense" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsAddOpen(false)} className="bg-purple-600 hover:bg-purple-700 text-white">Save Expense</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Expense Name</TableHead>
                  <TableHead className="font-semibold text-slate-700">Category</TableHead>
                  <TableHead className="font-semibold text-slate-700">Description</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Monthly Cost</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.id} • {item.date}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-medium ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 truncate max-w-[250px]">{item.description}</TableCell>
                    <TableCell className="text-right font-medium text-slate-900">${item.cost}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-purple-600">
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-rose-600" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                      No matching expenses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
