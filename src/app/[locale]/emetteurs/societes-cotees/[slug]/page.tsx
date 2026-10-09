import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveLocale } from "@/lib/i18n-server";
import { crumbs } from "@/lib/page-helpers";
import { getEquity, getNotices, getPriceHistory } from "@/lib/api";
import { EQUITIES } from "@/data/market";
import { locales } from "@/i18n/config";
import { SecurityProfile } from "@/components/market/SecurityProfile";

// Every variant is prerendered from generateStaticParams.
export const instant = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => EQUITIES.map((e) => ({ locale, slug: e.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/emetteurs/societes-cotees/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = EQUITIES.find((x) => x.slug === slug);
  return { title: e ? `${e.shortName} – ${e.name}` : undefined, description: e?.bio.slice(0, 160) };
}

export default async function IssuerPage({ params }: PageProps<"/[locale]/emetteurs/societes-cotees/[slug]">) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const e = await getEquity(slug);
  if (!e) notFound();
  const [history, notices] = await Promise.all([getPriceHistory(slug, 400), getNotices()]);
  const related = notices.filter((n) => n.issuer && (n.issuer.toUpperCase().includes(e.shortName.toUpperCase().split(" ")[0]) || n.original.toUpperCase().includes(e.ticker)));
  return (
    <SecurityProfile e={e} history={history} notices={related} locale={locale} dict={dict} mode="issuer" breadcrumb={crumbs(locale, dict, "issuers", dict.nav.items.listed, [{ label: e.shortName }])} />
  );
}
