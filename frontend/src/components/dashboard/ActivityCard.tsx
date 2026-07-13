import { Clock3, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/useLanguage";

export interface DashboardActivity {
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface ActivityCardProps {
  activities: DashboardActivity[];
}

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function ActivityCard({ activities }: ActivityCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>{t("admin.dashboard.recentActivity")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {activities.length === 0 && <p className="text-sm text-slate-500">{t("admin.dashboard.noActivity")}</p>}
        {activities.map((activity) => (
          <div key={`${activity.email}-${activity.createdAt}`} className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <UserPlus className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <p className="font-medium text-slate-900">
                {t("admin.dashboard.userCreated")}: {activity.username}
              </p>
              <p className="text-sm text-slate-500">{activity.email} - {activity.role} - {activity.status}</p>
              <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                {formatDate(activity.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
