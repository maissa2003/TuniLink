import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowRight, BarChart3, Calculator, Receipt, Users, Wallet } from "lucide-react";
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
