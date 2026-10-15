"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/provider";

const L = {
  fr: { rights: ["Accès à mes données", "Rectification", "Effacement", "Opposition", "Limitation", "Portabilité", "Retrait du consentement"], error: "Renseignez votre nom, une adresse e-mail valide et cochez la case de consentement.", saved: "Demande enregistrée", ref: "Référence", reply: "Le délégué à la protection des données vous répondra dans un délai d’un mois.", again: "Nouvelle demande", title: "Exercer mes droits", name: "Nom et prénom", email: "Adresse e-mail", right: "Droit concerné", details: "Précisions (facultatif)", consent: "J’accepte que ces informations soient utilisées uniquement pour traiter ma demande. Une pièce d’identité pourra m’être demandée.", send: "Envoyer la demande" },
  en: { rights: ["Access to my data", "Rectification", "Erasure", "Objection", "Restriction", "Portability", "Withdrawal of consent"], error: "Enter your name and a valid e-mail address, and tick the consent box.", saved: "Request recorded", ref: "Reference", reply: "The data protection officer will reply within one month.", again: "New request", title: "Exercise my rights", name: "Full name", email: "E-mail address", right: "Right concerned", details: "Details (optional)", consent: "I agree that this information is used only to process my request. Proof of identity may be requested.", send: "Send the request" },
  es: { rights: ["Acceso a mis datos", "Rectificación", "Supresión", "Oposición", "Limitación", "Portabilidad", "Retirada del consentimiento"], error: "Indique su nombre y una dirección de correo válida, y marque la casilla de consentimiento.", saved: "Solicitud registrada", ref: "Referencia", reply: "El delegado de protección de datos le responderá en el plazo de un mes.", again: "Nueva solicitud", title: "Ejercer mis derechos", name: "Nombre y apellidos", email: "Correo electrónico", right: "Derecho afectado", details: "Detalles (opcional)", consent: "Acepto que esta información se utilice únicamente para tramitar mi solicitud. Se me podrá pedir un documento de identidad.", send: "Enviar la solicitud" },
};

// Request to exercise data-protection rights. Sent to the DPO; a reference is shown on success.
export function RightsForm() {
  const { locale } = useI18n();
  const l = L[locale];
  const [ref, setRef] = useState<string | null>(null);
  const [error, setError] = useState("");
  const field = "h-11 w-full rounded-full border border-line bg-surface px-5";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!String(data.get("name") ?? "").trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(data.get("email") ?? "")) || !data.get("consent")) {
      setError(l.error);
      return;
    }
    setError("");
    setRef(`BVM-DPO-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`);
    e.currentTarget.reset();
  }

  return (
    <div className="not-prose rounded-[var(--radius-panel)] border border-line bg-surface p-6 md:p-8">
      <AnimatePresence mode="wait">
        {ref ? (
          <motion.div key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status" className="flex gap-4">
            <CheckCircle2 aria-hidden="true" className="size-7 shrink-0 text-rise" />
            <div>
              <p className="text-h3">{l.saved}</p>
              <p className="mt-1 text-sm text-muted">{l.ref} <span className="code text-heading">{ref}</span>. {l.reply}</p>
              <button type="button" onClick={() => setRef(null)} className="link mt-3 text-sm">{l.again}</button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate className="grid gap-4 md:grid-cols-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-h3 md:col-span-2">{l.title}</p>
            <div>
              <label htmlFor="r-name" className="mb-1.5 block text-sm font-medium">{l.name}</label>
              <input id="r-name" name="name" autoComplete="name" className={field} />
            </div>
            <div>
              <label htmlFor="r-email" className="mb-1.5 block text-sm font-medium">{l.email}</label>
              <input id="r-email" name="email" type="email" autoComplete="email" className={field} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="r-right" className="mb-1.5 block text-sm font-medium">{l.right}</label>
              <select id="r-right" name="right" className={field}>{l.rights.map((r) => <option key={r}>{r}</option>)}</select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="r-details" className="mb-1.5 block text-sm font-medium">{l.details}</label>
              <textarea id="r-details" name="details" rows={4} className="w-full rounded-2xl border border-line bg-surface px-5 py-3" />
            </div>
            <label className="flex gap-3 text-sm md:col-span-2">
              <input type="checkbox" name="consent" className="mt-1 size-4 accent-[#c9a23a]" />
              {l.consent}
            </label>
            {error && <p role="alert" className="text-sm text-fall md:col-span-2">{error}</p>}
            <button type="submit" className="h-11 w-fit rounded-full bg-action px-6 text-sm font-medium text-action-text hover:bg-action-hover">{l.send}</button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
