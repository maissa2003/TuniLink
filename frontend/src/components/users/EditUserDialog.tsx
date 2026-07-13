// src/components/users/EditUserDialog.tsx
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
import { UserRowData } from "./UserRow";
import { useLanguage } from "@/lib/useLanguage";

interface Props {
  user: UserRowData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export default function EditUserDialog({ user, open, onOpenChange, onUpdated }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ username: "", email: "", status: "ACTIVE" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({ username: user.username, email: user.email, status: user.status });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.put(`/users/${user.id}`, form);
      onOpenChange(false);
      onUpdated();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t("admin.users.failedUpdate"));
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = [
    { value: "ACTIVE", label: t("status.ACTIVE") },
    { value: "PENDING", label: t("status.PENDING") },
    { value: "DISABLED", label: t("status.DISABLED") },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("admin.users.editTitle")}</DialogTitle>
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
            <Label>{t("common.status")}</Label>
            <AppSelect
              value={form.status}
              onValueChange={(status) => setForm({ ...form, status })}
              options={statusOptions}
            />
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
