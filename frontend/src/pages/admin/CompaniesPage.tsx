// src/pages/admin/CompaniesPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import CompaniesTable, { CompanyRowData } from "@/components/companies/CompaniesTable";
import CreateCompanyDialog from "@/components/companies/CreateCompanyDialog";
import EditCompanyDialog from "@/components/companies/EditCompanyDialog";
import DeleteCompanyDialog from "@/components/companies/DeleteCompanyDialog";
import CompanyCard from "@/components/companies/CompanyCard";
import api from "@/api/axios";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CompanyRowData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CompanyRowData | null>(null);
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { openCreate?: boolean } | null;
    if (state?.openCreate) {
      setCreateOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/companies");
      setCompanies(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (c) =>
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.country?.toLowerCase().includes(search.toLowerCase())
    );
  }, [companies, search]);

  const counts = useMemo(() => {
    return {
      infrastructure: companies.filter((c) => c.type === "INFRASTRUCTURE_PROVIDER").length,
      recruitment: companies.filter((c) => c.type === "RECRUITMENT_AGENCY").length,
      client: companies.filter((c) => c.type === "CLIENT").length,
    };
  }, [companies]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Companies</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage infrastructure providers, recruitment agencies, and clients.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Company
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <CompanyCard
          icon={Building2}
          label="Infrastructure Providers"
          value={counts.infrastructure}
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-600"
        />
        <CompanyCard
          icon={Building2}
          label="Recruitment Agencies"
          value={counts.recruitment}
          iconBgClass="bg-indigo-50"
          iconColorClass="text-indigo-600"
        />
        <CompanyCard
          icon={Building2}
          label="Clients"
          value={counts.client}
          iconBgClass="bg-emerald-50"
          iconColorClass="text-emerald-600"
        />
      </div>

      <Input
        placeholder="Search by name or country..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <div className="rounded-xl border bg-white p-16 text-center text-slate-400 shadow-sm">
          Loading companies...
        </div>
      ) : (
        <CompaniesTable companies={filteredCompanies} onEdit={setEditTarget} onDelete={setDeleteTarget} />
      )}

      <CreateCompanyDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={loadData} />

      <EditCompanyDialog
        company={editTarget}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onUpdated={loadData}
      />

      <DeleteCompanyDialog
        company={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onDeleted={loadData}
      />
    </div>
  );
}