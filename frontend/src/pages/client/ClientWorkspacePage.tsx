import type { ComponentType } from "react";
import { useLocation } from "react-router-dom";
import ClientOverview from "@/components/client/ClientOverview";
import ClientTeam from "@/components/client/ClientTeam";
import ClientSimulations from "@/components/client/ClientSimulations";
import ClientInvoices from "@/components/client/ClientInvoices";
import ClientHistory from "@/components/client/ClientHistory";
import { resolveClientPage } from "@/lib/clientPaths";

const pages: Record<string, ComponentType> = {
  overview: ClientOverview,
  team: ClientTeam,
  simulations: ClientSimulations,
  invoices: ClientInvoices,
  history: ClientHistory,
};

export default function ClientWorkspacePage() {
  const { pathname } = useLocation();
  const Page = pages[resolveClientPage(pathname)] ?? ClientOverview;
  return <Page />;
}
