import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import UserStatistics from "@/components/users/UserStatistics";
import UserFilters from "@/components/users/UserFilters";
import UsersTable from "@/components/users/UsersTable";
import CreateUserDialog from "@/components/users/CreateUserDialog";
import EditUserDialog from "@/components/users/EditUserDialog";
import DeleteUserDialog from "@/components/users/DeleteUserDialog";
import { UserRowData } from "@/components/users/UserRow";
import api from "@/api/axios";
import { useLanguage } from "@/lib/useLanguage";

interface Company {
  id: number;
  name: string;
  type: string;
}

export default function UsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserRowData[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [company, setCompany] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const [createOpen, setCreateOpen] = useState(false);
  const [defaultRole, setDefaultRole] = useState<string | undefined>();
  const [editTarget, setEditTarget] = useState<UserRowData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRowData | null>(null);
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { openCreate?: boolean; defaultRole?: string } | null;
    if (state?.openCreate) {
      setCreateOpen(true);
      setDefaultRole(state.defaultRole);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, companiesRes] = await Promise.all([
        api.get("/users"),
        api.get("/companies"),
      ]);
      setUsers(usersRes.data);
      setCompanies(companiesRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = role === "ALL" || u.role === role;
      const matchesCompany =
        company === "ALL" || (u.companyId != null && u.companyId.toString() === company);
      const matchesStatus = status === "ALL" || u.status === status;
      return matchesSearch && matchesRole && matchesCompany && matchesStatus;
    });
  }, [users, search, role, company, status]);

  const resetFilters = () => {
    setSearch("");
    setRole("ALL");
    setCompany("ALL");
    setStatus("ALL");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{t("admin.users.title")}</h1>
          <p className="text-sm text-slate-500 mt-1">{t("admin.users.subtitle")}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.dashboard.createUser")}
        </Button>
      </div>

      <UserStatistics users={users} />

      <UserFilters
        companies={companies}
        search={search}
        role={role}
        company={company}
        status={status}
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onCompanyChange={setCompany}
        onStatusChange={setStatus}
        onReset={resetFilters}
      />

      {loading ? (
        <div className="rounded-xl border bg-white p-16 text-center text-slate-400 shadow-sm">
          {t("admin.users.loading")}
        </div>
      ) : (
        <UsersTable users={filteredUsers} onEdit={setEditTarget} onDelete={setDeleteTarget} />
      )}

      <CreateUserDialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) setDefaultRole(undefined);
        }}
        companies={companies}
        onCreated={loadData}
        defaultRole={defaultRole}
      />

      <EditUserDialog
        user={editTarget}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onUpdated={loadData}
      />

      <DeleteUserDialog
        user={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onDeleted={loadData}
      />
    </div>
  );
}
