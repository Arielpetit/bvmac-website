"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { KeyRound, Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { usePrefs, type B } from "./prefs";
import { passwordProblems } from "./Login";
import { Notice, PageTitle, btnGhost, btnPrimary, cardCls, inputCls } from "./ui";
import { cn } from "@/lib/cn";

const INFO: B[] = [
  ["Votre nom s’affiche dans l’espace de publication.", "Your name is shown in the publishing area."],
  ["Changez votre mot de passe régulièrement : 12 caractères au minimum.", "Change your password regularly: at least 12 characters."],
  ["La double authentification demande un code de votre téléphone à chaque connexion. Activez-la.", "Two-factor sign-in asks for a code from your phone at each sign-in. Turn it on."],
  ["Langue et thème ne concernent que votre affichage sur cet appareil.", "Language and theme only affect your display on this device."],
];

type Factor = { id: string; status: string; friendly_name?: string };

// Enrol / remove a TOTP authenticator (Google Authenticator, Microsoft Authenticator, Authy…).
export function TwoFactorCard({ onChange }: { onChange?: () => void }) {
  const { tr } = usePrefs();
  const db = getBrowserClient();
  const [factors, setFactors] = useState<Factor[] | null>(null);
  const [enrol, setEnrol] = useState<{ id: string; qr: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "error" | "ok"; text: string } | null>(null);

  const refresh = useCallback(async () => {
    const { data } = await db.auth.mfa.listFactors();
    setFactors((data?.all ?? []) as Factor[]);
  }, [db]);

  useEffect(() => {
    let live = true;
    db.auth.mfa.listFactors().then(({ data }) => live && setFactors((data?.all ?? []) as Factor[]));
    return () => {
      live = false;
    };
  }, [db]);

  const verified = factors?.find((f) => f.status === "verified");

  async function start() {
    setBusy(true);
    setMsg(null);
    // Remove unfinished enrolments so a new one can start.
    for (const f of factors ?? []) if (f.status !== "verified") await db.auth.mfa.unenroll({ factorId: f.id });
    const { data, error } = await db.auth.mfa.enroll({ factorType: "totp", friendlyName: `BVMAC ${new Date().toISOString().slice(0, 10)}` });
    setBusy(false);
    if (error || !data) return setMsg({ tone: "error", text: error?.message ?? "Erreur" });
    setEnrol({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  }

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (!enrol) return;
    setBusy(true);
    const { error } = await db.auth.mfa.challengeAndVerify({ factorId: enrol.id, code: code.trim() });
    setBusy(false);
    if (error) return setMsg({ tone: "error", text: tr(["Code incorrect. Vérifiez l’heure de votre téléphone et réessayez.", "Incorrect code. Check your phone’s clock and try again."]) });
    setEnrol(null);
    setCode("");
    setMsg({ tone: "ok", text: tr(["Double authentification activée.", "Two-factor sign-in is on."]) });
    await refresh();
    onChange?.();
  }

  async function disable() {
    if (!verified || !confirmDialog(tr(["Désactiver la double authentification ? Votre compte sera moins protégé.", "Turn off two-factor sign-in? Your account will be less protected."]))) return;
    setBusy(true);
    const { error } = await db.auth.mfa.unenroll({ factorId: verified.id });
    setBusy(false);
    if (error) return setMsg({ tone: "error", text: error.message });
    setMsg({ tone: "ok", text: tr(["Double authentification désactivée.", "Two-factor sign-in is off."]) });
    await refresh();
    onChange?.();
  }

  return (
    <section className={cn(cardCls, "p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", verified ? "bg-rise-bg text-rise" : "bg-accent-soft text-accent-text")}>{verified ? <ShieldCheck className="size-5" aria-hidden="true" /> : <ShieldOff className="size-5" aria-hidden="true" />}</span>
          <div>
            <h2 className="text-h3">{tr(["Double authentification (2FA)", "Two-factor sign-in (2FA)"])}</h2>
            <p className="mt-1 max-w-xl text-sm text-muted">
              {verified
                ? tr(["Activée : un code de votre application est demandé à chaque connexion.", "On: a code from your app is asked at each sign-in."])
                : tr(["Désactivée. Avec une application comme Google Authenticator, votre compte reste protégé même si votre mot de passe fuit.", "Off. With an app such as Google Authenticator, your account stays protected even if your password leaks."])}
            </p>
          </div>
        </div>
        {factors !== null && !enrol && (verified ? <button type="button" onClick={disable} disabled={busy} className={btnGhost}>{tr(["Désactiver", "Turn off"])}</button> : <button type="button" onClick={start} disabled={busy} className={btnPrimary}>{busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{tr(["Activer", "Turn on"])}</button>)}
      </div>
      {enrol && (
        <form onSubmit={confirm} className="mt-6 grid gap-6 border-t border-line pt-6 sm:grid-cols-[auto_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={enrol.qr} alt={tr(["QR code à scanner", "QR code to scan"])} className="size-44 rounded-xl border border-line bg-white p-2" />
          <div>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-text">
              <li>{tr(["Ouvrez votre application d’authentification.", "Open your authenticator app."])}</li>
              <li>{tr(["Scannez le QR code, ou saisissez la clé :", "Scan the QR code, or type the key:"])} <code className="code break-all rounded bg-surface-alt px-1.5 py-0.5">{enrol.secret}</code></li>
              <li>{tr(["Saisissez le code à 6 chiffres affiché.", "Enter the 6-digit code shown."])}</li>
            </ol>
            <div className="mt-4 flex flex-wrap gap-3">
              <input inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" aria-label={tr(["Code à 6 chiffres", "6-digit code"])} className={cn(inputCls, "figure w-40 text-center text-lg tracking-[0.3em]")} />
              <button type="submit" disabled={busy || code.length !== 6} className={btnPrimary}>{busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{tr(["Confirmer", "Confirm"])}</button>
              <button type="button" onClick={async () => { await db.auth.mfa.unenroll({ factorId: enrol.id }); setEnrol(null); refresh(); }} className={btnGhost}>{tr(["Annuler", "Cancel"])}</button>
            </div>
          </div>
        </form>
      )}
      {msg && <div className="mt-4"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
    </section>
  );
}

const confirmDialog = (text: string) => window.confirm(text);

export function Account({ session }: { session: Session }) {
  const { tr, lang, setLang, theme, setTheme } = usePrefs();
  const db = getBrowserClient();
  const [name, setName] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState<{ where: string; tone: "error" | "ok"; text: string } | null>(null);

  useEffect(() => {
    let live = true;
    db.from("profiles").select("full_name").eq("id", session.user.id).maybeSingle().then(({ data }) => live && setName(data?.full_name ?? ""));
    return () => {
      live = false;
    };
  }, [db, session.user.id]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setBusy("profile");
    const { error } = await db.from("profiles").upsert({ id: session.user.id, full_name: (name ?? "").trim(), locale: lang, theme });
    setBusy("");
    setMsg({ where: "profile", tone: error ? "error" : "ok", text: error ? error.message : tr(["Profil enregistré.", "Profile saved."]) });
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    const problem = passwordProblems(password);
    if (problem) return setMsg({ where: "password", tone: "error", text: tr(problem) });
    setBusy("password");
    const { error } = await db.auth.updateUser({ password });
    setBusy("");
    setPassword("");
    setMsg({ where: "password", tone: error ? "error" : "ok", text: error ? error.message : tr(["Mot de passe modifié.", "Password changed."]) });
  }

  return (
    <div>
      <PageTitle title={tr(["Mon compte", "My account"])} hint={session.user.email} info={INFO} />
      <div className="grid gap-5">
        <form onSubmit={saveProfile} className={cn(cardCls, "grid gap-4 p-6 sm:grid-cols-2")}>
          <h2 className="text-h3 sm:col-span-2">{tr(["Profil et préférences", "Profile and preferences"])}</h2>
          <div>
            <label htmlFor="acc-name" className="mb-1.5 block text-sm font-medium">{tr(["Nom affiché", "Display name"])}</label>
            <input id="acc-name" value={name ?? ""} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="acc-email" className="mb-1.5 block text-sm font-medium">{tr(["Adresse e-mail", "E-mail address"])}</label>
            <input id="acc-email" value={session.user.email ?? ""} readOnly className={cn(inputCls, "bg-surface-alt text-muted")} />
          </div>
          <div>
            <label htmlFor="acc-lang" className="mb-1.5 block text-sm font-medium">{tr(["Langue de l’interface", "Interface language"])}</label>
            <select id="acc-lang" value={lang} onChange={(e) => setLang(e.target.value as "fr" | "en")} className={inputCls}><option value="fr">Français</option><option value="en">English</option></select>
          </div>
          <div>
            <label htmlFor="acc-theme" className="mb-1.5 block text-sm font-medium">{tr(["Thème", "Theme"])}</label>
            <select id="acc-theme" value={theme} onChange={(e) => setTheme(e.target.value as "light" | "dark")} className={inputCls}><option value="light">{tr(["Clair", "Light"])}</option><option value="dark">{tr(["Sombre", "Dark"])}</option></select>
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <button type="submit" disabled={busy === "profile" || name === null} className={btnPrimary}>{busy === "profile" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{tr(["Enregistrer", "Save"])}</button>
            {msg?.where === "profile" && <Notice tone={msg.tone}>{msg.text}</Notice>}
          </div>
        </form>

        <form onSubmit={savePassword} className={cn(cardCls, "p-6")}>
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text"><KeyRound className="size-5" aria-hidden="true" /></span>
            <div className="flex-1">
              <h2 className="text-h3">{tr(["Mot de passe", "Password"])}</h2>
              <p className="mt-1 text-sm text-muted">{tr(["12 caractères au minimum, avec majuscules, minuscules et chiffres.", "At least 12 characters, with upper case, lower case and digits."])}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={tr(["Nouveau mot de passe", "New password"])} aria-label={tr(["Nouveau mot de passe", "New password"])} className={cn(inputCls, "max-w-xs")} />
                <button type="submit" disabled={busy === "password" || !password} className={btnPrimary}>{busy === "password" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{tr(["Modifier", "Change"])}</button>
              </div>
              {msg?.where === "password" && <div className="mt-3"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
            </div>
          </div>
        </form>

        <TwoFactorCard />

        <section className={cn(cardCls, "flex flex-wrap items-center justify-between gap-4 p-6")}>
          <div>
            <h2 className="text-h3">{tr(["Sessions", "Sessions"])}</h2>
            <p className="mt-1 text-sm text-muted">{tr(["Déconnectez tous vos appareils si vous pensez que votre compte est utilisé ailleurs.", "Sign out of all your devices if you think your account is used elsewhere."])}</p>
          </div>
          <button type="button" onClick={() => db.auth.signOut({ scope: "global" })} className={btnGhost}>{tr(["Déconnecter tous les appareils", "Sign out everywhere"])}</button>
        </section>
      </div>
    </div>
  );
}
