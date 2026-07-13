// src/components/users/UserStatistics.tsx

import {
  Users,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/lib/useLanguage";

interface UserStatisticsProps {
  users: {
    status: string;
  }[];
}

export default function UserStatistics({
  users,
}: UserStatisticsProps) {
  const { t } = useLanguage();
  const total = users.length;

  const active = users.filter(
    (u) => u.status === "ACTIVE"
  ).length;

  const pending = users.filter(
    (u) => u.status === "PENDING"
  ).length;

  const disabled = users.filter(
    (u) => u.status === "DISABLED"
  ).length;

  const cards = [
    {
      title: t("admin.users.total"),
      value: total,
      subtitle: t("admin.users.totalSub"),
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: t("admin.users.active"),
      value: active,
      subtitle: t("admin.users.activeSub"),
      icon: UserCheck,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: t("status.PENDING"),
      value: pending,
      subtitle: t("admin.users.pendingSub"),
      icon: UserPlus,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: t("status.DISABLED"),
      value: disabled,
      subtitle: t("admin.users.disabledSub"),
      icon: UserX,
      bg: "bg-red-100",
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="border-0 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {card.title}
              </CardTitle>

              <div
                className={`rounded-xl p-3 ${card.bg}`}
              >
                <Icon
                  className={`h-5 w-5 ${card.color}`}
                />
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">
                {card.value}
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
