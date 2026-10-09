// Trading phases as published on the current BVMAC site (to be confirmed by BVMAC):
// 08:00 consultation, 09:00-11:00 pre-opening, 11:00 fixing,
// 11:00-15:00 intervention and surveillance, 15:00-15:30 consultation, then post-session.
export type SessionState = "open" | "preopen" | "closed";

export const PHASES = [
  { id: "consult", start: "08:00", end: "09:00", label: "Consultation" },
  { id: "preopen", start: "09:00", end: "11:00", label: "Préouverture" },
  { id: "fixing", start: "11:00", end: "11:00", label: "Fixing" },
  { id: "surveillance", start: "11:00", end: "15:00", label: "Intervention et surveillance" },
  { id: "consultEnd", start: "15:00", end: "15:30", label: "Consultation de fin" },
  { id: "post", start: "15:30", end: "18:00", label: "Post-séance" },
] as const;

function doualaParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Douala",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { weekday: get("weekday"), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function sessionState(now: Date): SessionState {
  const { weekday, minutes } = doualaParts(now);
  if (weekday === "Sat" || weekday === "Sun") return "closed";
  if (minutes >= 9 * 60 && minutes < 11 * 60) return "preopen";
  if (minutes >= 11 * 60 && minutes < 15 * 60 + 30) return "open";
  return "closed";
}

export function currentPhase(now: Date): string | null {
  const { weekday, minutes } = doualaParts(now);
  if (weekday === "Sat" || weekday === "Sun") return null;
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  if (minutes === toMin("11:00")) return "fixing";
  const phase = PHASES.find((p) => p.id !== "fixing" && minutes >= toMin(p.start) && minutes < toMin(p.end));
  return phase?.id ?? null;
}

export function doualaTime(now: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Douala",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
}
