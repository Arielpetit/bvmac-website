"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { ExternalLink } from "lucide-react";
import type { MarketNode } from "@/data/institution";
import { cn } from "@/lib/cn";

// Interactive map of the regional market. Each node is a button; the panel
// beside it gives the role. The same content is listed below for all users.
const LAYOUT: Record<string, string> = {
  cemac: "col-span-6 md:col-start-2 md:col-span-4",
  cosumaf: "col-span-6 md:col-start-2 md:col-span-4",
  bvmac: "col-span-6 md:col-span-2",
  crdv: "col-span-6 md:col-span-2",
  sdb: "col-span-6 md:col-span-2",
  issuers: "col-span-6 md:col-start-2 md:col-span-2",
  investors: "col-span-6 md:col-span-2",
};

export function MarketDiagram({ nodes }: { nodes: MarketNode[] }) {
  const { locale } = useI18n();
  const [active, setActive] = useState("bvmac");
  const current = nodes.find((n) => n.id === active)!;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-4 md:p-6">
        <ul className="grid grid-cols-6 gap-3" role="list">
          {nodes.map((node) => (
            <li key={node.id} className={LAYOUT[node.id]}>
              <button
                type="button"
                aria-pressed={active === node.id}
                onClick={() => setActive(node.id)}
                className={cn(
                  "flex h-full min-h-20 w-full flex-col items-center justify-center rounded-[var(--radius-card)] border px-3 py-3 text-center transition-colors",
                  node.id === "bvmac" && "border-brand-gold",
                  active === node.id
                    ? "border-transparent bg-action text-action-text"
                    : node.id === "cosumaf" || node.id === "cemac"
                      ? "border-line bg-surface-alt hover:border-brand-gold"
                      : "border-line bg-surface hover:border-brand-gold",
                )}
              >
                <span className="text-sm font-medium">{node.name}</span>
                <span className={cn("mt-0.5 text-xs", active === node.id ? "opacity-90" : "text-muted")}>{node.role}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-muted">{{ fr: "Sélectionnez un acteur pour afficher son rôle.", en: "Select a participant to see its role.", es: "Seleccione un participante para ver su función." }[locale]}</p>
      </div>
      <div aria-live="polite" className="rounded-[var(--radius-panel)] bg-espresso p-6 text-brand-sand">
        <p className="eyebrow text-brand-gold-light!">{current.role}</p>
        <h3 className="font-serif-display mt-1 text-2xl text-brand-ivory">{current.name}</h3>
        <ul className="mt-4 grid gap-2 text-sm">
          {current.details.map((d) => (
            <li key={d} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold" />
              {d}
            </li>
          ))}
        </ul>
        {current.href && (
          <a href={current.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand-gold-light underline underline-offset-4">
            {{ fr: "Site officiel", en: "Official website", es: "Sitio oficial" }[locale]} <ExternalLink aria-hidden="true" className="size-3.5" />
            <span className="sr-only">(site externe, nouvel onglet)</span>
          </a>
        )}
      </div>
    </div>
  );
}
