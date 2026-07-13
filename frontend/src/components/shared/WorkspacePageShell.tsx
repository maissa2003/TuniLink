import { ReactNode } from "react";
import { useLanguage } from "@/lib/useLanguage";
import { roleLabel } from "@/lib/navigation";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function WorkspacePageShell({ title, description, children, action }: Props) {
  const { language, t } = useLanguage();
  const role = localStorage.getItem("role") ?? "EMPLOYEE";

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-blue-950 to-blue-700 p-7 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-200">
              {t("app.name")} — {roleLabel(role, language)}
            </p>
            <h1 className="mt-2 text-3xl font-bold">{title}</h1>
            <p className="mt-2 max-w-2xl text-blue-100">{description}</p>
          </div>
          {action}
        </div>
      </div>
      {children}
    </div>
  );
}
