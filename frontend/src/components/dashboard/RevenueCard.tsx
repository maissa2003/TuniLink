import { ArrowUpRight, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/useLanguage";

interface RevenueCardProps {
  amount: number;
  currency: string;
}

export default function RevenueCard({ amount, currency }: RevenueCardProps) {
  const { t } = useLanguage();
  const formattedAmount = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(amount);

  return (
    <Card className="border-0 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {t("admin.dashboard.monthlyPayroll")}
        </CardTitle>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
          <Wallet className="h-5 w-5 text-emerald-600" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold text-slate-900">
          {formattedAmount} {currency}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-slate-500">
            {t("admin.dashboard.employees")}
          </span>
        </div>

        <Button
          variant="ghost"
          className="mt-6 w-full justify-between rounded-xl"
        >
          {t("admin.dashboard.revenueReport")}

          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
