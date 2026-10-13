// Sign-in for the access gate (see src/lib/gate.ts). Plain form post, no script needed.
import { GATE_MAX_AGE, checkGateLogin, createGateToken, gateCookie, gateEnabled, safeNext } from "@/lib/gate";

export async function POST(request: Request) {
  const form = await request.formData();
  const next = safeNext(String(form.get("next") ?? ""));
  if (!gateEnabled()) return new Response(null, { status: 303, headers: { Location: next } });

  const email = String(form.get("email") ?? "");
  if (!(await checkGateLogin(email, String(form.get("password") ?? "")))) {
    return new Response(null, { status: 303, headers: { Location: `/login?error=1&next=${encodeURIComponent(next)}` } });
  }
  const secure = new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  const token = await createGateToken(email.trim().toLowerCase());
  return new Response(null, { status: 303, headers: { Location: next, "Set-Cookie": gateCookie(token, GATE_MAX_AGE, secure), "Cache-Control": "no-store" } });
}
