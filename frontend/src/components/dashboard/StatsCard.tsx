import { LucideIcon, TrendingUp } from "lucide-react";

import { Card, CardContent } from "../../../@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  change?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "bg-blue-100 text-blue-600",
  change,
}: StatsCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-slate-500 font-medium">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

          {change && (
            <div className="mt-3 flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              {change}
            </div>
          )}
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
        >
          <Icon className="h-7 w-7" />
        </div>
      </CardContent>
    </Card>
  );
}