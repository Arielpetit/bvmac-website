import { ArrowRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import type { Locale } from "@/i18n/config";

type Flow = { caption: string; nodes: { label: string; sub: string }[] };

const FLOWS: Record<Locale, Record<string, Flow>> = {
  fr: {
    "comprendre-la-bourse": { caption: "Marché primaire puis marché secondaire", nodes: [{ label: "Émetteur", sub: "lève des fonds" }, { label: "Marché primaire", sub: "émission de titres" }, { label: "Investisseurs", sub: "achètent les titres" }, { label: "Marché secondaire", sub: "échanges quotidiens" }] },
    "qui-fait-quoi": { caption: "Les acteurs du marché régional", nodes: [{ label: "COSUMAF", sub: "régule et surveille" }, { label: "BVMAC", sub: "organise la cotation" }, { label: "Sociétés de bourse", sub: "exécutent les ordres" }, { label: "Dépositaire", sub: "conserve les titres" }] },
    "passer-un-ordre": { caption: "Le parcours d’un ordre de bourse", nodes: [{ label: "Vous", sub: "donnez l’ordre" }, { label: "Société de bourse", sub: "le transmet" }, { label: "Séance BVMAC", sub: "confrontation des ordres" }, { label: "Règlement-livraison", sub: "titres contre paiement" }] },
    "etapes-introduction": { caption: "De la préparation à la cote", nodes: [{ label: "Préparation", sub: "comptes, gouvernance" }, { label: "Dossier", sub: "BVMAC et COSUMAF" }, { label: "Offre au public", sub: "souscription" }, { label: "Première cotation", sub: "négociation" }] },
  },
  en: {
    "comprendre-la-bourse": { caption: "Primary market, then secondary market", nodes: [{ label: "Issuer", sub: "raises funds" }, { label: "Primary market", sub: "securities issued" }, { label: "Investors", sub: "buy the securities" }, { label: "Secondary market", sub: "daily trading" }] },
    "qui-fait-quoi": { caption: "The players in the regional market", nodes: [{ label: "COSUMAF", sub: "regulates and supervises" }, { label: "BVMAC", sub: "runs trading" }, { label: "Brokers", sub: "execute orders" }, { label: "Depository", sub: "holds the securities" }] },
    "passer-un-ordre": { caption: "The journey of a stock market order", nodes: [{ label: "You", sub: "give the order" }, { label: "Broker", sub: "passes it on" }, { label: "BVMAC session", sub: "orders are matched" }, { label: "Settlement", sub: "securities against payment" }] },
    "etapes-introduction": { caption: "From preparation to listing", nodes: [{ label: "Preparation", sub: "accounts, governance" }, { label: "Application", sub: "BVMAC and COSUMAF" }, { label: "Public offering", sub: "subscription" }, { label: "First listing", sub: "trading" }] },
  },
  es: {
    "comprendre-la-bourse": { caption: "Mercado primario y después mercado secundario", nodes: [{ label: "Emisor", sub: "capta fondos" }, { label: "Mercado primario", sub: "emisión de valores" }, { label: "Inversores", sub: "compran los valores" }, { label: "Mercado secundario", sub: "intercambios diarios" }] },
    "qui-fait-quoi": { caption: "Los actores del mercado regional", nodes: [{ label: "COSUMAF", sub: "regula y supervisa" }, { label: "BVMAC", sub: "organiza la cotización" }, { label: "Sociedades de bolsa", sub: "ejecutan las órdenes" }, { label: "Depositario", sub: "conserva los valores" }] },
    "passer-un-ordre": { caption: "El recorrido de una orden de bolsa", nodes: [{ label: "Usted", sub: "da la orden" }, { label: "Sociedad de bolsa", sub: "la transmite" }, { label: "Sesión BVMAC", sub: "casamiento de órdenes" }, { label: "Liquidación", sub: "valores contra pago" }] },
    "etapes-introduction": { caption: "De la preparación a la cotización", nodes: [{ label: "Preparación", sub: "cuentas, gobernanza" }, { label: "Expediente", sub: "BVMAC y COSUMAF" }, { label: "Oferta pública", sub: "suscripción" }, { label: "Primera cotización", sub: "negociación" }] },
  },
};

const BOND = {
  fr: { buy: "Achat", year: "An", caption: "Obligation de nominal 100 et coupon de 6 % sur 5 ans : un coupon chaque année, puis le remboursement du nominal à l’échéance." },
  en: { buy: "Purchase", year: "Year", caption: "Bond with a face value of 100 and a 6% coupon over 5 years: one coupon each year, then repayment of the face value at maturity." },
  es: { buy: "Compra", year: "Año", caption: "Obligación de nominal 100 y cupón del 6 % a 5 años: un cupón cada año y, al vencimiento, el reembolso del nominal." },
};

// Simple explanatory diagrams for selected lessons (HTML, readable by screen readers).
export function LessonDiagram({ slug, locale = "fr" }: { slug: string; locale?: Locale }) {
  if (slug === "investir-dans-une-obligation") return <BondDiagram locale={locale} />;
  const flow = FLOWS[locale][slug];
  if (!flow) return null;
  return (
    <figure className="rounded-[var(--radius-card)] border border-line bg-surface-alt p-4 sm:p-6">
      <Stagger as="ol" className="grid gap-3 md:grid-cols-4">
        {flow.nodes.map((n, i) => (
          <StaggerItem as="li" key={n.label} className="relative flex flex-col items-center gap-2 md:block">
            <div className="w-full rounded-2xl border border-line bg-surface p-4 text-center">
              <span className="figure text-xs text-accent-text">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-1 font-medium text-heading">{n.label}</p>
              <p className="text-xs text-muted">{n.sub}</p>
            </div>
            {i < flow.nodes.length - 1 && <ArrowRight aria-hidden="true" className="size-4 shrink-0 rotate-90 text-brand-gold md:absolute md:-right-3.5 md:top-1/2 md:-translate-y-1/2 md:rotate-0" />}
          </StaggerItem>
        ))}
      </Stagger>
      <figcaption className="mt-4 text-center text-xs text-muted">{flow.caption}</figcaption>
    </figure>
  );
}

function BondDiagram({ locale }: { locale: Locale }) {
  const t = BOND[locale];
  const years = [1, 2, 3, 4, 5];
  return (
    <figure className="rounded-[var(--radius-card)] border border-line bg-surface-alt p-4 sm:p-6">
      <svg viewBox="0 0 520 220" className="h-auto w-full" role="img" aria-labelledby="bond-cap">
        <line x1="40" y1="150" x2="500" y2="150" stroke="var(--line-strong)" />
        <rect x="40" y="150" width="44" height="60" rx="6" fill="var(--fall)" opacity="0.75" />
        <text x="62" y="205" textAnchor="middle" fontSize="11" fill="#fff">−100</text>
        <text x="62" y="140" textAnchor="middle" fontSize="11" fill="var(--text-muted)">{t.buy}</text>
        {years.map((y) => {
          const x = 40 + y * 88;
          const last = y === years.length;
          const h = last ? 120 : 20;
          return (
            <g key={y}>
              <rect x={x} y={150 - h} width="44" height={h} rx="6" fill={last ? "var(--chart-fill)" : "var(--rise)"} opacity="0.85" />
              <text x={x + 22} y={145 - h} textAnchor="middle" fontSize="11" fill="var(--text)">{last ? "+100 + 6" : "+6"}</text>
              <text x={x + 22} y="168" textAnchor="middle" fontSize="11" fill="var(--text-muted)">{t.year} {y}</text>
            </g>
          );
        })}
      </svg>
      <figcaption id="bond-cap" className="mt-2 text-center text-xs text-muted">{t.caption}</figcaption>
    </figure>
  );
}
