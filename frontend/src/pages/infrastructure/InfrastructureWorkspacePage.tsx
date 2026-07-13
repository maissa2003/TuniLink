import type { ComponentType } from "react";
import { useLocation } from "react-router-dom";
import InfrastructureOverview from "@/components/infrastructure/InfrastructureOverview";
import InfrastructureCosts from "@/components/infrastructure/InfrastructureCosts";
import InfrastructureResources from "@/components/infrastructure/InfrastructureResources";
import InfrastructureReports from "@/components/infrastructure/InfrastructureReports";
import { resolveInfrastructurePage } from "@/lib/infrastructurePaths";

const pages: Record<string, ComponentType> = {
  overview: InfrastructureOverview,
  costs: InfrastructureCosts,
  resources: InfrastructureResources,
  reports: InfrastructureReports,
};

export default function InfrastructureWorkspacePage() {
  const { pathname } = useLocation();
  const Page = pages[resolveInfrastructurePage(pathname)] ?? InfrastructureOverview;
  return <Page />;
}
