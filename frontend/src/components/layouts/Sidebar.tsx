import { NavLink } from "react-router-dom";
import { LogOut, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNavigationGroups, navGroupTitle, navTitle, portalTitle } from "@/lib/navigation";
import { useLanguage } from "@/lib/useLanguage";
import { clearSession } from "@/lib/profile";
import { cn } from "@/lib/utils";

const exactPaths = new Set(["/workspace", "/admin/finance", "/admin/hr", "/admin/clients", "/admin/employees"]);

export default function Sidebar() {
  const { language, t } = useLanguage();
  const role = localStorage.getItem("role");
  const navigationGroups = getNavigationGroups(role);
  const logout = () => { clearSession(); window.location.href = "/login"; };

  return <aside className="fixed left-0 top-0 hidden h-screen w-80 flex-col border-r border-blue-900/20 bg-[#1E3A8A] text-white lg:flex">
    <div className="flex h-24 items-center justify-between border-b border-blue-800 px-7">
      <div>
        <h1 className="text-2xl font-bold">{t("app.name")}</h1>
        <p className="mt-1 text-sm text-blue-200">{portalTitle(role, language)}</p>
      </div>
      <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
        <PanelLeftClose className="h-5 w-5" />
      </Button>
    </div>

    <nav className="flex-1 space-y-6 overflow-y-auto p-5">
      {navigationGroups.map((group, index) => <div key={group.titleKey ?? index} className="space-y-1.5">
        {group.titleKey && <p className="px-4 text-xs font-semibold uppercase tracking-wide text-blue-200">{navGroupTitle(group, language)}</p>}
        {group.items.map((item) => {
          const Icon = item.icon;
          return <NavLink
            key={item.href}
            to={item.href}
            end={exactPaths.has(item.href)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-xl px-4 py-3.5 text-[0.95rem] font-medium transition-all",
              isActive ? "bg-blue-500 text-white shadow-md" : "text-blue-100 hover:bg-blue-700 hover:text-white",
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {navTitle(item, language)}
          </NavLink>;
        })}
      </div>)}
    </nav>

    <div className="border-t border-blue-800 p-4">
      <Button variant="ghost" onClick={logout} className="w-full justify-start gap-3 text-white hover:bg-red-500">
        <LogOut className="h-5 w-5" />
        {t("layout.logout")}
      </Button>
    </div>
  </aside>;
}
