import { useNavigate } from "react-router-dom";
import { UserPlus, Building2, Briefcase, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/useLanguage";

const actions = [
  {
    labelKey: "admin.dashboard.createUser",
    icon: UserPlus,
    to: "/admin/users",
    state: { openCreate: true },
  },
  {
    labelKey: "admin.dashboard.createCompany",
    icon: Building2,
    to: "/admin/companies",
    state: { openCreate: true },
  },
  {
    labelKey: "admin.dashboard.addEmployee",
    icon: Briefcase,
    to: "/admin/users",
    state: { openCreate: true, defaultRole: "EMPLOYEE" },
  },
  {
    labelKey: "admin.dashboard.newSimulation",
    icon: Calculator,
    to: "/admin/clients/simulations",
  },
] as const;

export default function QuickActions() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{t("admin.dashboard.quickActions")}</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.labelKey}
              type="button"
              variant="outline"
              className="h-11 justify-start"
              onClick={() => navigate(action.to, "state" in action ? { state: action.state } : undefined)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {t(action.labelKey)}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
