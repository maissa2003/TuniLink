// src/components/companies/EditCompanyDialog.tsx
import { useEffect, useState } from "react";
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
import AppSelect from "@/components/shared/AppSelect";
import api from "@/api/axios";
import { CompanyRowData } from "./CompaniesTable";
import { useLanguage } from "@/lib/useLanguage";

interface Props {
  company: CompanyRowData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

const COMPANY_TYPES = [
  { value: "INFRASTRUCTURE_PROVIDER", labelKey: "companyType.INFRASTRUCTURE_PROVIDER" },
  { value: "RECRUITMENT_AGENCY", labelKey: "companyType.RECRUITMENT_AGENCY" },
  { value: "CLIENT", labelKey: "companyType.CLIENT" },
] as const;

export default function EditCompanyDialog({ company, open, onOpenChange, onUpdated }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    type: "",
    country: "",
    currency: "",
    taxRate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name,
        type: company.type,
        country: company.country ?? "",
        currency: company.currency ?? "",
        taxRate: company.taxRate != null ? String(company.taxRate) : "",
      });
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.put(`/companies/${company.id}`, {
        ...form,
        taxRate: form.taxRate ? Number(form.taxRate.replace(",", ".")) : 0,
      });
      onOpenChange(false);
      onUpdated();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t("admin.companies.failedUpdate"));
    } finally {
      setSubmitting(false);
    }
  };

  const typeOptions = COMPANY_TYPES.map((type) => ({
    value: type.value,
    label: t(type.labelKey),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("admin.companies.editTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t("common.name")}</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("common.type")}</Label>
            <AppSelect
              value={form.type}
              onValueChange={(type) => setForm({ ...form, type })}
              options={typeOptions}
              placeholder={t("admin.companies.chooseType")}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("common.country")}</Label>
            <Input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t("common.currency")}</Label>
              <Input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("common.taxRate")}</Label>
              <Input
                type="number"
                step="0.01"
                value={form.taxRate}
                onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? t("admin.users.saving") : t("admin.users.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
