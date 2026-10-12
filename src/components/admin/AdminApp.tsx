"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Session } from "@supabase/supabase-js";
import {
  Activity as ActivityIcon, BarChart3, Bell, BookA, Briefcase, Building2, CalendarCheck, CalendarDays, ExternalLink, FileText, FolderOpen, Handshake,
  History, Images, LayoutDashboard, Landmark, LineChart, Loader2, LogOut, Menu, Newspaper, Receipt, Search, Settings as SettingsIcon, ShieldCheck, UserRound, Users, Video, X,
} from "lucide-react";
import { getBrowserClient, supabaseConfigured } from "@/lib/supabase/browser";
import { PrefsProvider, usePrefs, type B } from "./prefs";
import { resource } from "./resources";
import { ResourceManager } from "./ResourceManager";
import { AuthFrame, LangThemeSwitch, Login, MfaChallenge, NewPassword } from "./Login";
import { Account, TwoFactorCard } from "./Account";
import { Dashboard } from "./Dashboard";
import { Team } from "./Team";
import { Activity } from "./Activity";
import { SettingsPage } from "./Settings";
import { markActivitySeen, useOverview } from "./overview";
import { btnGhost } from "./ui";
import { cn } from "@/lib/cn";

type Item = { view: string; label: B; icon: typeof FileText; adminOnly?: boolean };
const ICONS: Record<string, typeof FileText> = { bulletins: CalendarCheck, equities: LineChart, bonds: Receipt, agenda: CalendarDays, notices: FileText, news: Newspaper, tenders: Briefcase, documents: FolderOpen, videos: Video, photos: Images, board_members: Landmark, timeline: History, brokers: Handshake, partners: Building2, glossary: BookA };
const res = (key: string): Item => ({ view: key, label: resource(key)!.label, icon: ICONS[key] });
const GROUPS: { title: B; items: Item[] }[] = [
  { title: ["", ""], items: [{ view: "dashboard", label: ["Tableau de bord", "Dashboard"], icon: LayoutDashboard }] },
  { title: ["Marché", "Market"], items: [res("bulletins"), res("equities"), res("bonds"), { view: "market", label: ["Synthèse de séance", "Session summary"], icon: BarChart3 }, res("agenda")] },
  { title: ["Publications", "Publications"], items: [res("notices"), res("news"), res("tenders"), res("documents")] },
  { title: ["Médias", "Media"], items: [res("videos"), res("photos")] },
  { title: ["Institution", "Institution"], items: [res("board_members"), res("timeline"), res("brokers"), res("partners"), res("glossary")] },
  { title: ["Site", "Site"], items: [{ view: "settings", label: ["Paramètres du site", "Site settings"], icon: SettingsIcon }] },
  { title: ["Administration", "Administration"], items: [{ view: "team", label: ["Équipe", "Team"], icon: Users, adminOnly: true }, { view: "security", label: ["Sécurité", "Security"], icon: ShieldCheck, adminOnly: true }, { view: "activity", label: ["Journal d’activité", "Activity log"], icon: ActivityIcon }, { view: "account", label: ["Mon compte", "My account"], icon: UserRound }] },
];
const ALL_ITEMS = GROUPS.flatMap((g) => g.items);
const ROLE: Record<string, B> = { admin: ["Administrateur", "Administrator"], editor: ["Éditeur", "Editor"] };
const IDLE_MS = 30 * 60 * 1000;

export function AdminApp() {
  return (
    <PrefsProvider>
      <Gate />
    </PrefsProvider>
  );
}

function Spinner() {
  return <div className="flex min-h-svh items-center justify-center bg-background"><Loader2 className="size-6 animate-spin text-muted" aria-label="…" /></div>;
}

// Decides which screen to show: sign-in, second factor, password reset, or the app.
function Gate() {
  const { tr } = usePrefs();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [recovery, setRecovery] = useState(false);
  const [aal, setAal] = useState<{ current: string; next: string } | null>(null);
  const [require2fa, setRequire2fa] = useState(false);

  const checkAal = useCallback(async () => {
    const db = getBrowserClient();
    const [{ data }, setting] = await Promise.all([db.auth.mfa.getAuthenticatorAssuranceLevel(), db.from("site_settings").select("value").eq("key", "security").maybeSingle()]);
    setAal({ current: data?.currentLevel ?? "aal1", next: data?.nextLevel ?? "aal1" });
    setRequire2fa(Boolean((setting.data?.value as { require_2fa?: boolean } | undefined)?.require_2fa));
  }, []);

  useEffect(() => {
    if (!supabaseConfigured()) return;
    const db = getBrowserClient();
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      if (event === "SIGNED_OUT") setAal(null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    let live = true;
    const db = getBrowserClient();
    Promise.all([db.auth.mfa.getAuthenticatorAssuranceLevel(), db.from("site_settings").select("value").eq("key", "security").maybeSingle()]).then(([{ data }, setting]) => {
      if (!live) return;
      setAal({ current: data?.currentLevel ?? "aal1", next: data?.nextLevel ?? "aal1" });
      setRequire2fa(Boolean((setting.data?.value as { require_2fa?: boolean } | undefined)?.require_2fa));
    });
    return () => {
      live = false;
    };
  }, [userId]);

  // Sign out after 30 minutes without activity.
  useEffect(() => {
    if (!userId) return;
    let timer = window.setTimeout(() => getBrowserClient().auth.signOut(), IDLE_MS);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => getBrowserClient().auth.signOut(), IDLE_MS);
    };
    const events = ["pointerdown", "keydown", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [userId]);

  if (!supabaseConfigured()) return <AuthFrame><h1 className="font-serif-display text-3xl text-heading">Configuration manquante</h1><p className="mt-2 text-sm text-muted">NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</p></AuthFrame>;
  if (session === undefined) return <Spinner />;
  if (!session) return <Login />;
  if (recovery) return <NewPassword onDone={() => setRecovery(false)} />;
  if (!aal) return <Spinner />;
  if (aal.current !== "aal2" && aal.next === "aal2") return <MfaChallenge onVerified={checkAal} />;

  const role = String(session.user.app_metadata?.role ?? "");
  if (role !== "admin" && role !== "editor") {
    return (
      <AuthFrame>
        <h1 className="font-serif-display text-4xl text-heading">{tr(["Accès non autorisé", "Access not allowed"])}</h1>
        <p className="mt-3 text-sm text-muted">{tr(["Le compte", "The account"])} <strong>{session.user.email}</strong> {tr(["n’a pas de rôle d’édition. Demandez à un administrateur de vous l’attribuer.", "has no editing role. Ask an administrator to grant it."])}</p>
        <button type="button" onClick={() => getBrowserClient().auth.signOut()} className={cn(btnGhost, "mt-6")}><LogOut className="size-4" aria-hidden="true" />{tr(["Se déconnecter", "Sign out"])}</button>
      </AuthFrame>
    );
  }
  if (require2fa && aal.current !== "aal2") {
    return (
      <AuthFrame>
        <h1 className="font-serif-display text-3xl text-heading">{tr(["Double authentification requise", "Two-factor sign-in required"])}</h1>
        <p className="mb-6 mt-2 text-sm text-muted">{tr(["La BVMAC exige un second facteur pour accéder à l’espace de publication.", "BVMAC requires a second factor to access the publishing area."])}</p>
        <TwoFactorCard onChange={checkAal} />
        <button type="button" onClick={() => getBrowserClient().auth.signOut()} className={cn(btnGhost, "mt-6")}><LogOut className="size-4" aria-hidden="true" />{tr(["Se déconnecter", "Sign out"])}</button>
      </AuthFrame>
    );
  }
  return <Shell session={session} role={role} />;
}

function Shell({ session, role }: { session: Session; role: string }) {
  const { tr, lang } = usePrefs();
  const [view, setView] = useState("dashboard");
  const [drawer, setDrawer] = useState(false);
  const [bell, setBell] = useState(false);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const { data, reload } = useOverview(session);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    getBrowserClient().from("profiles").select("full_name").eq("id", session.user.id).maybeSingle().then(({ data: p }) => live && setName(p?.full_name ?? ""));
    return () => {
      live = false;
    };
  }, [session.user.id]);

  const go = useCallback(
    (v: string) => {
      setView(v);
      setDrawer(false);
      setBell(false);
      setMenu(false);
      setQuery("");
      if (v === "activity") markActivitySeen();
      if (v === "dashboard") reload();
      top.current?.scrollIntoView();
    },
    [reload],
  );

  const items = useMemo(() => ALL_ITEMS.filter((i) => !i.adminOnly || role === "admin"), [role]);
  const matches = query.trim() ? items.filter((i) => `${i.label[0]} ${i.label[1]}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 7) : [];
  const alerts = data?.alerts ?? [];
  const initials = (name || session.user.email || "?").slice(0, 2).toUpperCase();
  const current = resource(view);

  const nav = (
    <nav aria-label={tr(["Navigation de l’espace de publication", "Publishing area navigation"])} className="flex-1 space-y-5 overflow-y-auto px-3 pb-6" data-lenis-prevent>
      {GROUPS.map((g) => {
        const list = g.items.filter((i) => !i.adminOnly || role === "admin");
        if (!list.length) return null;
        return (
          <div key={g.title[0] || "top"}>
            {g.title[0] && <p className="px-3.5 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-sand/45">{tr(g.title)}</p>}
            <ul className="space-y-0.5">
              {list.map((i) => {
                const drafts = data?.counts[i.view]?.drafts ?? 0;
                return (
                  <li key={i.view}>
                    <button type="button" aria-current={view === i.view ? "page" : undefined} onClick={() => go(i.view)} className={cn("flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors", view === i.view ? "bg-white/12 font-medium text-brand-ivory" : "text-brand-sand/75 hover:bg-white/5 hover:text-brand-ivory")}>
                      <i.icon className={cn("size-4 shrink-0", view === i.view ? "text-brand-gold-light" : "text-brand-gold/80")} aria-hidden="true" />
                      <span className="flex-1 truncate">{tr(i.label)}</span>
                      {drafts > 0 && <span className="rounded-full bg-brand-gold px-1.5 text-[10px] font-semibold text-espresso">{drafts}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
  const brand = (
    <div className="flex items-center gap-3 px-5 py-5">
      <Image src="/brand/bvmac-medal.png" alt="" width={40} height={40} className="size-10" />
      <div>
        <p className="font-serif-display text-lg leading-tight text-brand-ivory">BVMAC</p>
        <p className="text-[11px] uppercase tracking-[0.14em] text-brand-sand/55">{tr(["Publication", "Publishing"])}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-svh bg-background lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="grain relative isolate hidden bg-espresso lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        {brand}
        {nav}
        <a href={`/${lang}`} target="_blank" rel="noopener noreferrer" className="m-3 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/15 text-xs text-brand-sand/80 hover:border-brand-gold hover:text-brand-ivory"><ExternalLink className="size-3.5" aria-hidden="true" />{tr(["Voir le site public", "View the public site"])}</a>
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label={tr(["Fermer le menu", "Close menu"])} className="absolute inset-0 bg-espresso/60" onClick={() => setDrawer(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-espresso">
            <div className="flex items-center justify-between pr-3">{brand}<button type="button" onClick={() => setDrawer(false)} aria-label={tr(["Fermer le menu", "Close menu"])} className="inline-flex size-9 items-center justify-center rounded-full text-brand-sand hover:bg-white/10"><X className="size-5" aria-hidden="true" /></button></div>
            {nav}
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-line bg-surface/95 px-4 backdrop-blur md:px-8">
          <button type="button" onClick={() => setDrawer(true)} aria-label={tr(["Ouvrir le menu", "Open menu"])} className="inline-flex size-10 items-center justify-center rounded-full text-heading hover:bg-surface-alt lg:hidden"><Menu className="size-5" aria-hidden="true" /></button>
          <div className="relative w-full max-w-md">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && matches[0] && go(matches[0].view)} placeholder={tr(["Aller à une rubrique…", "Go to a section…"])} aria-label={tr(["Aller à une rubrique", "Go to a section"])} className="h-11 w-full rounded-full border border-line bg-background pl-11 pr-4 text-sm outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30" />
            {matches.length > 0 && (
              <ul className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-line bg-surface py-1 shadow-soft">
                {matches.map((m) => (
                  <li key={m.view}><button type="button" onClick={() => go(m.view)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-surface-alt"><m.icon className="size-4 text-accent-text" aria-hidden="true" />{tr(m.label)}</button></li>
                ))}
              </ul>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="hidden sm:block"><LangThemeSwitch /></div>
            <div className="relative">
              <button type="button" onClick={() => { setBell((b) => !b); setMenu(false); }} aria-expanded={bell} title={tr(["Notifications", "Notifications"])} className="relative inline-flex size-10 items-center justify-center rounded-full text-muted hover:bg-surface-alt hover:text-heading">
                <Bell className="size-[18px]" aria-hidden="true" />
                {alerts.length > 0 && <span className="absolute right-1 top-1 flex min-w-[18px] items-center justify-center rounded-full bg-fall px-1 text-[10px] font-semibold leading-[18px] text-white">{alerts.length}</span>}
                <span className="sr-only">{tr(["Notifications", "Notifications"])}</span>
              </button>
              {bell && (
                <div className="absolute right-0 top-full z-20 mt-2 w-[min(92vw,360px)] overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
                  <p className="border-b border-line px-4 py-3 text-sm font-semibold text-heading">{tr(["Notifications", "Notifications"])}</p>
                  {alerts.length === 0 ? (
                    <p className="p-4 text-sm text-muted">{tr(["Rien à signaler.", "Nothing to report."])}</p>
                  ) : (
                    <ul className="max-h-80 divide-y divide-line overflow-y-auto" data-lenis-prevent>
                      {alerts.map((a) => (
                        <li key={a.id}><button type="button" onClick={() => go(a.view)} className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm hover:bg-surface-alt"><span className={cn("mt-1.5 size-2 shrink-0 rounded-full", a.tone === "warn" ? "bg-brand-gold" : "bg-line-strong")} />{tr(a.text)}</button></li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <button type="button" onClick={() => { setMenu((m) => !m); setBell(false); }} aria-expanded={menu} className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 hover:bg-surface-alt">
                <span className="flex size-9 items-center justify-center rounded-full bg-espresso text-xs font-semibold text-brand-gold-light">{initials}</span>
                <span className="hidden text-left leading-tight md:block">
                  <span className="block max-w-36 truncate text-sm font-medium text-heading">{name || session.user.email}</span>
                  <span className="block text-xs text-muted">{tr(ROLE[role])}</span>
                </span>
              </button>
              {menu && (
                <div className="absolute right-0 top-full z-20 mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-surface py-1 shadow-soft">
                  <p className="truncate border-b border-line px-4 py-3 text-xs text-muted">{session.user.email}</p>
                  <button type="button" onClick={() => go("account")} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-surface-alt"><UserRound className="size-4 text-muted" aria-hidden="true" />{tr(["Mon compte", "My account"])}</button>
                  <div className="px-4 py-2 sm:hidden"><LangThemeSwitch /></div>
                  <button type="button" onClick={() => getBrowserClient().auth.signOut()} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-fall hover:bg-fall-bg"><LogOut className="size-4" aria-hidden="true" />{tr(["Se déconnecter", "Sign out"])}</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 py-8 md:px-8">
          <div ref={top} className="mx-auto max-w-6xl scroll-mt-24">
            {view === "dashboard" && <Dashboard data={data} name={name} go={go} />}
            {current && <ResourceManager key={current.key} resource={current} role={role} />}
            {view === "market" && (
              <SettingsPage
                title={["Synthèse de séance", "Session summary"]}
                hint={["Les grands chiffres de la dernière séance.", "The headline figures of the last session."]}
                info={[["À mettre à jour après chaque séance, à partir du bulletin officiel.", "Update after each session, from the official bulletin."], ["Ces chiffres s’affichent en tête de la page d’accueil et de la rubrique Marchés.", "These figures show at the top of the home page and the Markets section."], ["Saisissez les montants en FCFA entiers, sans espace ni séparateur.", "Enter amounts in whole FCFA, without spaces or separators."]]}
                sections={["market"]}
                role={role}
              />
            )}
            {view === "settings" && (
              <SettingsPage
                title={["Paramètres du site", "Site settings"]}
                hint={["Coordonnées, bandeau d’annonce, actionnariat et messages des dirigeants.", "Contact details, announcement banner, shareholding and leadership messages."]}
                info={[["Chaque bloc s’enregistre séparément avec son bouton.", "Each block is saved separately with its own button."], ["Seuls les administrateurs peuvent modifier ces réglages.", "Only administrators can change these settings."], ["Le bandeau d’annonce sert aux messages urgents : pensez à le désactiver ensuite.", "The announcement banner is for urgent messages: remember to turn it off afterwards."]]}
                sections={["contact", "announcement", "institution", "messages"]}
                role={role}
              />
            )}
            {view === "security" && role === "admin" && (
              <SettingsPage
                title={["Sécurité", "Security"]}
                hint={["Règles de connexion de l’équipe.", "Team sign-in rules."]}
                info={[["La double authentification protège le site même si un mot de passe est volé.", "Two-factor sign-in protects the site even if a password is stolen."], ["La session se ferme seule après 30 minutes sans activité.", "The session closes by itself after 30 minutes without activity."], ["Après 5 échecs de connexion, un délai d’une minute est imposé.", "After 5 failed sign-ins, a one-minute wait is enforced."], ["Toutes les modifications sont consignées dans le journal d’activité.", "Every change is recorded in the activity log."]]}
                sections={["security"]}
                role={role}
              >
                <TwoFactorCard />
              </SettingsPage>
            )}
            {view === "team" && role === "admin" && <Team session={session} />}
            {view === "activity" && <Activity />}
            {view === "account" && <Account session={session} />}
          </div>
        </main>
      </div>
    </div>
  );
}
