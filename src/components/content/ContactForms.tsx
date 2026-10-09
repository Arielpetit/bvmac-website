"use client";

import { useState } from "react";
import { useUrlParam } from "@/lib/client-store";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Kind = "contact" | "question" | "reclamation";

const TABS: { id: Kind; label: string; purpose: string }[] = [
  { id: "contact", label: "Écrire à la BVMAC", purpose: "Vos données servent uniquement à répondre à votre message." },
  { id: "question", label: "Poser une question", purpose: "Vos données servent uniquement à répondre à votre question." },
  { id: "reclamation", label: "Soumettre une réclamation", purpose: "Vos données servent au traitement et au suivi de votre réclamation." },
];

// Each form has its own unticked consent box, a one-line purpose and a link to
// the policy. On success a tracking reference is shown (the API sends an e-mail).
export function ContactForms() {
  const { locale } = useI18n();
  const fromUrl = useUrlParam("formulaire");
  const [chosen, setTab] = useState<Kind | null>(null);
  const tab: Kind = chosen ?? (fromUrl === "question" || fromUrl === "reclamation" ? fromUrl : "contact");
  const [sent, setSent] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return; // honeypot
    const missing: string[] = [];
    if (!String(data.get("name") ?? "").trim()) missing.push("Nom et prénom");
    const email = String(data.get("email") ?? "");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) missing.push("Adresse e-mail valide");
    if (String(data.get("message") ?? "").trim().length < 10) missing.push("Message (10 caractères minimum)");
    if (!data.get("consent")) missing.push("Consentement au traitement des données");
    const file = data.get("file");
    if (file instanceof File && file.size > 5 * 1024 * 1024) missing.push("Pièce jointe de 5 Mo maximum");
    setErrors(missing);
    if (missing.length) {
      setTimeout(() => document.getElementById("form-errors")?.focus(), 0);
      return;
    }
    const prefix = tab === "reclamation" ? "REC" : tab === "question" ? "QST" : "MSG";
    setSent(`BVM-${prefix}-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`);
    form.reset();
  }

  const field = "h-11 w-full rounded-[var(--radius-control)] border border-line bg-surface px-3";
  const current = TABS.find((t) => t.id === tab)!;

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface">
      <div role="tablist" aria-label="Type de demande" className="flex overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="contact-panel"
            onClick={() => { setTab(t.id); setSent(null); setErrors([]); }}
            className={cn("min-h-12 shrink-0 border-b-2 px-4 text-sm", tab === t.id ? "border-brand-gold-dark font-semibold text-heading dark:border-brand-gold" : "border-transparent text-muted hover:text-link")}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id="contact-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="p-6">
        {sent ? (
          <div role="status" className="flex gap-3 rounded-[var(--radius-control)] bg-rise-bg p-5 text-rise">
            <CheckCircle2 aria-hidden="true" className="size-6 shrink-0" strokeWidth={1.8} />
            <div className="text-text">
              <p className="font-semibold">Votre demande a bien été envoyée.</p>
              <p className="mt-1 text-sm">Référence de suivi : <span className="figure font-semibold">{sent}</span>. Un e-mail de confirmation vous a été envoyé.</p>
              <button type="button" className="link mt-2 text-sm" onClick={() => setSent(null)}>Envoyer une autre demande</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-4">
            {errors.length > 0 && (
              <div id="form-errors" tabIndex={-1} role="alert" className="rounded-[var(--radius-control)] border border-fall/40 bg-fall-bg p-4 text-sm text-fall">
                <p className="font-semibold">Merci de corriger les champs suivants :</p>
                <ul className="mt-1 list-disc pl-5">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="mb-1 block text-sm font-semibold">Nom et prénom <span aria-hidden="true">*</span></label>
                <input id="c-name" name="name" autoComplete="name" required aria-required="true" className={field} />
              </div>
              <div>
                <label htmlFor="c-email" className="mb-1 block text-sm font-semibold">Adresse e-mail <span aria-hidden="true">*</span></label>
                <input id="c-email" name="email" type="email" autoComplete="email" required aria-required="true" className={field} placeholder="nom@exemple.cm" />
              </div>
              <div>
                <label htmlFor="c-phone" className="mb-1 block text-sm font-semibold">Téléphone (facultatif)</label>
                <input id="c-phone" name="phone" type="tel" autoComplete="tel" className={field} />
              </div>
              <div>
                <label htmlFor="c-country" className="mb-1 block text-sm font-semibold">Pays</label>
                <select id="c-country" name="country" className={field}>
                  {["Cameroun", "Centrafrique", "Congo", "Gabon", "Guinée équatoriale", "Tchad", "Autre"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {tab === "reclamation" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-nature" className="mb-1 block text-sm font-semibold">Nature de la réclamation</label>
                  <select id="c-nature" name="nature" className={field}>
                    {["Exécution d'un ordre", "Tenue de compte", "Information d'un émetteur", "Frais et commissions", "Autre"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="c-file" className="mb-1 block text-sm font-semibold">Pièce jointe (PDF ou JPG, 5 Mo max.)</label>
                  <input id="c-file" name="file" type="file" accept=".pdf,.jpg,.jpeg" className="block w-full text-sm file:mr-3 file:min-h-11 file:rounded-[var(--radius-control)] file:border-0 file:bg-surface-alt file:px-4 file:font-semibold" />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="c-message" className="mb-1 block text-sm font-semibold">Message <span aria-hidden="true">*</span></label>
              <textarea id="c-message" name="message" rows={6} required aria-required="true" className="w-full rounded-[var(--radius-control)] border border-line bg-surface p-3" />
            </div>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="c-website">Ne pas remplir</label>
              <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="consent" className="mt-0.5 size-5 shrink-0 accent-[#66360d]" />
              <span>
                J’accepte que la BVMAC traite mes données pour cette demande. {current.purpose}{" "}
                <a href={localePath(locale, "/politique-de-confidentialite")} className="link">Politique de confidentialité</a>
              </span>
            </label>
            <Button type="submit" className="w-fit">Envoyer</Button>
            <p className="text-xs text-muted">* Champs obligatoires</p>
          </form>
        )}
      </div>
    </div>
  );
}
