import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { formatDate, formatFcfa, formatNumber } from "@/lib/format";
import { getShareholding } from "@/lib/api";
import { tc } from "@/i18n/content";
import { ContentPage } from "@/components/content/ContentPage";
import { Card } from "@/components/ui/Card";
import { ShareholdingChart } from "@/components/market/LazyCharts";

const COLORS = ["#5a3412", "#8a6614", "#c9a23a", "#ead18a", "#3a2414"];

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/actionnariat">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.shareholding);
}

const T = {
  fr: { intro: (c: string) => `Capital social de ${c}, réparti entre les acteurs publics et privés de la sous-région.`, breakdown: "Répartition du capital", asOf: "Au", caption: "Tableau des données du graphique", category: "Catégorie d’actionnaires", share: "Part", amount: "Montant indicatif", note: "Montants calculés à partir des pourcentages publiés. Mise à jour annuelle." },
  en: { intro: (c: string) => `Share capital of ${c}, held by public and private players across the region.`, breakdown: "Capital breakdown", asOf: "As of", caption: "Chart data table", category: "Shareholder category", share: "Share", amount: "Indicative amount", note: "Amounts calculated from the published percentages. Updated every year." },
  es: { intro: (c: string) => `Capital social de ${c}, repartido entre los actores públicos y privados de la subregión.`, breakdown: "Reparto del capital", asOf: "A", caption: "Tabla de datos del gráfico", category: "Categoría de accionistas", share: "Porcentaje", amount: "Importe orientativo", note: "Importes calculados a partir de los porcentajes publicados. Actualización anual." },
};

export default async function ShareholdingPage({ params }: PageProps<"/[locale]/la-bvmac/actionnariat">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  const raw = await getShareholding();
  const SHAREHOLDING = { ...raw, parts: raw.parts.map((p) => ({ ...p, label: tc(p.label, locale) })) };
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.shareholding} intro={t.intro(formatFcfa(SHAREHOLDING.capital, locale))}>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6 md:p-8">
          <h2 className="text-h3">{t.breakdown}</h2>
          <p className="text-sm text-muted">{t.asOf} {formatDate(SHAREHOLDING.asOf, locale)}</p>
          <ShareholdingChart parts={SHAREHOLDING.parts} />
        </Card>
        <div>
          <div className="relative overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface" data-lenis-prevent>
          <table className="w-full text-sm sm:min-w-[440px]">
            <caption className="px-4 pt-4 text-left text-sm text-muted">{t.caption}</caption>
            <thead className="bg-surface-alt">
              <tr className="text-xs uppercase tracking-[0.1em] text-muted">
                <th scope="col" className="px-4 py-3 text-left font-medium">{t.category}</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">{t.share}</th>
                <th scope="col" className="hidden px-4 py-3 text-right font-medium sm:table-cell">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {SHAREHOLDING.parts.map((part, i) => (
                <tr key={part.label}>
                  <th scope="row" className="px-4 py-3 text-left font-normal">
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className="size-3 shrink-0 rounded-[3px]" style={{ background: COLORS[i] }} />
                      <span>
                        {part.label}
                        <span className="figure block text-xs text-muted sm:hidden">{formatFcfa((SHAREHOLDING.capital * part.value) / 100, locale)}</span>
                      </span>
                    </span>
                  </th>
                  <td className="figure whitespace-nowrap px-4 py-3 text-right align-top">{formatNumber(part.value, locale)} %</td>
                  <td className="figure hidden whitespace-nowrap px-4 py-3 text-right align-top sm:table-cell">{formatFcfa((SHAREHOLDING.capital * part.value) / 100, locale)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-line bg-surface-alt">
              <tr>
                <th scope="row" className="px-4 py-3 text-left">
                  Total
                  <span className="figure block text-xs font-normal text-muted sm:hidden">{formatFcfa(SHAREHOLDING.capital, locale)}</span>
                </th>
                <td className="figure whitespace-nowrap px-4 py-3 text-right align-top">100 %</td>
                <td className="figure hidden whitespace-nowrap px-4 py-3 text-right align-top sm:table-cell">{formatFcfa(SHAREHOLDING.capital, locale)}</td>
              </tr>
            </tfoot>
          </table>
          </div>
          <p className="mt-3 text-xs text-muted">{t.note}</p>
        </div>
      </div>
    </ContentPage>
  );
}
