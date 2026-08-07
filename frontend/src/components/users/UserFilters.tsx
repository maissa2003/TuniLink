import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AppSelect from "@/components/shared/AppSelect";
import { useLanguage } from "@/lib/useLanguage";

interface Company {
  id: number;
  name: string;
}

interface Props {
  companies: Company[];
  search: string;
  role: string;
  company: string;
  status: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export default function UserFilters({
  companies,
  search,
  role,
  company,
  status,
  onSearchChange,
  onRoleChange,
  onCompanyChange,
  onStatusChange,
  onReset,
}: Props) {
  const { t } = useLanguage();

  const roleOptions = [
    { value: "ALL", label: t("admin.users.allRoles") },
    { value: "ADMIN", label: t("role.ADMIN") },
    { value: "MANAGER", label: t("role.MANAGER") },
    { value: "HR", label: t("role.HR") },
    { value: "FINANCE", label: t("role.FINANCE") },
    { value: "EMPLOYEE", label: t("role.EMPLOYEE") },
    { value: "CLIENT", label: t("role.CLIENT") },
    { value: "INFRASTRUCTURE", label: t("role.INFRASTRUCTURE") },
  ];

  const companyOptions = [
    { value: "ALL", label: t("admin.users.allCompanies") },
    ...companies.map((item) => ({ value: item.id.toString(), label: item.name })),
  ];

  const statusOptions = [
    { value: "ALL", label: t("admin.users.allStatus") },
    { value: "ACTIVE", label: t("status.ACTIVE") },
    { value: "PENDING", label: t("status.PENDING") },
    { value: "DISABLED", label: t("status.DISABLED") },
  ];

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("admin.users.search")}
            className="pl-10"
          />
        </div>

        <AppSelect value={role} onValueChange={onRoleChange} options={roleOptions} className="lg:w-44" />
        <AppSelect value={company} onValueChange={onCompanyChange} options={companyOptions} className="lg:w-56" />
        <AppSelect value={status} onValueChange={onStatusChange} options={statusOptions} className="lg:w-44" />

        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          {t("admin.users.reset")}
        </Button>
      </div>
    </div>
  );
}
