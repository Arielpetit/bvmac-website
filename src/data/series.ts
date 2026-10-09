// Deterministic demo histories so charts render the same on server and client.

export type Point = { date: string; value: number };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

// Business days ending at `end`, newest last.
export function businessDays(end: string, count: number): string[] {
  const days: string[] = [];
  const date = new Date(`${end}T12:00:00Z`);
  while (days.length < count) {
    const dow = date.getUTCDay();
    if (dow !== 0 && dow !== 6) days.push(date.toISOString().slice(0, 10));
    date.setUTCDate(date.getUTCDate() - 1);
  }
  return days.reverse();
}

// Random walk that ends exactly at `last`; many flat days, like a thin market.
export function priceHistory(key: string, last: number, end: string, count = 260, volatility = 0.012, tick = 50): Point[] {
  const rand = mulberry32(hash(key));
  const days = businessDays(end, count);
  const values: number[] = [last];
  for (let i = 1; i < count; i++) {
    const prev = values[i - 1];
    const moves = rand() < 0.45;
    const step = moves ? (rand() - 0.5) * 2 * volatility * prev : 0;
    values.push(Math.max(tick, Math.round((prev - step) / tick) * tick));
  }
  values.reverse();
  return days.map((date, i) => ({ date, value: values[i] }));
}
