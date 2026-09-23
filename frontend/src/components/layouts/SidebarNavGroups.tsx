import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { NavGroup, navGroupTitle, navTitle } from "@/lib/navigation";
import { LanguageCode } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const exactPaths = new Set([
  "/workspace", "/admin/finance", "/admin/hr", "/admin/clients", "/admin/employees",
  "/workspace/hr", "/workspace/finance", "/workspace/employees", "/workspace/employee-portal",
]);

interface Props {
  groups: NavGroup[];
  language: LanguageCode;
  onNavigate?: () => void;
  linkClassName?: string;
}

export default function SidebarNavGroups({ groups, language, onNavigate, linkClassName }: Props) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((group, index) => [group.titleKey ?? `group-${index}`, group.defaultOpen !== false])),
  );

  const toggleGroup = (key: string) => {
    setOpenGroups((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <>
      {groups.map((group, index) => {
        const groupKey = group.titleKey ?? `group-${index}`;
        const isOpen = openGroups[groupKey] ?? true;
        const canCollapse = group.collapsible && group.titleKey;

        return (
          <div key={groupKey} className="space-y-1.5">
            {group.titleKey && (
              canCollapse ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(groupKey)}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-200 hover:bg-blue-800/60"
                >
                  <span>{navGroupTitle(group, language)}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </button>
              ) : (
                <p className="px-4 text-xs font-semibold uppercase tracking-wide text-blue-200">
                  {navGroupTitle(group, language)}
                </p>
              )
            )}
            {(!canCollapse || isOpen) && group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={exactPaths.has(item.href)}
                  onClick={onNavigate}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3.5 text-[0.95rem] font-medium transition-all",
                    isActive ? "bg-blue-500 text-white shadow-md" : "text-blue-100 hover:bg-blue-700 hover:text-white",
                    linkClassName,
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {navTitle(item, language)}
                </NavLink>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
