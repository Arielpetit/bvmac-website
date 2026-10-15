"use client";

import { useState } from "react";
import { useUrlParam } from "@/lib/client-store";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Kind = "contact" | "question" | "reclamation";

const L = {
  fr: {
    tabs: { contact: ["Écrire à la BVMAC", "Vos données servent uniquement à répondre à votre message."], question: ["Poser une question", "Vos données servent uniquement à répondre à votre question."], reclamation: ["Soumettre une réclamation", "Vos données servent au traitement et au suivi de votre réclamation."] },
    missing: { name: "Nom et prénom", email: "Adresse e-mail valide", message: "Message (10 caractères minimum)", consent: "Consentement au traitement des données", file: "Pièce jointe de 5 Mo maximum" },
    type: "Type de demande", sent: "Votre demande a bien été envoyée.", ref: "Référence de suivi", confirm: "Un e-mail de confirmation vous a été envoyé.", another: "Envoyer une autre demande", fix: "Merci de corriger les champs suivants :",
    name: "Nom et prénom", email: "Adresse e-mail", phone: "Téléphone (facultatif)", country: "Pays", countries: ["Cameroun", "Centrafrique", "Congo", "Gabon", "Guinée équatoriale", "Tchad", "Autre"],
    nature: "Nature de la réclamation", natures: ["Exécution d’un ordre", "Tenue de compte", "Information d’un émetteur", "Frais et commissions", "Autre"], file: "Pièce jointe (PDF ou JPG, 5 Mo max.)", message: "Message", honeypot: "Ne pas remplir",
    consent: "J’accepte que la BVMAC traite mes données pour cette demande.", policy: "Politique de confidentialité", send: "Envoyer", required: "* Champs obligatoires", emailPh: "nom@exemple.cm",
  },
  en: {
    tabs: { contact: ["Write to the BVMAC", "Your data is used only to reply to your message."], question: ["Ask a question", "Your data is used only to answer your question."], reclamation: ["File a complaint", "Your data is used to handle and follow up your complaint."] },
    missing: { name: "Full name", email: "Valid e-mail address", message: "Message (at least 10 characters)", consent: "Consent to data processing", file: "Attachment of 5 MB maximum" },
    type: "Type of request", sent: "Your request has been sent.", ref: "Tracking reference", confirm: "A confirmation e-mail has been sent to you.", another: "Send another request", fix: "Please correct the following fields:",
    name: "Full name", email: "E-mail address", phone: "Phone (optional)", country: "Country", countries: ["Cameroon", "Central African Republic", "Congo", "Gabon", "Equatorial Guinea", "Chad", "Other"],
    nature: "Type of complaint", natures: ["Order execution", "Account keeping", "Issuer information", "Fees and commissions", "Other"], file: "Attachment (PDF or JPG, 5 MB max.)", message: "Message", honeypot: "Do not fill in",
    consent: "I agree that the BVMAC may process my data for this request.", policy: "Privacy policy", send: "Send", required: "* Required fields", emailPh: "name@example.com",
  },
  es: {
    tabs: { contact: ["Escribir a la BVMAC", "Sus datos solo se usan para responder a su mensaje."], question: ["Hacer una pregunta", "Sus datos solo se usan para responder a su pregunta."], reclamation: ["Presentar una reclamación", "Sus datos se usan para tramitar y seguir su reclamación."] },
    missing: { name: "Nombre y apellidos", email: "Dirección de correo válida", message: "Mensaje (10 caracteres como mínimo)", consent: "Consentimiento al tratamiento de los datos", file: "Archivo adjunto de 5 MB como máximo" },
    type: "Tipo de solicitud", sent: "Su solicitud se ha enviado.", ref: "Referencia de seguimiento", confirm: "Le hemos enviado un correo de confirmación.", another: "Enviar otra solicitud", fix: "Corrija los campos siguientes:",
    name: "Nombre y apellidos", email: "Correo electrónico", phone: "Teléfono (opcional)", country: "País", countries: ["Camerún", "República Centroafricana", "Congo", "Gabón", "Guinea Ecuatorial", "Chad", "Otro"],
    nature: "Tipo de reclamación", natures: ["Ejecución de una orden", "Llevanza de la cuenta", "Información de un emisor", "Gastos y comisiones", "Otro"], file: "Archivo adjunto (PDF o JPG, 5 MB máx.)", message: "Mensaje", honeypot: "No rellenar",
    consent: "Acepto que la BVMAC trate mis datos para esta solicitud.", policy: "Política de privacidad", send: "Enviar", required: "* Campos obligatorios", emailPh: "nombre@ejemplo.com",
  },
};
const KINDS: Kind[] = ["contact", "question", "reclamation"];

// Each form has its own unticked consent box, a one-line purpose and a link to
// the policy. On success a tracking reference is shown (the API sends an e-mail).
export function ContactForms() {
  const { locale } = useI18n();
  const l = L[locale];
  const TABS = KINDS.map((id) => ({ id, label: l.tabs[id][0], purpose: l.tabs[id][1] }));
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
    if (!String(data.get("name") ?? "").trim()) missing.push(l.missing.name);
    const email = String(data.get("email") ?? "");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) missing.push(l.missing.email);
    if (String(data.get("message") ?? "").trim().length < 10) missing.push(l.missing.message);
    if (!data.get("consent")) missing.push(l.missing.consent);
    const file = data.get("file");
    if (file instanceof File && file.size > 5 * 1024 * 1024) missing.push(l.missing.file);
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
      <div role="tablist" aria-label={l.type} className="flex overflow-x-auto border-b border-line">
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
              <p className="font-semibold">{l.sent}</p>
              <p className="mt-1 text-sm">{l.ref} : <span className="figure font-semibold">{sent}</span>. {l.confirm}</p>
              <button type="button" className="link mt-2 text-sm" onClick={() => setSent(null)}>{l.another}</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-4">
            {errors.length > 0 && (
              <div id="form-errors" tabIndex={-1} role="alert" className="rounded-[var(--radius-control)] border border-fall/40 bg-fall-bg p-4 text-sm text-fall">
                <p className="font-semibold">{l.fix}</p>
                <ul className="mt-1 list-disc pl-5">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="mb-1 block text-sm font-semibold">{l.name} <span aria-hidden="true">*</span></label>
                <input id="c-name" name="name" autoComplete="name" required aria-required="true" className={field} />
              </div>
              <div>
                <label htmlFor="c-email" className="mb-1 block text-sm font-semibold">{l.email} <span aria-hidden="true">*</span></label>
                <input id="c-email" name="email" type="email" autoComplete="email" required aria-required="true" className={field} placeholder={l.emailPh} />
              </div>
              <div>
                <label htmlFor="c-phone" className="mb-1 block text-sm font-semibold">{l.phone}</label>
                <input id="c-phone" name="phone" type="tel" autoComplete="tel" className={field} />
              </div>
              <div>
                <label htmlFor="c-country" className="mb-1 block text-sm font-semibold">{l.country}</label>
                <select id="c-country" name="country" className={field}>
                  {l.countries.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {tab === "reclamation" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-nature" className="mb-1 block text-sm font-semibold">{l.nature}</label>
                  <select id="c-nature" name="nature" className={field}>
                    {l.natures.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="c-file" className="mb-1 block text-sm font-semibold">{l.file}</label>
                  <input id="c-file" name="file" type="file" accept=".pdf,.jpg,.jpeg" className="block w-full text-sm file:mr-3 file:min-h-11 file:rounded-[var(--radius-control)] file:border-0 file:bg-surface-alt file:px-4 file:font-semibold" />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="c-message" className="mb-1 block text-sm font-semibold">{l.message} <span aria-hidden="true">*</span></label>
              <textarea id="c-message" name="message" rows={6} required aria-required="true" className="w-full rounded-[var(--radius-control)] border border-line bg-surface p-3" />
            </div>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="c-website">{l.honeypot}</label>
              <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="consent" className="mt-0.5 size-5 shrink-0 accent-[#66360d]" />
              <span>
                {l.consent} {current.purpose}{" "}
                <a href={localePath(locale, "/politique-de-confidentialite")} className="link">{l.policy}</a>
              </span>
            </label>
            <Button type="submit" className="w-fit">{l.send}</Button>
            <p className="text-xs text-muted">{l.required}</p>
          </form>
        )}
      </div>
    </div>
  );
}
