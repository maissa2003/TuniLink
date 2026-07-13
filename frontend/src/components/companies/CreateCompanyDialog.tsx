// src/components/companies/CreateCompanyDialog.tsx
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
import { useLanguage } from "@/lib/useLanguage";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

const COMPANY_TYPES = [
  { value: "INFRASTRUCTURE_PROVIDER", labelKey: "companyType.INFRASTRUCTURE_PROVIDER" },
  { value: "RECRUITMENT_AGENCY", labelKey: "companyType.RECRUITMENT_AGENCY" },
  { value: "CLIENT", labelKey: "companyType.CLIENT" },
] as const;

const DEFAULT_CURRENCY_BY_TYPE: Record<string, string> = {
  INFRASTRUCTURE_PROVIDER: "TND",
  RECRUITMENT_AGENCY: "TND",
  CLIENT: "CAD",
};

export default function CreateCompanyDialog({ open, onOpenChange, onCreated }: Props) {
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
    if (!open) return;
    setForm({ name: "", type: "", country: "", currency: "", taxRate: "" });
    setError(null);
  }, [open]);

  const handleTypeChange = (type: string) => {
    setForm({ ...form, type, currency: DEFAULT_CURRENCY_BY_TYPE[type] ?? form.currency });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/companies", {
        ...form,
        taxRate: form.taxRate ? Number(form.taxRate.replace(",", ".")) : 0,
      });
      onOpenChange(false);
      onCreated();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t("admin.companies.failedCreate"));
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
          <DialogTitle>{t("admin.companies.createTitle")}</DialogTitle>
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
              onValueChange={handleTypeChange}
              options={typeOptions}
              placeholder={t("admin.companies.chooseType")}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("common.country")}</Label>
            <Input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder={t("admin.companies.countryPlaceholder")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t("common.currency")}</Label>
              <Input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                placeholder={t("admin.companies.currencyPlaceholder")}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("common.taxRate")}</Label>
              <Input
                type="number"
                step="0.01"
                value={form.taxRate}
                onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={submitting || !form.type}>
              {submitting ? t("admin.users.creating") : t("admin.companies.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
