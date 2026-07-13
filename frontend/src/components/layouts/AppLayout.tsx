import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import api from "@/api/axios";
import { removeLandingStylesheets } from "@/components/LandingPage";
import { persistProfilePicture } from "@/lib/profile";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  useEffect(() => {
    document.title = "TuniLink";
    removeLandingStylesheets();

    if (!localStorage.getItem("token")) return;
    api.get("/profile").then((response) => {
      if (response.data.username) {
        localStorage.setItem("username", response.data.username);
      }
      persistProfilePicture(response.data.profilePicture ?? null);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster richColors position="top-right" />
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-80">
        <Topbar />
        <main className="flex-1 pt-20">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
