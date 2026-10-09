import { ArrowRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

type Flow = { caption: string; nodes: { label: string; sub: string }[] };

const FLOWS: Record<string, Flow> = {
  "comprendre-la-bourse": { caption: "Marché primaire puis marché secondaire", nodes: [{ label: "Émetteur", sub: "lève des fonds" }, { label: "Marché primaire", sub: "émission de titres" }, { label: "Investisseurs", sub: "achètent les titres" }, { label: "Marché secondaire", sub: "échanges quotidiens" }] },
  "qui-fait-quoi": { caption: "Les acteurs du marché régional", nodes: [{ label: "COSUMAF", sub: "régule et surveille" }, { label: "BVMAC", sub: "organise la cotation" }, { label: "Sociétés de bourse", sub: "exécutent les ordres" }, { label: "Dépositaire", sub: "conserve les titres" }] },
  "passer-un-ordre": { caption: "Le parcours d’un ordre de bourse", nodes: [{ label: "Vous", sub: "donnez l’ordre" }, { label: "Société de bourse", sub: "le transmet" }, { label: "Séance BVMAC", sub: "confrontation des ordres" }, { label: "Règlement-livraison", sub: "titres contre paiement" }] },
  "etapes-introduction": { caption: "De la préparation à la cote", nodes: [{ label: "Préparation", sub: "comptes, gouvernance" }, { label: "Dossier", sub: "BVMAC et COSUMAF" }, { label: "Offre au public", sub: "souscription" }, { label: "Première cotation", sub: "négociation" }] },
};

// Simple explanatory diagrams for selected lessons (HTML, readable by screen readers).
export function LessonDiagram({ slug }: { slug: string }) {
  if (slug === "investir-dans-une-obligation") return <BondDiagram />;
  const flow = FLOWS[slug];
  if (!flow) return null;
  return (
    <figure className="rounded-[var(--radius-card)] border border-line bg-surface-alt p-6">
      <Stagger as="ol" className="grid gap-3 md:grid-cols-4">
        {flow.nodes.map((n, i) => (
          <StaggerItem as="li" key={n.label} className="relative flex items-center gap-3 md:block">
            <div className="flex-1 rounded-2xl border border-line bg-surface p-4 text-center">
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

function BondDiagram() {
  const years = [1, 2, 3, 4, 5];
  return (
    <figure className="rounded-[var(--radius-card)] border border-line bg-surface-alt p-6">
      <svg viewBox="0 0 520 220" className="h-auto w-full" role="img" aria-labelledby="bond-cap">
        <line x1="40" y1="150" x2="500" y2="150" stroke="var(--line-strong)" />
        <rect x="40" y="150" width="44" height="60" rx="6" fill="var(--fall)" opacity="0.75" />
        <text x="62" y="205" textAnchor="middle" fontSize="11" fill="#fff">−100</text>
        <text x="62" y="140" textAnchor="middle" fontSize="11" fill="var(--text-muted)">Achat</text>
        {years.map((y) => {
          const x = 40 + y * 88;
          const last = y === years.length;
          const h = last ? 120 : 20;
          return (
            <g key={y}>
              <rect x={x} y={150 - h} width="44" height={h} rx="6" fill={last ? "var(--chart-fill)" : "var(--rise)"} opacity="0.85" />
              <text x={x + 22} y={145 - h} textAnchor="middle" fontSize="11" fill="var(--text)">{last ? "+100 + 6" : "+6"}</text>
              <text x={x + 22} y="168" textAnchor="middle" fontSize="11" fill="var(--text-muted)">An {y}</text>
            </g>
          );
        })}
      </svg>
      <figcaption id="bond-cap" className="mt-2 text-center text-xs text-muted">Obligation de nominal 100 et coupon de 6 % sur 5 ans : un coupon chaque année, puis le remboursement du nominal à l’échéance.</figcaption>
    </figure>
  );
}
