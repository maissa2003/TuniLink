import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowRight, BarChart3, Briefcase, Calculator, FileText, Receipt, Users, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/useLanguage";

type DomainCard = {
  titleKey: string;
  textKey: string;
  href: string;
  icon: typeof Users;
};

const domains: Record<string, { titleKey: string; textKey: string; cards: DomainCard[] }> = {
  finance: {
    titleKey: "admin.domain.finance.title",
    textKey: "admin.domain.finance.text",
    cards: [
      { titleKey: "nav.payroll", textKey: "admin.domain.finance.payroll", href: "/admin/finance/payroll", icon: Wallet },
      { titleKey: "nav.margins", textKey: "admin.domain.finance.margins", href: "/admin/finance/margins", icon: Calculator },
      { titleKey: "nav.invoices", textKey: "admin.domain.finance.invoices", href: "/admin/finance/invoices", icon: Receipt },
      { titleKey: "nav.reports", textKey: "admin.domain.finance.reports", href: "/admin/finance/reports", icon: BarChart3 },
    ],
  },
  hr: {
    titleKey: "admin.domain.hr.title",
    textKey: "admin.domain.hr.text",
    cards: [
      { titleKey: "nav.employees", textKey: "admin.domain.hr.employees", href: "/admin/hr/employees", icon: Users },
      { titleKey: "nav.contracts", textKey: "admin.domain.hr.contracts", href: "/admin/hr/contracts", icon: FileText },
      { titleKey: "nav.payrollInputs", textKey: "admin.domain.hr.payroll", href: "/admin/hr/payroll", icon: Wallet },
    ],
  },
  clients: {
    titleKey: "admin.domain.clients.title",
    textKey: "admin.domain.clients.text",
    cards: [
      { titleKey: "nav.myTeam", textKey: "admin.domain.clients.team", href: "/admin/clients/team", icon: Briefcase },
      { titleKey: "nav.simulations", textKey: "admin.domain.clients.simulations", href: "/admin/clients/simulations", icon: Calculator },
      { titleKey: "nav.invoices", textKey: "admin.domain.clients.invoices", href: "/admin/clients/invoices", icon: Receipt },
      { titleKey: "nav.history", textKey: "admin.domain.clients.history", href: "/admin/clients/history", icon: FileText },
    ],
  },
};

export default function AdminDomainPage() {
  const { t } = useLanguage();
  const { domain = "finance" } = useParams();
  const location = useLocation();
  const page = domains[domain] ?? domains.finance;
  const currentCard = page.cards.find((card) => card.href === location.pathname);
  const cards = currentCard ? [currentCard] : page.cards;
  const title = currentCard ? t(currentCard.titleKey) : t(page.titleKey);

  return <div className="space-y-8">
    <div className="rounded-2xl bg-gradient-to-r from-blue-950 to-blue-700 p-7 text-white">
      <p className="text-sm font-medium text-blue-200">{t("admin.domain.oversight")}</p>
      <h1 className="mt-2 text-3xl font-bold">{title}</h1>
      <p className="mt-2 max-w-2xl text-blue-100">{currentCard ? t(currentCard.textKey) : t(page.textKey)}</p>
    </div>

    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return <Card key={card.href} className="border-slate-200 shadow-sm">
          <CardHeader>
            <Icon className="h-8 w-8 text-blue-700" />
            <CardTitle className="mt-3">{t(card.titleKey)}</CardTitle>
            <CardDescription>{t(card.textKey)}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to={card.href} className="flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80">
              {t("workspace.open")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>;
      })}
    </div>
  </div>;
}
