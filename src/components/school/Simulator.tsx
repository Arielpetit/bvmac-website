"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "motion/react";
import { RotateCcw, Trash2 } from "lucide-react";
import { useStoredJSON, writeStorage } from "@/lib/client-store";
import { useI18n } from "@/i18n/provider";
import { formatDate, formatFcfa, formatNumber } from "@/lib/format";
import { PriceChange } from "@/components/ui/PriceChange";
import { cn } from "@/lib/cn";

type Quote = { slug: string; shortName: string; closePrice: number; change: number; sector: string };
type Holding = { qty: number; cost: number };
type Order = { at: string; slug: string; side: "achat" | "vente"; qty: number; price: number };
type State = { cash: number; holdings: Record<string, Holding>; orders: Order[]; history?: { at: string; value: number }[] };

const START = 5_000_000;
const KEY = "bvmac-simulator";
const initial: State = { cash: START, holdings: {}, orders: [], history: [] };
const PALETTE = ["#c9a23a", "#8a6614", "#ead18a", "#5a3412", "#d9b451", "#3a2414", "#b38a2a", "#e6c36a"];

const L = {
  fr: { cash: "Liquidités", qtyErr: "Indiquez une quantité valide.", noCash: "Solde virtuel insuffisant pour cet achat.", noQty: "Vous ne détenez pas assez de titres pour cette vente.", done: (side: string, n: number, name: string) => `Ordre virtuel exécuté : ${side} de ${n} ${name} au cours de clôture.`, buyWord: "achat", sellWord: "vente", band: "Simulation · Argent virtuel · Aucun ordre réel", value: "Valeur du portefeuille", vcash: "Liquidités virtuelles", result: "Résultat", diversification: "Diversification", security: "Valeur", quantity: "Quantité", buy: "Acheter", sell: "Vendre", estimate: (a: string) => `Montant estimé : ${a} (exécution au cours de clôture, sans frais simulés).`, allocation: "Répartition", invested: "Investi", history: "Historique de la valeur", firstOrder: "Passez un premier ordre pour suivre l’évolution de votre portefeuille.", start: "Départ", valueLabel: "Valeur", millions: "Millions de FCFA, après chaque ordre virtuel.", positions: "Mes positions virtuelles", none: "Aucune position. Choisissez une valeur et une quantité pour commencer.", posCaption: "Positions virtuelles", current: "Valeur actuelle", gain: "Gain / perte", day: "Var. du jour", disclaimer: "Simulation à but pédagogique : aucun ordre réel, aucun argent réel. Les performances passées ne préjugent pas des performances futures.", reset: "Réinitialiser", resetDone: "Portefeuille réinitialisé.", erase: "Effacer mes données", erased: "Données supprimées de cet appareil." },
  en: { cash: "Cash", qtyErr: "Enter a valid quantity.", noCash: "Not enough virtual cash for this purchase.", noQty: "You do not hold enough securities for this sale.", done: (side: string, n: number, name: string) => `Virtual order executed: ${side} of ${n} ${name} at the closing price.`, buyWord: "purchase", sellWord: "sale", band: "Simulation · Virtual money · No real order", value: "Portfolio value", vcash: "Virtual cash", result: "Result", diversification: "Diversification", security: "Security", quantity: "Quantity", buy: "Buy", sell: "Sell", estimate: (a: string) => `Estimated amount: ${a} (executed at the closing price, no simulated fees).`, allocation: "Allocation", invested: "Invested", history: "Value history", firstOrder: "Place a first order to follow your portfolio’s performance.", start: "Start", valueLabel: "Value", millions: "Millions of FCFA, after each virtual order.", positions: "My virtual positions", none: "No positions. Choose a security and a quantity to start.", posCaption: "Virtual positions", current: "Current value", gain: "Gain / loss", day: "Day’s change", disclaimer: "Educational simulation: no real order, no real money. Past performance is no guide to future performance.", reset: "Reset", resetDone: "Portfolio reset.", erase: "Delete my data", erased: "Data deleted from this device." },
  es: { cash: "Liquidez", qtyErr: "Indique una cantidad válida.", noCash: "Saldo virtual insuficiente para esta compra.", noQty: "No tiene suficientes valores para esta venta.", done: (side: string, n: number, name: string) => `Orden virtual ejecutada: ${side} de ${n} ${name} al precio de cierre.`, buyWord: "compra", sellWord: "venta", band: "Simulación · Dinero virtual · Ninguna orden real", value: "Valor de la cartera", vcash: "Liquidez virtual", result: "Resultado", diversification: "Diversificación", security: "Valor", quantity: "Cantidad", buy: "Comprar", sell: "Vender", estimate: (a: string) => `Importe estimado: ${a} (ejecución al precio de cierre, sin gastos simulados).`, allocation: "Reparto", invested: "Invertido", history: "Historial del valor", firstOrder: "Dé una primera orden para seguir la evolución de su cartera.", start: "Inicio", valueLabel: "Valor", millions: "Millones de FCFA, tras cada orden virtual.", positions: "Mis posiciones virtuales", none: "Ninguna posición. Elija un valor y una cantidad para empezar.", posCaption: "Posiciones virtuales", current: "Valor actual", gain: "Ganancia / pérdida", day: "Var. del día", disclaimer: "Simulación con fines pedagógicos: ninguna orden real, ningún dinero real. Las rentabilidades pasadas no presuponen las futuras.", reset: "Reiniciar", resetDone: "Cartera reiniciada.", erase: "Borrar mis datos", erased: "Datos eliminados de este dispositivo." },
};

// Educational simulator: virtual FCFA, real delayed prices, execution at the
// closing price. The "Simulation" band and dashed gold frame appear on every screen.
export function Simulator({ quotes }: { quotes: Quote[] }) {
  const { locale } = useI18n();
  const t = L[locale];
  const [state, save] = useStoredJSON<State>(KEY, initial);
  const [slug, setSlug] = useState(quotes[0]?.slug ?? "");
  const [qty, setQty] = useState("10");
  const [message, setMessage] = useState("");

  const price = (s: string) => quotes.find((q) => q.slug === s)?.closePrice ?? 0;
  const positions = useMemo(
    () =>
      Object.entries(state.holdings)
        .filter(([, h]) => h.qty > 0)
        .map(([s, h]) => {
          const q = quotes.find((x) => x.slug === s)!;
          const value = h.qty * q.closePrice;
          return { slug: s, name: q.shortName, sector: q.sector, qty: h.qty, value, gain: value - h.cost, change: q.change };
        }),
    [state.holdings, quotes],
  );
  const invested = positions.reduce((s, p) => s + p.value, 0);
  const total = state.cash + invested;
  const sectors = new Set(positions.map((p) => p.sector)).size;
  const diversification = positions.length === 0 ? 0 : Math.min(100, Math.round((positions.length / 5) * 60 + (sectors / 4) * 40));
  const allocation = [...positions.map((p) => ({ name: p.name, value: p.value })), { name: t.cash, value: state.cash }].filter((x) => x.value > 0);
  const history = [{ at: "", value: START }, ...(state.history ?? [])].map((h, i) => ({ ...h, i }));

  function order(side: "achat" | "vente") {
    const n = Math.floor(Number(qty));
    if (!n || n < 1) return setMessage(t.qtyErr);
    const p = price(slug);
    const held = state.holdings[slug] ?? { qty: 0, cost: 0 };
    let next: State;
    if (side === "achat") {
      if (n * p > state.cash) return setMessage(t.noCash);
      next = { ...state, cash: state.cash - n * p, holdings: { ...state.holdings, [slug]: { qty: held.qty + n, cost: held.cost + n * p } } };
    } else {
      if (n > held.qty) return setMessage(t.noQty);
      const avg = held.cost / held.qty;
      next = { ...state, cash: state.cash + n * p, holdings: { ...state.holdings, [slug]: { qty: held.qty - n, cost: held.cost - avg * n } } };
    }
    const at = new Date().toISOString();
    const value = next.cash + Object.entries(next.holdings).reduce((s, [k, h]) => s + h.qty * price(k), 0);
    save({ ...next, orders: [{ at, slug, side, qty: n, price: p }, ...state.orders].slice(0, 30), history: [...(state.history ?? []), { at, value }].slice(-60) });
    setMessage(t.done(side === "achat" ? t.buyWord : t.sellWord, n, quotes.find((q) => q.slug === slug)?.shortName ?? ""));
  }

  const result = total - START;
  return (
    <div className="overflow-hidden rounded-[var(--radius-panel)] border-2 border-dashed border-brand-gold bg-surface">
      <p className="flex items-center gap-2 bg-brand-gold-light px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-espresso">
        <span className="size-1.5 animate-live rounded-full bg-espresso" />
        {t.band}
      </p>
      <div className="grid gap-10 p-5 md:p-8">
        <dl className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            [t.value, formatFcfa(total, locale), ""],
            [t.vcash, formatFcfa(state.cash, locale), ""],
            [t.result, `${result >= 0 ? "+" : "−"}${formatNumber(Math.abs(result), locale)} FCFA`, result > 0 ? "text-rise" : result < 0 ? "text-fall" : ""],
            [t.diversification, `${diversification} / 100`, ""],
          ].map(([label, value, tone]) => (
            <div key={label} className="bg-surface p-5">
              <dt className="text-xs uppercase tracking-[0.1em] text-muted">{label}</dt>
              <dd className={cn("figure mt-2 text-xl text-heading", tone)}>{value}</dd>
              {label === t.diversification && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-alt" aria-hidden="true">
                  <motion.div className="h-full rounded-full bg-brand-gold" initial={{ width: 0 }} animate={{ width: `${diversification}%` }} transition={{ duration: 0.8 }} />
                </div>
              )}
            </div>
          ))}
        </dl>

        <form onSubmit={(e) => e.preventDefault()} className="grid gap-3 rounded-[var(--radius-card)] bg-surface-alt p-5 sm:grid-cols-[2fr_1fr_auto_auto] sm:items-end">
          <div>
            <label htmlFor="sim-security" className="mb-1.5 block text-sm font-medium">{t.security}</label>
            <select id="sim-security" value={slug} onChange={(e) => setSlug(e.target.value)} className="h-11 w-full rounded-full border border-line bg-surface px-4">
              {quotes.map((q) => <option key={q.slug} value={q.slug}>{q.shortName} · {formatNumber(q.closePrice, locale)} FCFA</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sim-qty" className="mb-1.5 block text-sm font-medium">{t.quantity}</label>
            <input id="sim-qty" inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} className="figure h-11 w-full rounded-full border border-line bg-surface px-4" />
          </div>
          <button type="button" onClick={() => order("achat")} className="h-11 rounded-full bg-action px-6 text-sm font-medium text-action-text hover:bg-action-hover">{t.buy}</button>
          <button type="button" onClick={() => order("vente")} className="h-11 rounded-full border border-line-strong bg-surface px-6 text-sm font-medium hover:border-action">{t.sell}</button>
          <p role="status" className="text-sm text-muted sm:col-span-4">
            {message || t.estimate(formatFcfa(Math.max(0, Math.floor(Number(qty)) || 0) * price(slug), locale))}
          </p>
        </form>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <figure className="rounded-[var(--radius-card)] border border-line p-5">
            <figcaption className="text-h3">{t.allocation}</figcaption>
            <div className="relative mx-auto mt-2 h-56 max-w-56" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={allocation} dataKey="value" nameKey="name" innerRadius="64%" outerRadius="96%" paddingAngle={allocation.length > 1 ? 2 : 0} stroke="none" isAnimationActive>
                    {allocation.map((a, i) => <Cell key={a.name} fill={a.name === t.cash ? "var(--surface-sunk)" : PALETTE[i % PALETTE.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatFcfa(Number(v), locale)} contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-muted">{t.invested}</span>
                <span className="figure text-lg text-heading">{total ? Math.round((invested / total) * 100) : 0} %</span>
              </span>
            </div>
            <ul className="mt-4 grid gap-1.5 text-sm">
              {allocation.map((a, i) => (
                <li key={a.name} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: a.name === t.cash ? "var(--surface-sunk)" : PALETTE[i % PALETTE.length] }} />{a.name}</span>
                  <span className="figure text-muted">{formatNumber((a.value / total) * 100, locale, 1)} %</span>
                </li>
              ))}
            </ul>
          </figure>
          <figure className="rounded-[var(--radius-card)] border border-line p-5">
            <figcaption className="text-h3">{t.history}</figcaption>
            {history.length < 2 ? (
              <p className="mt-4 text-sm text-muted">{t.firstOrder}</p>
            ) : (
              <div className="mt-4 h-64" aria-hidden="true">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sim-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-fill)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--chart-fill)" stopOpacity={0} /></linearGradient>
                    </defs>
                    <XAxis dataKey="i" tickFormatter={(i: number) => (i === 0 ? t.start : `#${i}`)} tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "var(--line)" }} />
                    <YAxis domain={["auto", "auto"]} tickFormatter={(v: number) => formatNumber(v / 1e6, locale, 2)} tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} width={44} />
                    <Tooltip labelFormatter={(i) => (Number(i) === 0 ? t.start : formatDate(history[Number(i)].at.slice(0, 10), locale, "short"))} formatter={(v) => [formatFcfa(Number(v), locale), t.valueLabel]} contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="value" stroke="var(--chart-price)" strokeWidth={2} fill="url(#sim-g)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className="mt-2 text-xs text-muted">{t.millions}</p>
          </figure>
        </div>

        <div>
          <h2 className="text-h3">{t.positions}</h2>
          {positions.length === 0 ? (
            <p className="mt-2 text-sm text-muted">{t.none}</p>
          ) : (
            <div className="mt-4 relative overflow-x-auto rounded-[var(--radius-card)] border border-line" data-lenis-prevent>
              <table className="w-full min-w-[560px] text-sm">
                <caption className="sr-only">{t.posCaption}</caption>
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
                    <th scope="col" className="px-4 py-3 text-left font-medium">{t.security}</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">{t.quantity}</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">{t.current}</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">{t.gain}</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">{t.day}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {positions.map((p) => (
                    <tr key={p.slug}>
                      <th scope="row" className="px-4 py-3 text-left font-medium text-heading">{p.name}</th>
                      <td className="figure px-4 py-3 text-right">{formatNumber(p.qty, locale)}</td>
                      <td className="figure px-4 py-3 text-right">{formatNumber(p.value, locale)}</td>
                      <td className={`figure px-4 py-3 text-right ${p.gain > 0 ? "text-rise" : p.gain < 0 ? "text-fall" : ""}`}>{p.gain > 0 ? "▲ +" : p.gain < 0 ? "▼ −" : "■ "}{formatNumber(Math.abs(p.gain), locale)}</td>
                      <td className="px-4 py-3 text-right"><PriceChange value={p.change} locale={locale} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <div className="flex gap-2">
            <button type="button" onClick={() => { save(initial); setMessage(t.resetDone); }} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm hover:border-line-strong"><RotateCcw aria-hidden="true" className="size-4" /> {t.reset}</button>
            <button type="button" onClick={() => { writeStorage(KEY, null); setMessage(t.erased); }} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm hover:border-line-strong"><Trash2 aria-hidden="true" className="size-4" /> {t.erase}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
