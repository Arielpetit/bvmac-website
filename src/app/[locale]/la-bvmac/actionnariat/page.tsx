import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { formatDate, formatFcfa, formatNumber } from "@/lib/format";
import { SHAREHOLDING } from "@/data/institution";
import { ContentPage } from "@/components/content/ContentPage";
import { Card } from "@/components/ui/Card";
import { ShareholdingChart } from "@/components/market/LazyCharts";

const COLORS = ["#5a3412", "#8a6614", "#c9a23a", "#ead18a", "#3a2414"];

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/actionnariat">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.shareholding);
}

export default async function ShareholdingPage({ params }: PageProps<"/[locale]/la-bvmac/actionnariat">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="about" title={dict.nav.items.shareholding} intro={`Capital social de ${formatFcfa(SHAREHOLDING.capital, locale)}, réparti entre les acteurs publics et privés de la sous-région.`}>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-h3">Répartition du capital</h2>
          <p className="text-sm text-muted">Au {formatDate(SHAREHOLDING.asOf, locale)}</p>
          <ShareholdingChart parts={SHAREHOLDING.parts} />
        </Card>
        <div>
          <table className="w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface text-sm">
            <caption className="mb-2 text-left text-sm text-muted">Tableau des données du graphique</caption>
            <thead className="bg-surface-alt">
              <tr className="text-xs uppercase tracking-[0.1em] text-muted">
                <th scope="col" className="px-4 py-3 text-left font-medium">Catégorie d’actionnaires</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Part</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Montant indicatif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {SHAREHOLDING.parts.map((part, i) => (
                <tr key={part.label}>
                  <th scope="row" className="px-4 py-3 text-left font-normal">
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className="size-3 rounded-[3px]" style={{ background: COLORS[i] }} />
                      {part.label}
                    </span>
                  </th>
                  <td className="figure px-4 py-3 text-right">{formatNumber(part.value, locale)} %</td>
                  <td className="figure px-4 py-3 text-right">{formatFcfa((SHAREHOLDING.capital * part.value) / 100, locale)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-line bg-surface-alt">
              <tr>
                <th scope="row" className="px-4 py-3 text-left">Total</th>
                <td className="figure px-4 py-3 text-right">100 %</td>
                <td className="figure px-4 py-3 text-right">{formatFcfa(SHAREHOLDING.capital, locale)}</td>
              </tr>
            </tfoot>
          </table>
          <p className="mt-3 text-xs text-muted">Montants calculés à partir des pourcentages publiés. Mise à jour annuelle par le Service Communication.</p>
        </div>
      </div>
    </ContentPage>
  );
}
