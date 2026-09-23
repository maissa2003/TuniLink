import { useEffect, useState } from "react";

import { Bell, Globe, LogOut, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNavigationGroups, portalTitle, roleLabel } from "@/lib/navigation";
import { useLanguage } from "@/lib/useLanguage";
import { clearSession, getProfilePicture } from "@/lib/profile";
import SidebarNavGroups from "./SidebarNavGroups";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(() => getProfilePicture());
  const [username, setUsername] = useState(() => localStorage.getItem("username") ?? "User");
  const { language, t } = useLanguage();
  const role = localStorage.getItem("role");
  const navigationGroups = getNavigationGroups(role);
  const logout = () => { clearSession(); window.location.href = "/login"; };

  useEffect(() => {
    const syncProfile = () => {
      setProfilePicture(getProfilePicture());
      setUsername(localStorage.getItem("username") ?? "User");
    };
    window.addEventListener("profilechange", syncProfile);
    window.addEventListener("storage", syncProfile);
    return () => {
      window.removeEventListener("profilechange", syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  return <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-white px-6 shadow-sm">
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger><span className="flex rounded-md p-2 lg:hidden"><Menu className="h-6 w-6" /></span></SheetTrigger>
      <SheetContent side="left" className="w-80 bg-[#1E3A8A] p-0">
        <div className="border-b border-blue-800 p-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white leading-tight">TuniLink</p>
            <p className="text-xs text-blue-200 leading-tight">{portalTitle(role, language)}</p>
          </div>
        </div>
        <nav className="space-y-4 overflow-y-auto p-4">
          <SidebarNavGroups
            groups={navigationGroups}
            language={language}
            onNavigate={() => setOpen(false)}
            linkClassName="text-sm py-3"
          />
        </nav>
      </SheetContent>
    </Sheet>
    <div className="relative hidden md:block">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input placeholder={t("layout.search")} className="w-72 pl-10" />
    </div>
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
      <Avatar>
        <AvatarImage src={profilePicture} alt={username} />
        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="hidden text-right lg:block">
        <p className="text-sm font-semibold">{username}</p>
        <p className="text-xs text-muted-foreground">{roleLabel(role, language)}</p>
      </div>
      <Button variant="ghost" onClick={logout} className="gap-2 text-red-600"><LogOut className="h-4 w-4" />{t("layout.logout")}</Button>
    </div>
  </header>;
}
