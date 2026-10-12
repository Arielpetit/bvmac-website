import { Bell, BookOpen, FileText, Home, LineChart, Search, Signal, Star, Wifi } from "lucide-react";
import { CompanyMark } from "@/components/brand/CompanyMark";
import { Logo } from "@/components/layout/Logo";

type Row = { slug: string; name: string; sector: string; price: string; change: number; spark: number[] };

function Spark({ points, up }: { points: number[]; up: boolean }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const d = points.map((p, i) => `${(i / (points.length - 1)) * 48},${16 - ((p - min) / (max - min || 1)) * 14 - 1}`).join(" ");
  return <svg viewBox="0 0 48 16" className="h-4 w-12"><polyline points={d} fill="none" stroke={up ? "#157a43" : "#a8925f"} strokeWidth="1.4" strokeLinejoin="round" /></svg>;
}

// High-fidelity mock of the BVMAC mobile app (decorative).
export function AppShowcase({ rows, capitalisation, area }: { rows: Row[]; capitalisation: string; area: number[] }) {
  const min = Math.min(...area);
  const max = Math.max(...area);
  const pts = area.map((v, i) => [(i / (area.length - 1)) * 260, 64 - ((v - min) / (max - min || 1)) * 52 - 4] as const);
  const line = pts.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <div aria-hidden="true" className="relative mx-auto w-[min(100%,340px)] select-none">
      <div className="absolute -inset-10 -z-10 rounded-full bg-brand-gold/25 blur-[90px]" />

      {/* Device */}
      <div className="relative rounded-[54px] bg-gradient-to-b from-[#3a3632] via-[#1d1a17] to-[#2b2724] p-[3px] shadow-[0_80px_120px_-40px_rgb(0_0_0/0.85),inset_0_0_0_1px_rgb(255_255_255/0.08)]">
        <span className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l bg-[#2b2724]" />
        <span className="absolute -left-[3px] top-40 h-14 w-[3px] rounded-l bg-[#2b2724]" />
        <span className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-[#2b2724]" />
        <div className="rounded-[51px] bg-black p-[9px]">
          <div className="relative overflow-hidden rounded-[43px] bg-[#fbf9f5] text-[#1a140e]">
            {/* status bar */}
            <div className="flex items-center justify-between px-7 pb-1 pt-3.5 text-[11px] font-semibold">
              <span>9:41</span>
              <span className="absolute left-1/2 top-2.5 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
              <span className="flex items-center gap-1"><Signal className="size-3" strokeWidth={2.5} /><Wifi className="size-3" strokeWidth={2.5} /><span className="ml-0.5 inline-flex h-[10px] w-[20px] items-center rounded-[3px] border border-black/60 p-[1px]"><span className="h-full w-[75%] rounded-[1px] bg-black" /></span></span>
            </div>

            <div className="px-5 pb-3 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#6b6155]">Bonjour 👋</p>
                  <p className="font-serif-display text-[22px] leading-tight">Marchés</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#f4efe5]"><Search className="size-3.5" /></span>
                  <span className="relative flex size-8 items-center justify-center rounded-full bg-[#f4efe5]"><Bell className="size-3.5" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#c0263d]" /></span>
                </div>
              </div>

              {/* capitalisation card */}
              <div className="relative mt-4 overflow-hidden rounded-[22px] bg-[#1c130b] p-4 text-[#efe6d4]">
                <div className="absolute -right-8 -top-10 size-32 rounded-full bg-[#c9a23a]/25 blur-2xl" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.14em] text-[#ead18a]/80">Capitalisation actions</p>
                    <p className="font-serif-display mt-1 text-[26px] leading-none text-[#fbf6ea]">{capitalisation}</p>
                    <p className="mt-1 text-[9px] text-[#efe6d4]/60">Md FCFA · séance du 8 oct.</p>
                  </div>
                  <Logo variant="medal" className="size-9" alt="" />
                </div>
                <svg viewBox="0 0 260 64" className="relative mt-3 h-14 w-full">
                  <defs><linearGradient id="app-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9a23a" stopOpacity="0.45" /><stop offset="1" stopColor="#c9a23a" stopOpacity="0" /></linearGradient></defs>
                  <polygon points={`0,64 ${line} 260,64`} fill="url(#app-g)" />
                  <polyline points={line} fill="none" stroke="#ead18a" strokeWidth="1.8" strokeLinejoin="round" />
                  <circle cx={pts[pts.length - 1][0] - 2} cy={pts[pts.length - 1][1]} r="3" fill="#ead18a" />
                </svg>
                <div className="relative mt-2 flex gap-1 text-[9px]">
                  {["1S", "1M", "6M", "1A", "Tout"].map((r, i) => <span key={r} className={i === 2 ? "rounded-full bg-[#c9a23a] px-2 py-0.5 font-semibold text-[#1c130b]" : "px-2 py-0.5 text-[#efe6d4]/60"}>{r}</span>)}
                </div>
              </div>

              {/* segmented */}
              <div className="mt-4 flex rounded-full bg-[#f4efe5] p-1 text-[10px] font-medium">
                <span className="flex-1 rounded-full bg-white py-1.5 text-center shadow-sm">Actions</span>
                <span className="flex-1 py-1.5 text-center text-[#6b6155]">Obligations</span>
                <span className="flex-1 py-1.5 text-center text-[#6b6155]">Favoris</span>
              </div>

              <ul className="mt-2 divide-y divide-[#efe8da]">
                {rows.map((r) => (
                  <li key={r.slug} className="flex items-center gap-2.5 py-2.5">
                    <CompanyMark slug={r.slug} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11.5px] font-semibold">{r.name}</span>
                      <span className="block truncate text-[9px] text-[#6b6155]">{r.sector}</span>
                    </span>
                    <Spark points={r.spark} up={r.change >= 0} />
                    <span className="w-[58px] text-right">
                      <span className="figure block text-[11px] font-semibold">{r.price}</span>
                      <span className="figure block text-[9px] text-[#6b6155]">{r.change === 0 ? "■ 0,00 %" : `${r.change > 0 ? "▲" : "▼"} ${Math.abs(r.change).toFixed(2)} %`}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* tab bar */}
            <div className="grid grid-cols-5 border-t border-[#efe8da] bg-white/90 px-3 pb-6 pt-2 text-center text-[8.5px] text-[#9a8f80]">
              {([[Home, "Accueil"], [LineChart, "Marchés"], [Star, "Favoris"], [FileText, "Avis"], [BookOpen, "École"]] as const).map(([Icon, label], i) => (
                <span key={label} className={i === 1 ? "font-semibold text-[#1c130b]" : ""}>
                  <Icon className="mx-auto mb-0.5 size-4" strokeWidth={i === 1 ? 2.2 : 1.6} />
                  {label}
                </span>
              ))}
            </div>
            <span className="absolute bottom-1.5 left-1/2 h-[4px] w-28 -translate-x-1/2 rounded-full bg-black/80" />
          </div>
        </div>
      </div>

      {/* floating notification */}
      <div className="absolute -left-6 -top-8 z-10 w-60 animate-[float_6s_ease-in-out_infinite] rounded-2xl border border-white/10 bg-white/95 p-3 text-[#1a140e] shadow-2xl backdrop-blur lg:-left-28">
        <div className="flex items-center gap-2.5">
          <Logo variant="medal" className="size-8" alt="" />
          <div className="min-w-0">
            <p className="flex items-center justify-between text-[10px] text-[#6b6155]"><span className="font-semibold text-[#1a140e]">BVMAC</span><span>maintenant</span></p>
            <p className="truncate text-[11px] font-medium">BOC du 8 octobre publié</p>
            <p className="truncate text-[10px] text-[#6b6155]">7 actions · 31 lignes obligataires</p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 z-10 w-44 animate-[float_7s_ease-in-out_infinite_-3s] rounded-2xl border border-white/10 bg-[#1c130b]/95 p-3 text-[#efe6d4] shadow-2xl backdrop-blur lg:-right-20">
        <p className="text-[9px] uppercase tracking-[0.14em] text-[#ead18a]">Alerte de cours</p>
        <div className="mt-2 flex items-center gap-2">
          <CompanyMark slug="bgfi-holding" size="sm" />
          <div>
            <p className="text-[11px] font-semibold text-[#fbf6ea]">BGFI HC</p>
            <p className="text-[10px] text-[#efe6d4]/70">Seuil 90 000 FCFA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
