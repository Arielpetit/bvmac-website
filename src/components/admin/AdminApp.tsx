"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Session } from "@supabase/supabase-js";
import { ExternalLink, Loader2, LogOut, Newspaper, FileText, Briefcase, CalendarCheck } from "lucide-react";
import { getBrowserClient, supabaseConfigured } from "@/lib/supabase/browser";
import { RESOURCES } from "./resources";
import { ResourceManager } from "./ResourceManager";
import { cn } from "@/lib/cn";

const ICONS: Record<string, typeof FileText> = { bulletins: CalendarCheck, notices: FileText, news: Newspaper, tenders: Briefcase };
const ROLE_LABEL: Record<string, string> = { admin: "Administrateur", editor: "Éditeur" };

export function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [tab, setTab] = useState(RESOURCES[0].key);

  useEffect(() => {
    if (!supabaseConfigured()) return;
    const db = getBrowserClient();
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured()) {
    return <Centered title="Configuration manquante">Les variables <code>NEXT_PUBLIC_SUPABASE_URL</code> et <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> ne sont pas définies.</Centered>;
  }
  if (session === undefined) {
    return <div className="flex min-h-svh items-center justify-center"><Loader2 className="size-6 animate-spin text-muted" aria-label="Chargement" /></div>;
  }
  if (!session) return <Login />;

  const role = String(session.user.app_metadata?.role ?? "");
  if (role !== "admin" && role !== "editor") {
    return (
      <Centered title="Accès non autorisé">
        Le compte <strong>{session.user.email}</strong> n’a pas de rôle d’édition. Demandez à un administrateur de BVMAC de vous l’attribuer.
        <button type="button" onClick={() => getBrowserClient().auth.signOut()} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-medium"><LogOut className="size-4" aria-hidden="true" />Se déconnecter</button>
      </Centered>
    );
  }

  const current = RESOURCES.find((r) => r.key === tab) ?? RESOURCES[0];
  return (
    <div className="min-h-svh bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-espresso text-brand-sand lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:border-b-0">
        <div className="flex items-center gap-3 px-5 py-4 lg:py-6">
          <Image src="/brand/bvmac-medal.png" alt="" width={40} height={40} className="size-10" />
          <div>
            <p className="font-serif-display text-lg leading-tight text-brand-ivory">BVMAC</p>
            <p className="text-xs text-brand-sand/60">Espace de publication</p>
          </div>
        </div>
        <nav aria-label="Contenus" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {RESOURCES.map((r) => {
            const Icon = ICONS[r.key] ?? FileText;
            return (
              <button key={r.key} type="button" aria-current={tab === r.key ? "page" : undefined} onClick={() => setTab(r.key)} className={cn("flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors", tab === r.key ? "bg-white/10 text-brand-ivory" : "text-brand-sand/70 hover:bg-white/5 hover:text-brand-ivory")}>
                <Icon className="size-4 text-brand-gold" aria-hidden="true" />
                {r.label}
              </button>
            );
          })}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <p className="truncate text-sm text-brand-ivory">{session.user.email}</p>
          <p className="text-xs text-brand-sand/60">{ROLE_LABEL[role]}</p>
          <div className="mt-3 flex gap-2">
            <a href="/fr" target="_blank" rel="noopener noreferrer" className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-white/15 text-xs hover:border-brand-gold"><ExternalLink className="size-3.5" aria-hidden="true" />Voir le site</a>
            <button type="button" onClick={() => getBrowserClient().auth.signOut()} className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-white/15 text-xs hover:border-brand-gold"><LogOut className="size-3.5" aria-hidden="true" />Quitter</button>
          </div>
        </div>
      </aside>
      <main className="px-5 py-8 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <p className="truncate text-sm text-muted">{session.user.email} · {ROLE_LABEL[role]}</p>
            <button type="button" onClick={() => getBrowserClient().auth.signOut()} className="text-sm text-link">Quitter</button>
          </div>
          <ResourceManager key={current.key} resource={current} role={role} />
        </div>
      </main>
    </div>
  );
}

function Centered({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="max-w-md rounded-[var(--radius-panel)] border border-line bg-surface p-8 text-center shadow-soft">
        <h1 className="font-serif-display text-3xl text-heading">{title}</h1>
        <div className="mt-3 text-sm text-muted">{children}</div>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: err } = await getBrowserClient().auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) setError(err.message === "Invalid login credentials" ? "E-mail ou mot de passe incorrect." : err.message);
  }

  const field = "h-12 w-full rounded-xl border border-line bg-surface px-4 text-sm outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30";
  return (
    <div className="grain relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-espresso p-6">
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute -right-20 -top-20 -z-10 size-96 rounded-full bg-brand-gold/20 blur-[100px]" />
      <form onSubmit={submit} className="w-full max-w-sm rounded-[var(--radius-panel)] bg-surface p-8 shadow-2xl">
        <Image src="/brand/bvmac-logo-light.png" alt="BVMAC" width={160} height={53} className="h-10 w-auto" priority />
        <h1 className="font-serif-display mt-6 text-3xl text-heading">Espace de publication</h1>
        <p className="mt-1 text-sm text-muted">Réservé aux équipes de la BVMAC.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="a-email" className="mb-1.5 block text-sm font-medium">Adresse e-mail</label>
            <input id="a-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="a-pass" className="mb-1.5 block text-sm font-medium">Mot de passe</label>
            <input id="a-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
          </div>
        </div>
        {error && <p role="alert" className="mt-4 rounded-xl bg-fall-bg px-3.5 py-2.5 text-sm text-fall">{error}</p>}
        <button type="submit" disabled={busy} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-action font-medium text-action-text hover:bg-action-hover disabled:opacity-60">
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Se connecter
        </button>
      </form>
    </div>
  );
}
