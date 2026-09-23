
import { LogOut, PanelLeftClose } from "lucide-react";
import logoImg from "@/assets/images/logo (3).png";
import { Button } from "@/components/ui/button";
import { getNavigationGroups, portalTitle } from "@/lib/navigation";
import { useLanguage } from "@/lib/useLanguage";
import { clearSession } from "@/lib/profile";
import SidebarNavGroups from "./SidebarNavGroups";

export default function Sidebar() {
  const { language, t } = useLanguage();
  const role = localStorage.getItem("role");
  const navigationGroups = getNavigationGroups(role);
  const logout = () => { clearSession(); window.location.href = "/login"; };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-80 flex-col border-r border-blue-900/20 bg-[#1E3A8A] text-white lg:flex">
      <div className="flex h-24 items-center justify-between border-b border-blue-800 px-7">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="TuniLink" className="h-10 w-auto" />
          <div>
            <p className="text-xs text-blue-200 leading-tight">{portalTitle(role, language)}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
          <PanelLeftClose className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-5">
        <SidebarNavGroups groups={navigationGroups} language={language} />
      </nav>

      <div className="border-t border-blue-800 p-4">
        <Button variant="ghost" onClick={logout} className="w-full justify-start gap-3 text-white hover:bg-red-500">
          <LogOut className="h-5 w-5" />
          {t("layout.logout")}
        </Button>
      </div>
    </aside>
  );
}
