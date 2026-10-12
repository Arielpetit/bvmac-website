// Team management for the admin. Runs on the server with the secret key;
// every call is checked: valid session, role "admin", and second factor when enrolled.
import { createClient } from "@supabase/supabase-js";

type Body = { action?: string; email?: string; password?: string; role?: string; id?: string };
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return json({ error: "not-configured" }, 503);

  const token = req.headers.get("authorization")?.replace(/^Bearer /i, "");
  if (!token) return json({ error: "unauthenticated" }, 401);

  const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: who, error: whoError } = await admin.auth.getUser(token);
  if (whoError || !who.user) return json({ error: "unauthenticated" }, 401);
  if (who.user.app_metadata?.role !== "admin") return json({ error: "forbidden" }, 403);

  // Assurance level is a claim of the (already verified) access token.
  let aal = "aal1";
  try {
    aal = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString()).aal ?? "aal1";
  } catch {}
  const hasFactor = (who.user.factors ?? []).some((f) => f.status === "verified");
  if (hasFactor && aal !== "aal2") return json({ error: "mfa-required" }, 403);

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad-request" }, 400);
  }
  const log = (action: string, label: string) => admin.from("audit_log").insert({ actor: who.user!.id, actor_email: who.user!.email, table_name: "team", action, label });

  if (body.action === "list") {
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) return json({ error: error.message }, 500);
    return json({
      users: data.users.map((u) => ({
        id: u.id,
        email: u.email,
        role: (u.app_metadata?.role as string) ?? "",
        lastSignIn: u.last_sign_in_at ?? null,
        createdAt: u.created_at,
        mfa: (u.factors ?? []).some((f) => f.status === "verified"),
      })),
    });
  }

  if (body.action === "create") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const role = body.role === "admin" ? "admin" : "editor";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || password.length < 12) return json({ error: "invalid" }, 400);
    const { error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, app_metadata: { role } });
    if (error) return json({ error: error.message }, 400);
    await log("insert", `${email} (${role})`);
    return json({ ok: true });
  }

  const id = String(body.id ?? "");
  if (!id) return json({ error: "bad-request" }, 400);
  if (id === who.user.id) return json({ error: "self" }, 400);

  if (body.action === "setRole") {
    const role = body.role === "admin" ? "admin" : body.role === "editor" ? "editor" : "";
    const { data, error } = await admin.auth.admin.updateUserById(id, { app_metadata: { role } });
    if (error) return json({ error: error.message }, 400);
    await log("update", `${data.user.email} → ${role || "aucun rôle"}`);
    return json({ ok: true });
  }

  if (body.action === "remove") {
    const { data: target } = await admin.auth.admin.getUserById(id);
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) return json({ error: error.message }, 400);
    await log("delete", target.user?.email ?? id);
    return json({ ok: true });
  }

  return json({ error: "bad-request" }, 400);
}
