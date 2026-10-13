// Access gate for internal previews: nobody reaches the site without signing in.
// Uses Web Crypto only, so it runs unchanged on Cloudflare Workers, Node and AWS.
//
// Settings (all server-side, never NEXT_PUBLIC_):
//   GATE_SECRET         long random string that signs the session cookie; the gate is off when unset
//   GATE_USERS          comma-separated testers, each "email:salt:hash" (see scripts/gate-user.mjs)
//   GATE_COOKIE_DOMAIN  e.g. ".skyengpro.site" so the app on a sibling subdomain shares the session
export const GATE_COOKIE = "bvmac_access";
export const GATE_MAX_AGE = 60 * 60 * 24 * 7;
const ITERATIONS = 100_000;

const encoder = new TextEncoder();
const hex = (buffer: ArrayBuffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
const fromHex = (value: string) => new Uint8Array((value.match(/.{2}/g) ?? []).map((pair) => parseInt(pair, 16)));

export const gateSecret = () => process.env.GATE_SECRET || "";
export const gateEnabled = () => gateSecret().length > 0;
export const gateCookieDomain = () => process.env.GATE_COOKIE_DOMAIN || "";

function hmacKey(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

// Token: "<email as hex>.<expiry in seconds>.<signature>"
export async function createGateToken(email: string, now = Date.now()) {
  const body = `${hex(encoder.encode(email).buffer as ArrayBuffer)}.${Math.floor(now / 1000) + GATE_MAX_AGE}`;
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(gateSecret()), encoder.encode(body));
  return `${body}.${hex(signature)}`;
}

export async function verifyGateToken(token: string | undefined, now = Date.now()) {
  if (!token) return false;
  const [email, expiry, signature, ...rest] = token.split(".");
  if (!email || !expiry || !signature || rest.length > 0) return false;
  if (!/^\d+$/.test(expiry) || Number(expiry) * 1000 < now) return false;
  if (!/^[0-9a-f]{64}$/.test(signature)) return false;
  return crypto.subtle.verify("HMAC", await hmacKey(gateSecret()), fromHex(signature), encoder.encode(`${email}.${expiry}`));
}

export async function hashGatePassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: encoder.encode(salt), iterations: ITERATIONS }, key, 256);
  return hex(bits);
}

export async function checkGateLogin(email: string, password: string) {
  const wanted = email.trim().toLowerCase();
  const users = (process.env.GATE_USERS || "").split(",").map((entry) => entry.trim().split(":"));
  const user = users.find(([address]) => address?.toLowerCase() === wanted);
  // Hash even for an unknown email, so the response time does not reveal who has an account.
  const actual = await hashGatePassword(password, user?.[1] ?? "no-such-user");
  const expected = user?.[2] ?? "";
  let diff = actual.length ^ expected.length;
  for (let i = 0; i < actual.length; i++) diff |= actual.charCodeAt(i) ^ (expected.charCodeAt(i) || 0);
  return diff === 0 && Boolean(user);
}

// Where to send the visitor after sign-in: a path on this site, or a page on a sibling
// subdomain that shares the cookie. Anything else falls back to the home page.
export function safeNext(next: string | null | undefined) {
  if (!next) return "/";
  if (next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")) return next;
  const domain = gateCookieDomain().replace(/^\./, "");
  try {
    const url = new URL(next);
    if (domain && url.protocol === "https:" && (url.hostname === domain || url.hostname.endsWith(`.${domain}`))) return url.toString();
  } catch {}
  return "/";
}

export function gateCookie(value: string, maxAge: number, secure: boolean) {
  const domain = gateCookieDomain();
  return [`${GATE_COOKIE}=${value}`, "Path=/", `Max-Age=${maxAge}`, "HttpOnly", "SameSite=Lax", secure && "Secure", domain && `Domain=${domain}`].filter(Boolean).join("; ");
}
