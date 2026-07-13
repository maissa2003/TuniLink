// src/components/companies/CompaniesTable.tsx
import { Building2, Landmark, Globe, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CompanyRowData {
  id: number;
  name: string;
  type: string;
  country: string;
  currency: string;
  taxRate: number;
}

interface Props {
  companies: CompanyRowData[];
  onEdit: (company: CompanyRowData) => void;
  onDelete: (company: CompanyRowData) => void;
}

const TYPE_STYLES: Record<string, { label: string; className: string; icon: typeof Building2 }> = {
  INFRASTRUCTURE_PROVIDER: {
    label: "Infrastructure Provider",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Building2,
  },
  RECRUITMENT_AGENCY: {
    label: "Recruitment Agency",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Landmark,
  },
  CLIENT: {
    label: "Client",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Globe,
  },
};

export default function CompaniesTable({ companies, onEdit, onDelete }: Props) {
  if (companies.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-16 text-center text-slate-400 shadow-sm">
        No companies yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Country</th>
            <th className="px-4 py-3 font-medium">Currency</th>
            <th className="px-4 py-3 font-medium">Tax Rate</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {companies.map((c) => {
            const style =
              TYPE_STYLES[c.type] ?? {
                label: c.type,
                className: "bg-slate-50 text-slate-700 border-slate-200",
                icon: Building2,
              };
            const Icon = style.icon;
            return (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={style.className}>
                    <Icon className="mr-1 h-3 w-3" />
                    {style.label}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">{c.country || "—"}</td>
                <td className="px-4 py-3 text-slate-600">{c.currency || "—"}</td>
                <td className="px-4 py-3 text-slate-600">
                  {c.taxRate != null ? `${c.taxRate}%` : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(c)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}