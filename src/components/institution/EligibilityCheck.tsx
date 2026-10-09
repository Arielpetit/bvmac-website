"use client";

import { useState } from "react";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Indicative check against the A-Premium criteria published by the BVMAC.
// Runs in the browser only; nothing is sent or stored.
export function EligibilityCheck() {
  const [capital, setCapital] = useState("");
  const [cap, setCap] = useState("");
  const [float, setFloat] = useState("");
  const [years, setYears] = useState("3");
  const [result, setResult] = useState<null | { ok: boolean; checks: { label: string; ok: boolean; detail: string }[] }>(null);

  function run(e: React.FormEvent) {
    e.preventDefault();
    const capitalN = Number(capital.replace(/\s/g, "")) * 1_000_000;
    const capN = Number(cap.replace(/\s/g, "")) * 1_000_000_000;
    const floatN = Number(float.replace(",", "."));
    const required = capN < 50e9 ? 20 : capN < 100e9 ? 15 : 10;
    const checks = [
      { label: "Capital social entièrement libéré d'au moins 100 millions FCFA", ok: capitalN >= 100_000_000, detail: `Saisi : ${capital || "0"} millions FCFA` },
      { label: "Capitalisation boursière à l'introduction d'au moins 10 milliards FCFA", ok: capN >= 10e9, detail: `Saisi : ${cap || "0"} milliards FCFA` },
      { label: `Diffusion dans le public d'au moins ${required} % du capital`, ok: floatN >= required, detail: `Saisi : ${float || "0"} %` },
      { label: "États financiers certifiés sur les derniers exercices (à confirmer)", ok: Number(years) >= 3, detail: `Saisi : ${years} exercice(s)` },
    ];
    setResult({ ok: checks.every((c) => c.ok), checks });
  }

  const field = "h-11 w-full rounded-[var(--radius-control)] border border-line bg-surface px-3 figure";
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={run} className="grid gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <div>
          <label htmlFor="el-capital" className="mb-1 block text-sm font-semibold">Capital social libéré (millions FCFA)</label>
          <input id="el-capital" inputMode="numeric" required value={capital} onChange={(e) => setCapital(e.target.value)} className={field} placeholder="150" />
        </div>
        <div>
          <label htmlFor="el-cap" className="mb-1 block text-sm font-semibold">Capitalisation attendue à l’introduction (milliards FCFA)</label>
          <input id="el-cap" inputMode="decimal" required value={cap} onChange={(e) => setCap(e.target.value)} className={field} placeholder="25" />
        </div>
        <div>
          <label htmlFor="el-float" className="mb-1 block text-sm font-semibold">Part du capital proposée au public (%)</label>
          <input id="el-float" inputMode="decimal" required value={float} onChange={(e) => setFloat(e.target.value)} className={field} placeholder="20" />
        </div>
        <div>
          <label htmlFor="el-years" className="mb-1 block text-sm font-semibold">Exercices avec états financiers certifiés</label>
          <select id="el-years" value={years} onChange={(e) => setYears(e.target.value)} className={field}>
            {["0", "1", "2", "3", "4", "5"].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
        <Button type="submit" className="w-fit">Vérifier</Button>
        <p className="text-xs text-muted">Simulation indicative et non contractuelle. Aucune donnée n’est envoyée ni conservée.</p>
      </form>
      <div aria-live="polite">
        {result ? (
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <p className={`font-serif-display text-2xl ${result.ok ? "text-rise" : "text-heading"}`}>
              {result.ok ? "Votre profil semble compatible avec le compartiment A-Premium." : "Certains critères du compartiment A-Premium ne sont pas remplis."}
            </p>
            <ul className="mt-4 grid gap-3">
              {result.checks.map((c) => (
                <li key={c.label} className="flex gap-3 text-sm">
                  {c.ok ? <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-rise" strokeWidth={1.8} /> : <CircleAlert aria-hidden="true" className="size-5 shrink-0 text-fall" strokeWidth={1.8} />}
                  <span>
                    <span className="block">{c.label}</span>
                    <span className="text-muted">{c.ok ? "Critère rempli" : "Critère non rempli"} · {c.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">Les autres compartiments ont des critères différents. Contactez l’équipe Admission pour un examen de votre dossier.</p>
          </div>
        ) : (
          <div className="rounded-[var(--radius-card)] border border-dashed border-line p-6 text-sm text-muted">Renseignez le formulaire pour obtenir une première indication.</div>
        )}
      </div>
    </div>
  );
}
