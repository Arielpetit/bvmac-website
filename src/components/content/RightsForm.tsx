"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const RIGHTS = ["Accès à mes données", "Rectification", "Effacement", "Opposition", "Limitation", "Portabilité", "Retrait du consentement"];

// Request to exercise data-protection rights. Sent to the DPO; a reference is shown on success.
export function RightsForm() {
  const [ref, setRef] = useState<string | null>(null);
  const [error, setError] = useState("");
  const field = "h-11 w-full rounded-full border border-line bg-surface px-5";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!String(data.get("name") ?? "").trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(data.get("email") ?? "")) || !data.get("consent")) {
      setError("Renseignez votre nom, une adresse e-mail valide et cochez la case de consentement.");
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
              <p className="text-h3">Demande enregistrée</p>
              <p className="mt-1 text-sm text-muted">Référence <span className="code text-heading">{ref}</span>. Le délégué à la protection des données vous répondra dans un délai d’un mois.</p>
              <button type="button" onClick={() => setRef(null)} className="link mt-3 text-sm">Nouvelle demande</button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate className="grid gap-4 md:grid-cols-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-h3 md:col-span-2">Exercer mes droits</p>
            <div>
              <label htmlFor="r-name" className="mb-1.5 block text-sm font-medium">Nom et prénom</label>
              <input id="r-name" name="name" autoComplete="name" className={field} />
            </div>
            <div>
              <label htmlFor="r-email" className="mb-1.5 block text-sm font-medium">Adresse e-mail</label>
              <input id="r-email" name="email" type="email" autoComplete="email" className={field} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="r-right" className="mb-1.5 block text-sm font-medium">Droit concerné</label>
              <select id="r-right" name="right" className={field}>{RIGHTS.map((r) => <option key={r}>{r}</option>)}</select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="r-details" className="mb-1.5 block text-sm font-medium">Précisions (facultatif)</label>
              <textarea id="r-details" name="details" rows={4} className="w-full rounded-2xl border border-line bg-surface px-5 py-3" />
            </div>
            <label className="flex gap-3 text-sm md:col-span-2">
              <input type="checkbox" name="consent" className="mt-1 size-4 accent-[#c9a23a]" />
              J’accepte que ces informations soient utilisées uniquement pour traiter ma demande. Une pièce d’identité pourra m’être demandée.
            </label>
            {error && <p role="alert" className="text-sm text-fall md:col-span-2">{error}</p>}
            <button type="submit" className="h-11 w-fit rounded-full bg-action px-6 text-sm font-medium text-action-text hover:bg-action-hover">Envoyer la demande</button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
