import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WorkspacePageShell from "@/components/shared/WorkspacePageShell";
import { useLanguage } from "@/lib/useLanguage";
import { useEmployees, useOnboardEmployee } from "@/hooks/useEmployee";

export default function HrEmployees() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { data: employees = [], isLoading } = useEmployees();
  const onboardMutation = useOnboardEmployee();
  
  const [open, setOpen] = useState(params.get("new") === "1");
  const [formData, setFormData] = useState({
    name: params.get("name") || "",
    role: "",
    email: "",
  });

  useEffect(() => {
    if (params.get("new") === "1") setOpen(true);
  }, [params]);

  const handleClose = (val: boolean) => {
    setOpen(val);
    if (!val) {
      const newParams = new URLSearchParams(params);
      newParams.delete("new");
      newParams.delete("name");
      setParams(newParams, { replace: true });
    }
  };

  const handleSave = () => {
    onboardMutation.mutate({
      fullName: formData.name || "New Employee",
      email: formData.email,
      department: formData.role || "Engineering",
    }, {
      onSuccess: (newEmployee) => {
        handleClose(false);
        // Navigate to new profile
        const userRole = localStorage.getItem("role");
        const prefix = userRole === "ADMIN" ? "/admin" : "/workspace";
        navigate(`${prefix}/employee-profile/${newEmployee.id}`);
      }
    });
  };

  return (
    <WorkspacePageShell title={t("hr.employees.title")} description={t("hr.employees.description")}>
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("hr.employees.list")}</CardTitle>
            <CardDescription>{t("hr.employees.listDesc")}</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger render={<Button>{t("hr.employees.add")}</Button>} />
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>Onboard New Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <Label>Candidate Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Department/Role</Label>
                  <Input value={formData.role} placeholder="e.g. Engineering, Sales..." onChange={e => setFormData({ ...formData, role: e.target.value })} />
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={handleSave}
                  disabled={onboardMutation.isPending}
                >
                  {onboardMutation.isPending ? "Creating..." : "Create Profile & Start Workflow"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-slate-500 py-4 text-center">Loading employee directory...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.name")}</TableHead>
                  <TableHead>{t("hr.fields.position")}</TableHead>
                  <TableHead>{t("hr.fields.client")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => {
                      const role = localStorage.getItem("role");
                      const prefix = role === "ADMIN" ? "/admin" : "/workspace";
                      navigate(`${prefix}/employee-profile/${item.id}`);
                    }}
                  >
                    <TableCell className="font-medium text-slate-900">{item.fullName}</TableCell>
                    <TableCell className="text-slate-600">{item.position || item.department || "Consultant"}</TableCell>
                    <TableCell className="text-slate-600">{item.clientCompanyName || "No Client Assigned"}</TableCell>
                    <TableCell>
                      <Badge className={item.status === "ACTIVE" ? "bg-green-100 text-green-700 hover:bg-green-100" : item.status === "PENDING" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" : "bg-blue-100 text-blue-700 hover:bg-blue-100"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">{item.email || "—"}</TableCell>
                  </TableRow>
                ))}
                {employees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                      No employees found. Start by onboarding one!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </WorkspacePageShell>
  );
}
