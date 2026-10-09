// Bespoke, on-brand vector illustrations for the home page cards.
// Decorative only (aria-hidden); they replace generic photos.

const G = "#c9a23a";
const GL = "#ead18a";

export function InvestArt({ className }: { className?: string }) {
  const candles = [
    [20, 120, 150, 130, 112], [48, 128, 160, 140, 118], [76, 118, 146, 124, 104], [104, 110, 140, 118, 98],
    [132, 96, 126, 104, 86], [160, 102, 132, 110, 90], [188, 84, 112, 92, 72], [216, 72, 100, 80, 60], [244, 58, 88, 66, 46], [272, 46, 74, 52, 34],
  ];
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ia-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={G} stopOpacity="0.35" /><stop offset="1" stopColor={G} stopOpacity="0" /></linearGradient>
      </defs>
      {[40, 80, 120, 160].map((y) => <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="#fff" strokeOpacity="0.06" />)}
      {candles.map(([x, o, l, c, h], i) => {
        const up = c < o || i % 3 !== 1;
        return (
          <g key={x} opacity={0.35 + i * 0.065}>
            <line x1={x} x2={x} y1={h} y2={l} stroke={up ? GL : "#8a6614"} strokeWidth="1.5" />
            <rect x={x - 6} y={Math.min(o, c)} width="12" height={Math.abs(c - o) + 6} rx="2" fill={up ? G : "#5a3412"} />
          </g>
        );
      })}
      <path d="M0 160 C40 150 70 150 100 132 S160 110 190 92 S250 60 320 30 L320 200 L0 200Z" fill="url(#ia-g)" />
      <path d="M0 160 C40 150 70 150 100 132 S160 110 190 92 S250 60 320 30" fill="none" stroke={GL} strokeWidth="2.5" />
      <circle cx="306" cy="36" r="5" fill={GL} />
      <circle cx="306" cy="36" r="12" fill={GL} opacity="0.2" />
    </svg>
  );
}

export function RaiseArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ra-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2414" /><stop offset="1" stopColor="#1c130b" /></linearGradient>
      </defs>
      <path d="M90 70 L160 34 L230 70 Z" fill="url(#ra-g)" />
      <rect x="86" y="70" width="148" height="10" rx="2" fill="#3a2414" />
      {[100, 128, 156, 184, 212].map((x) => <rect key={x} x={x - 6} y="84" width="12" height="70" rx="3" fill="#3a2414" opacity="0.9" />)}
      <rect x="78" y="154" width="164" height="10" rx="2" fill="#3a2414" />
      <rect x="70" y="164" width="180" height="10" rx="2" fill="#3a2414" opacity="0.8" />
      <circle cx="160" cy="56" r="7" fill={G} />
      {[[40, 150, 28], [262, 130, 40], [282, 100, 60]].map(([x, y, h], i) => (
        <g key={i}>
          <rect x={x} y={y - h} width="18" height={h} rx="4" fill={G} opacity={0.5 + i * 0.2} />
        </g>
      ))}
      <path d="M248 60 L272 36 L296 60" fill="none" stroke="#3a2414" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="272" x2="272" y1="38" y2="86" stroke="#3a2414" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function NoticesArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      {[[54, 46, -8], [70, 36, -2]].map(([x, y, r], i) => (
        <rect key={i} x={x} y={y} width="120" height="150" rx="12" fill="var(--surface)" stroke="var(--line-strong)" transform={`rotate(${r} ${x + 60} ${y + 75})`} />
      ))}
      <g>
        <rect x="88" y="26" width="120" height="150" rx="12" fill="var(--surface)" stroke="var(--line-strong)" />
        <rect x="104" y="44" width="40" height="8" rx="4" fill={G} />
        {[66, 80, 94, 108].map((y, i) => <rect key={y} x="104" y={y} width={i === 3 ? 56 : 88} height="5" rx="2.5" fill="var(--line-strong)" />)}
        <circle cx="178" cy="146" r="18" fill="none" stroke={G} strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="178" cy="146" r="11" fill={G} opacity="0.85" />
        <path d="M172 146 l4 4 l8 -9" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function LearnArt({ className }: { className?: string }) {
  const c = 2 * Math.PI * 34;
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden="true">
      <path d="M60 70 Q110 52 160 70 L160 170 Q110 152 60 170 Z" fill="#2a1c10" stroke={G} strokeOpacity="0.5" />
      <path d="M160 70 Q210 52 260 70 L260 170 Q210 152 160 170 Z" fill="#241810" stroke={G} strokeOpacity="0.5" />
      {[90, 106, 122, 138].map((y, i) => <path key={y} d={`M76 ${y} Q110 ${y - 10} 146 ${y}`} stroke={GL} strokeOpacity={0.5 - i * 0.08} strokeWidth="3" fill="none" strokeLinecap="round" />)}
      <g transform="translate(212 118)">
        <circle r="34" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="7" />
        <circle r="34" fill="none" stroke={G} strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * 0.33} transform="rotate(-90)" />
        <text y="6" textAnchor="middle" fontSize="18" fill={GL} fontFamily="var(--font-geist)">67%</text>
      </g>
      <path d="M160 18 L214 40 L160 62 L106 40 Z" fill={G} />
      <path d="M128 50 L128 66 Q160 80 192 66 L192 50" fill="none" stroke={G} strokeWidth="5" />
      <line x1="214" x2="214" y1="40" y2="64" stroke={GL} strokeWidth="2.5" />
      <circle cx="214" cy="66" r="4" fill={GL} />
    </svg>
  );
}
