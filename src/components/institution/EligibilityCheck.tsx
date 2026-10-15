"use client";

import { useState } from "react";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";

const L = {
  fr: {
    capital: "Capital social entièrement libéré d’au moins 100 millions FCFA",
    cap: "Capitalisation boursière à l’introduction d’au moins 10 milliards FCFA",
    float: (n: number) => `Diffusion dans le public d’au moins ${n} % du capital`,
    years: "États financiers certifiés sur les trois derniers exercices",
    entered: "Saisi",
    mFcfa: "millions FCFA",
    bnFcfa: "milliards FCFA",
    yearsUnit: "exercice(s)",
    fCapital: "Capital social libéré (millions FCFA)",
    fCap: "Capitalisation attendue à l’introduction (milliards FCFA)",
    fFloat: "Part du capital proposée au public (%)",
    fYears: "Exercices avec états financiers certifiés",
    check: "Vérifier",
    note: "Simulation indicative et non contractuelle. Aucune donnée n’est envoyée ni conservée.",
    ok: "Votre profil semble compatible avec le compartiment A-Premium.",
    ko: "Certains critères du compartiment A-Premium ne sont pas remplis.",
    met: "Critère rempli",
    notMet: "Critère non rempli",
    others: "Les autres compartiments ont des critères différents. Contactez l’équipe Admission pour un examen de votre dossier.",
    empty: "Renseignez le formulaire pour obtenir une première indication.",
  },
  en: {
    capital: "Fully paid-up share capital of at least FCFA 100 million",
    cap: "Market capitalisation at listing of at least FCFA 10 billion",
    float: (n: number) => `At least ${n}% of the capital offered to the public`,
    years: "Audited financial statements for the last three financial years",
    entered: "Entered",
    mFcfa: "million FCFA",
    bnFcfa: "billion FCFA",
    yearsUnit: "year(s)",
    fCapital: "Paid-up share capital (million FCFA)",
    fCap: "Expected capitalisation at listing (billion FCFA)",
    fFloat: "Share of capital offered to the public (%)",
    fYears: "Years with audited financial statements",
    check: "Check",
    note: "Indicative, non-binding simulation. No data is sent or stored.",
    ok: "Your profile appears compatible with the A-Premium segment.",
    ko: "Some A-Premium criteria are not met.",
    met: "Criterion met",
    notMet: "Criterion not met",
    others: "Other segments have different criteria. Contact the Admission team to review your application.",
    empty: "Fill in the form to get a first indication.",
  },
  es: {
    capital: "Capital social íntegramente desembolsado de al menos 100 millones de FCFA",
    cap: "Capitalización bursátil en la salida a bolsa de al menos 10 000 millones de FCFA",
    float: (n: number) => `Difusión entre el público de al menos el ${n} % del capital`,
    years: "Estados financieros auditados de los tres últimos ejercicios",
    entered: "Introducido",
    mFcfa: "millones de FCFA",
    bnFcfa: "miles de millones de FCFA",
    yearsUnit: "ejercicio(s)",
    fCapital: "Capital social desembolsado (millones de FCFA)",
    fCap: "Capitalización prevista en la salida a bolsa (miles de millones de FCFA)",
    fFloat: "Porcentaje del capital ofrecido al público (%)",
    fYears: "Ejercicios con estados financieros auditados",
    check: "Comprobar",
    note: "Simulación orientativa y no contractual. No se envía ni se guarda ningún dato.",
    ok: "Su perfil parece compatible con el segmento A-Premium.",
    ko: "No se cumplen algunos criterios del segmento A-Premium.",
    met: "Criterio cumplido",
    notMet: "Criterio no cumplido",
    others: "Los demás segmentos tienen criterios distintos. Contacte con el equipo de Admisión para estudiar su expediente.",
    empty: "Rellene el formulario para obtener una primera indicación.",
  },
};

// Indicative check against the A-Premium criteria published by the BVMAC.
// Runs in the browser only; nothing is sent or stored.
export function EligibilityCheck() {
  const { locale } = useI18n();
  const l = L[locale];
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
      { label: l.capital, ok: capitalN >= 100_000_000, detail: `${l.entered} : ${capital || "0"} ${l.mFcfa}` },
      { label: l.cap, ok: capN >= 10e9, detail: `${l.entered} : ${cap || "0"} ${l.bnFcfa}` },
      { label: l.float(required), ok: floatN >= required, detail: `${l.entered} : ${float || "0"} %` },
      { label: l.years, ok: Number(years) >= 3, detail: `${l.entered} : ${years} ${l.yearsUnit}` },
    ];
    setResult({ ok: checks.every((c) => c.ok), checks });
  }

  const field = "h-11 w-full rounded-[var(--radius-control)] border border-line bg-surface px-3 figure";
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={run} className="grid gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <div>
          <label htmlFor="el-capital" className="mb-1 block text-sm font-semibold">{l.fCapital}</label>
          <input id="el-capital" inputMode="numeric" required value={capital} onChange={(e) => setCapital(e.target.value)} className={field} placeholder="150" />
        </div>
        <div>
          <label htmlFor="el-cap" className="mb-1 block text-sm font-semibold">{l.fCap}</label>
          <input id="el-cap" inputMode="decimal" required value={cap} onChange={(e) => setCap(e.target.value)} className={field} placeholder="25" />
        </div>
        <div>
          <label htmlFor="el-float" className="mb-1 block text-sm font-semibold">{l.fFloat}</label>
          <input id="el-float" inputMode="decimal" required value={float} onChange={(e) => setFloat(e.target.value)} className={field} placeholder="20" />
        </div>
        <div>
          <label htmlFor="el-years" className="mb-1 block text-sm font-semibold">{l.fYears}</label>
          <select id="el-years" value={years} onChange={(e) => setYears(e.target.value)} className={field}>
            {["0", "1", "2", "3", "4", "5"].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
        <Button type="submit" className="w-fit">{l.check}</Button>
        <p className="text-xs text-muted">{l.note}</p>
      </form>
      <div aria-live="polite">
        {result ? (
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <p className={`font-serif-display text-2xl ${result.ok ? "text-rise" : "text-heading"}`}>
              {result.ok ? l.ok : l.ko}
            </p>
            <ul className="mt-4 grid gap-3">
              {result.checks.map((c) => (
                <li key={c.label} className="flex gap-3 text-sm">
                  {c.ok ? <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-rise" strokeWidth={1.8} /> : <CircleAlert aria-hidden="true" className="size-5 shrink-0 text-fall" strokeWidth={1.8} />}
                  <span>
                    <span className="block">{c.label}</span>
                    <span className="text-muted">{c.ok ? l.met : l.notMet} · {c.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">{l.others}</p>
          </div>
        ) : (
          <div className="rounded-[var(--radius-card)] border border-dashed border-line p-6 text-sm text-muted">{l.empty}</div>
        )}
      </div>
    </div>
  );
}
