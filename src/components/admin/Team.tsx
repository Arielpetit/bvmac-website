"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Loader2, Plus, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { usePrefs, type B } from "./prefs";
import { Notice, PageTitle, btnGhost, btnPrimary, cardCls, fmtDateTime, inputCls } from "./ui";
import { cn } from "@/lib/cn";

type Member = { id: string; email: string; role: string; lastSignIn: string | null; createdAt: string; mfa: boolean };

const INFO: B[] = [
  ["Éditeur : crée, modifie et publie les contenus. Administrateur : en plus, supprime, gère l’équipe et les réglages.", "Editor: creates, edits and publishes content. Administrator: also deletes, manages the team and the settings."],
  ["Créez un compte par personne ; ne partagez jamais un mot de passe.", "Create one account per person; never share a password."],
  ["Transmettez le mot de passe provisoire par un canal sûr et demandez à la personne de le changer et d’activer la double authentification.", "Send the temporary password over a safe channel and ask the person to change it and turn on two-factor sign-in."],
  ["Retirez immédiatement le compte d’une personne qui quitte la BVMAC.", "Remove the account of anyone leaving BVMAC immediately."],
];
const ERRORS: Record<string, B> = {
  "not-configured": ["La gestion de l’équipe n’est pas configurée sur le serveur (clé secrète manquante).", "Team management is not configured on the server (secret key missing)."],
  forbidden: ["Réservé aux administrateurs.", "Administrators only."],
  "mfa-required": ["Validez d’abord votre double authentification (reconnectez-vous).", "Complete two-factor sign-in first (sign in again)."],
  invalid: ["E-mail invalide ou mot de passe de moins de 12 caractères.", "Invalid e-mail or password shorter than 12 characters."],
  self: ["Vous ne pouvez pas modifier votre propre compte ici.", "You cannot change your own account here."],
};

export function Team({ session }: { session: Session }) {
  const { tr, lang } = usePrefs();
  const [members, setMembers] = useState<Member[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<{ email: string; password: string; role: string } | null>(null);

  const call = useCallback(
    async (body: Record<string, unknown>) => {
      const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify(body) });
      return (await res.json().catch(() => ({ error: "network" }))) as { users?: Member[]; error?: string; ok?: boolean };
    },
    [session.access_token],
  );
  const show = useCallback((code?: string) => setError(code ? (ERRORS[code] ? tr(ERRORS[code]) : code) : ""), [tr]);

  useEffect(() => {
    let live = true;
    call({ action: "list" }).then((r) => {
      if (!live) return;
      if (r.users) setMembers(r.users);
      else show(r.error);
    });
    return () => {
      live = false;
    };
  }, [call, show]);

  async function run(body: Record<string, unknown>) {
    setBusy(true);
    const r = await call(body);
    if (r.error) show(r.error);
    else {
      show();
      setForm(null);
      const list = await call({ action: "list" });
      if (list.users) setMembers(list.users);
    }
    setBusy(false);
  }

  const generate = () => {
    const bytes = crypto.getRandomValues(new Uint8Array(12));
    return "Bv" + Array.from(bytes, (b) => "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"[b % 55]).join("") + "7";
  };

  return (
    <div>
      <PageTitle
        title={tr(["Équipe", "Team"])}
        hint={tr(["Les personnes qui peuvent publier sur le site.", "The people who can publish on the site."])}
        info={INFO}
        action={<button type="button" onClick={() => setForm({ email: "", password: generate(), role: "editor" })} className={btnPrimary}><Plus className="size-4" aria-hidden="true" />{tr(["Inviter un membre", "Add a member"])}</button>}
      />
      {error && <div className="mb-4"><Notice tone="error">{error}</Notice></div>}
      {form && (
        <form onSubmit={(e) => { e.preventDefault(); run({ action: "create", ...form }); }} className={cn(cardCls, "mb-5 grid gap-4 p-6 sm:grid-cols-[1.4fr_1.2fr_1fr_auto] sm:items-end")}>
          <div>
            <label htmlFor="t-email" className="mb-1.5 block text-sm font-medium">{tr(["Adresse e-mail", "E-mail address"])}</label>
            <input id="t-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label htmlFor="t-pass" className="mb-1.5 block text-sm font-medium">{tr(["Mot de passe provisoire", "Temporary password"])}</label>
            <input id="t-pass" required minLength={12} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={cn(inputCls, "code")} />
          </div>
          <div>
            <label htmlFor="t-role" className="mb-1.5 block text-sm font-medium">{tr(["Rôle", "Role"])}</label>
            <select id="t-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}><option value="editor">{tr(["Éditeur", "Editor"])}</option><option value="admin">{tr(["Administrateur", "Administrator"])}</option></select>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className={btnPrimary}>{busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{tr(["Créer", "Create"])}</button>
            <button type="button" onClick={() => setForm(null)} className={btnGhost}>{tr(["Annuler", "Cancel"])}</button>
          </div>
          <p className="text-xs text-muted sm:col-span-4">{tr(["Notez le mot de passe provisoire maintenant : il ne sera plus affiché.", "Note the temporary password now: it will not be shown again."])}</p>
        </form>
      )}
      <div className={cn(cardCls, "overflow-hidden")}>
        {members === null ? (
          <p className="flex items-center gap-2 p-6 text-sm text-muted"><Loader2 className="size-4 animate-spin" aria-hidden="true" />{tr(["Chargement…", "Loading…"])}</p>
        ) : (
          <ul className="divide-y divide-line">
            {members.map((m) => {
              const me = m.id === session.user.id;
              return (
                <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold uppercase text-accent-text">{m.email.slice(0, 2)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-heading">{m.email}{me && <span className="ml-2 rounded-full bg-surface-alt px-2 py-0.5 text-xs font-normal text-muted">{tr(["vous", "you"])}</span>}</span>
                    <span className="block text-xs text-muted">{m.lastSignIn ? `${tr(["Dernière connexion", "Last sign-in"])} : ${fmtDateTime(m.lastSignIn, lang)}` : tr(["Jamais connecté", "Never signed in"])}</span>
                  </span>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", m.mfa ? "bg-rise-bg text-rise" : "bg-accent-soft text-accent-text")}>{m.mfa ? <ShieldCheck className="size-3.5" aria-hidden="true" /> : <ShieldOff className="size-3.5" aria-hidden="true" />}2FA {m.mfa ? tr(["active", "on"]) : tr(["inactive", "off"])}</span>
                  <select aria-label={tr(["Rôle", "Role"])} value={m.role} disabled={me || busy} onChange={(e) => run({ action: "setRole", id: m.id, role: e.target.value })} className={cn(inputCls, "h-10 w-44")}>
                    <option value="admin">{tr(["Administrateur", "Administrator"])}</option>
                    <option value="editor">{tr(["Éditeur", "Editor"])}</option>
                    <option value="">{tr(["Aucun accès", "No access"])}</option>
                  </select>
                  <button type="button" disabled={me || busy} onClick={() => confirm(`${tr(["Supprimer le compte", "Delete the account"])} ${m.email} ?`) && run({ action: "remove", id: m.id })} title={tr(["Supprimer le compte", "Delete the account"])} className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-fall-bg hover:text-fall disabled:opacity-30"><Trash2 className="size-4" aria-hidden="true" /><span className="sr-only">{tr(["Supprimer le compte", "Delete the account"])}</span></button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
