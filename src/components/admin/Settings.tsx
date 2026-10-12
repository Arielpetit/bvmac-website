"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { usePrefs, type B } from "./prefs";
import { Notice, PageTitle, btnPrimary, cardCls, inputCls } from "./ui";
import { cn } from "@/lib/cn";

type SField = { name: string; label: B; type: "text" | "textarea" | "number" | "date" | "checkbox" | "lines"; help?: B; half?: boolean };
type Section = { key: string; title: B; text: B; fields: SField[] };

const SECTIONS: Record<string, Section> = {
  market: {
    key: "market",
    title: ["Synthèse de la dernière séance", "Last session summary"],
    text: ["Chiffres affichés en tête de la page d’accueil et de la rubrique Marchés.", "Figures shown at the top of the home page and the Markets section."],
    fields: [
      { name: "date", label: ["Date de la séance", "Session date"], type: "date", half: true },
      { name: "securitiesTraded", label: ["Valeurs échangées", "Securities traded"], type: "number", half: true },
      { name: "valueTraded", label: ["Valeur échangée (FCFA)", "Value traded (FCFA)"], type: "number", half: true },
      { name: "equityCapitalisation", label: ["Capitalisation actions (FCFA)", "Equity capitalisation (FCFA)"], type: "number", half: true, help: ["En FCFA, sans espace. Ex. 1795850543600.", "In FCFA, no spaces. E.g. 1795850543600."] },
      { name: "bondOutstanding", label: ["Encours obligataire (FCFA)", "Bonds outstanding (FCFA)"], type: "number", half: true },
    ],
  },
  contact: {
    key: "contact",
    title: ["Coordonnées et réseaux sociaux", "Contact details and social networks"],
    text: ["Affichés dans le pied de page et sur la page Contact.", "Shown in the footer and on the Contact page."],
    fields: [
      { name: "addressLine1", label: ["Adresse (ligne 1)", "Address (line 1)"], type: "text", half: true },
      { name: "addressLine2", label: ["Adresse (ligne 2)", "Address (line 2)"], type: "text", half: true },
      { name: "phone", label: ["Téléphone", "Phone"], type: "text", half: true },
      { name: "fax", label: ["Fax", "Fax"], type: "text", half: true },
      { name: "email", label: ["E-mail", "E-mail"], type: "text", half: true },
      { name: "facebook", label: ["Facebook", "Facebook"], type: "text", half: true },
      { name: "x", label: ["X (Twitter)", "X (Twitter)"], type: "text", half: true },
      { name: "linkedin", label: ["LinkedIn", "LinkedIn"], type: "text", half: true },
      { name: "youtube", label: ["YouTube", "YouTube"], type: "text", half: true },
      { name: "playStore", label: ["Lien Google Play de l’application", "App Google Play link"], type: "text", half: true },
      { name: "appStore", label: ["Lien App Store de l’application", "App Store link"], type: "text", half: true },
    ],
  },
  announcement: {
    key: "announcement",
    title: ["Bandeau d’annonce", "Announcement banner"],
    text: ["Message court affiché en haut de toutes les pages (jour férié, incident, opération en cours).", "Short message shown at the top of every page (public holiday, incident, ongoing operation)."],
    fields: [
      { name: "enabled", label: ["Afficher le bandeau", "Show the banner"], type: "checkbox" },
      { name: "text", label: ["Message", "Message"], type: "text" },
      { name: "link", label: ["Lien (facultatif)", "Link (optional)"], type: "text" },
    ],
  },
  institution: {
    key: "institution",
    title: ["Capital et actionnariat", "Capital and shareholding"],
    text: ["Alimente la page Actionnariat et les chiffres clés.", "Feeds the Shareholding page and key figures."],
    fields: [
      { name: "capital", label: ["Capital social (FCFA)", "Share capital (FCFA)"], type: "number", half: true },
      { name: "shareholdingAsOf", label: ["Répartition au", "Breakdown as of"], type: "date", half: true },
      { name: "shareholding", label: ["Répartition du capital", "Capital breakdown"], type: "lines", help: ["Une ligne par catégorie, au format « Catégorie : pourcentage ».", "One line per category, as “Category: percentage”."] },
    ],
  },
  messages: {
    key: "messages",
    title: ["Messages du Président et du Directeur Général", "Messages from the Chairman and the CEO"],
    text: ["Texte des deux pages de message dans la rubrique Gouvernance. Laissez vide pour garder le texte provisoire.", "Text of the two message pages in the Governance section. Leave empty to keep the placeholder text."],
    fields: [
      { name: "pcaName", label: ["Nom du Président", "Chairman’s name"], type: "text", half: true },
      { name: "pcaQuote", label: ["Phrase mise en avant", "Highlighted sentence"], type: "text", half: true },
      { name: "pcaText", label: ["Message du Président", "Chairman’s message"], type: "textarea", help: ["Un paragraphe par ligne.", "One paragraph per line."] },
      { name: "dgName", label: ["Nom du Directeur Général", "CEO’s name"], type: "text", half: true },
      { name: "dgQuote", label: ["Phrase mise en avant", "Highlighted sentence"], type: "text", half: true },
      { name: "dgText", label: ["Message du Directeur Général", "CEO’s message"], type: "textarea", help: ["Un paragraphe par ligne.", "One paragraph per line."] },
    ],
  },
  security: {
    key: "security",
    title: ["Double authentification obligatoire", "Mandatory two-factor sign-in"],
    text: ["Quand cette option est active, aucun membre ne peut lire les brouillons ni publier sans code de son application d’authentification.", "When this is on, no member can read drafts or publish without a code from their authenticator app."],
    fields: [{ name: "require_2fa", label: ["Exiger la double authentification pour toute l’équipe", "Require two-factor sign-in for the whole team"], type: "checkbox", help: ["Activez d’abord la vôtre dans « Mon compte », sinon vous perdrez l’accès en écriture.", "Turn yours on first in “My account”, otherwise you will lose write access."] }],
  },
};

type Parts = { label: string; value: number }[];
const toLines = (v: unknown) => (Array.isArray(v) ? (v as Parts).map((p) => `${p.label} : ${p.value}`).join("\n") : "");
const fromLines = (s: string): Parts => s.split("\n").map((l) => l.match(/^(.*?)\s*[:=]\s*([\d.,]+)\s*%?$/)).filter(Boolean).map((m) => ({ label: m![1].trim(), value: Number(m![2].replace(",", ".")) }));

function SectionForm({ section, canEdit }: { section: Section; canEdit: boolean }) {
  const db = getBrowserClient();
  const { tr } = usePrefs();
  const [values, setValues] = useState<Record<string, unknown> | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "error" | "ok"; text: string } | null>(null);

  useEffect(() => {
    let live = true;
    db.from("site_settings").select("value").eq("key", section.key).maybeSingle().then(({ data }) => {
      if (!live) return;
      const v = (data?.value ?? {}) as Record<string, unknown>;
      setValues(Object.fromEntries(section.fields.map((f) => [f.name, f.type === "lines" ? toLines(v[f.name]) : (v[f.name] ?? (f.type === "checkbox" ? false : ""))])));
    });
    return () => {
      live = false;
    };
  }, [db, section]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    const value: Record<string, unknown> = {};
    for (const f of section.fields) {
      const v = values[f.name];
      value[f.name] = f.type === "number" ? Number(v) || 0 : f.type === "checkbox" ? Boolean(v) : f.type === "lines" ? fromLines(String(v ?? "")) : String(v ?? "").trim();
    }
    setBusy(true);
    const { error } = await db.from("site_settings").upsert({ key: section.key, value });
    setBusy(false);
    setMsg(error ? { tone: "error", text: error.code === "42501" ? tr(["Réservé aux administrateurs.", "Administrators only."]) : error.message } : { tone: "ok", text: tr(["Enregistré.", "Saved."]) });
  }

  return (
    <form onSubmit={save} className={cn(cardCls, "p-6")}>
      <h2 className="text-h3">{tr(section.title)}</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">{tr(section.text)}</p>
      {values === null ? (
        <p className="mt-5 flex items-center gap-2 text-sm text-muted"><Loader2 className="size-4 animate-spin" aria-hidden="true" /></p>
      ) : (
        <fieldset disabled={!canEdit} className="mt-5 grid gap-x-4 gap-y-4 sm:grid-cols-2">
          {section.fields.map((f) => {
            const id = `s-${section.key}-${f.name}`;
            const set = (v: unknown) => setValues((prev) => ({ ...prev, [f.name]: v }));
            return (
              <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
                {f.type === "checkbox" ? (
                  <label className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm font-medium text-heading">
                    <input type="checkbox" checked={Boolean(values[f.name])} onChange={(e) => set(e.target.checked)} className="size-5 accent-[#c9a23a]" />
                    {tr(f.label)}
                  </label>
                ) : (
                  <>
                    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-heading">{tr(f.label)}</label>
                    {f.type === "textarea" || f.type === "lines" ? (
                      <textarea id={id} rows={f.type === "lines" ? 6 : 7} value={String(values[f.name] ?? "")} onChange={(e) => set(e.target.value)} className={cn(inputCls, "h-auto py-2.5")} />
                    ) : (
                      <input id={id} type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"} value={String(values[f.name] ?? "")} onChange={(e) => set(e.target.value)} className={cn(inputCls, f.type === "number" && "figure")} />
                    )}
                  </>
                )}
                {f.help && <p className="mt-1 text-xs text-muted">{tr(f.help)}</p>}
              </div>
            );
          })}
        </fieldset>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={busy || !canEdit || values === null} className={btnPrimary}>{busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{tr(["Enregistrer", "Save"])}</button>
        {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      </div>
    </form>
  );
}

export function SettingsPage({ title, hint, info, sections, role, children }: { title: B; hint: B; info: B[]; sections: string[]; role: string; children?: React.ReactNode }) {
  const { tr } = usePrefs();
  return (
    <div>
      <PageTitle title={tr(title)} hint={tr(hint)} info={info} />
      {role !== "admin" && <div className="mb-5"><Notice tone="warn">{tr(["Lecture seule : seuls les administrateurs modifient ces réglages.", "Read only: only administrators change these settings."])}</Notice></div>}
      <div className="grid gap-5">
        {sections.map((k) => <SectionForm key={k} section={SECTIONS[k]} canEdit={role === "admin"} />)}
        {children}
      </div>
    </div>
  );
}
