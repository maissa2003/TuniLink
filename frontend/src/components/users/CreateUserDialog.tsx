// src/components/users/CreateUserDialog.tsx
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import AppSelect from "@/components/shared/AppSelect";
import api from "@/api/axios";
import { useLanguage } from "@/lib/useLanguage";

interface Company {
  id: number;
  name: string;
  type: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: Company[];
  onCreated: () => void;
  defaultRole?: string;
}

const ROLES_BY_COMPANY_TYPE: Record<string, string[]> = {
  INFRASTRUCTURE_PROVIDER: ["INFRASTRUCTURE", "ADMIN"],
  RECRUITMENT_AGENCY: ["HR", "FINANCE", "ADMIN", "EMPLOYEE"],
  CLIENT: ["CLIENT"],
};

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let pwd = "";
  for (let i = 0; i < 10; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd;
}

export default function CreateUserDialog({ open, onOpenChange, companies, onCreated, defaultRole }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    companyId: "",
    role: "",
    sendInvite: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCompany = companies.find((c) => c.id === Number(form.companyId));
  const availableRoles = selectedCompany ? ROLES_BY_COMPANY_TYPE[selectedCompany.type] || [] : [];

  useEffect(() => {
    if (!open) return;
    setForm({
      username: "",
      email: "",
      password: generatePassword(),
      companyId: "",
      role: defaultRole ?? "",
      sendInvite: true,
    });
    setError(null);
  }, [open, defaultRole]);

  const handleCompanyChange = (companyId: string) => {
    const selected = companies.find((c) => c.id === Number(companyId));
    const roles = selected ? ROLES_BY_COMPANY_TYPE[selected.type] || [] : [];
    const preferredRole = defaultRole && roles.includes(defaultRole) ? defaultRole : roles[0] || "";
    setForm({ ...form, companyId, role: preferredRole });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/users", {
        username: form.username,
        email: form.email,
        password: form.password,
        companyId: Number(form.companyId),
        role: form.role,
        sendInvite: form.sendInvite,
      });
      onOpenChange(false);
      onCreated();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t("admin.users.failedCreate"));
    } finally {
      setSubmitting(false);
    }
  };

  const companyOptions = companies.map((company) => ({
    value: company.id.toString(),
    label: `${company.name} (${t(`companyType.${company.type}`)})`,
  }));

  const roleOptions = availableRoles.map((role) => ({
    value: role,
    label: t(`role.${role}`) !== `role.${role}` ? t(`role.${role}`) : role,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("admin.users.createTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t("common.username")}</Label>
            <Input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("common.email")}</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("common.company")}</Label>
            <AppSelect
              value={form.companyId}
              onValueChange={handleCompanyChange}
              options={companyOptions}
              placeholder={t("admin.users.chooseCompany")}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("common.role")}</Label>
            <AppSelect
              value={form.role}
              onValueChange={(role) => setForm({ ...form, role })}
              options={roleOptions}
              placeholder={t("admin.users.chooseRole")}
              disabled={!form.companyId}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("admin.users.tempPassword")}</Label>
            <div className="flex gap-2">
              <Input
                className="font-mono"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setForm({ ...form, password: generatePassword() })}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {t("admin.users.generate")}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.sendInvite}
              onCheckedChange={(checked) => setForm({ ...form, sendInvite: !!checked })}
            />
            <Label className="font-normal">{t("admin.users.sendInvite")}</Label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={submitting || !form.companyId || !form.role}>
              {submitting ? t("admin.users.creating") : t("admin.dashboard.createUser")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
