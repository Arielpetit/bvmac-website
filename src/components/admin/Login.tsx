"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, CalendarCheck, Eye, EyeOff, KeyRound, Loader2, Moon, ShieldCheck, Sun, Users } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { Logo } from "@/components/layout/Logo";
import { usePrefs, type B } from "./prefs";
import { Notice, btnPrimary, inputCls } from "./ui";
import { cn } from "@/lib/cn";

const POINTS: { icon: typeof ShieldCheck; text: B }[] = [
  { icon: CalendarCheck, text: ["Bulletins, cours, avis et actualités au même endroit", "Bulletins, prices, notices and news in one place"] },
  { icon: Users, text: ["Des accès adaptés au rôle de chacun", "Access matched to each person’s role"] },
  { icon: ShieldCheck, text: ["Double authentification et journal des modifications", "Two-factor sign-in and a log of every change"] },
];

export function LangThemeSwitch({ onDark = false }: { onDark?: boolean }) {
  const { lang, setLang, theme, setTheme, tr } = usePrefs();
  return (
    <div className="flex items-center gap-2">
      <div role="group" aria-label={tr(["Langue", "Language"])} className={cn("inline-flex rounded-full border p-0.5 text-xs font-semibold", onDark ? "border-white/20" : "border-line bg-surface")}>
        {(["fr", "en"] as const).map((l) => (
          <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className={cn("h-7 rounded-full px-2.5 uppercase transition-colors", lang === l ? "bg-brand-gold text-espresso" : onDark ? "text-brand-sand/70 hover:text-brand-ivory" : "text-muted hover:text-heading")}>
            {l}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title={tr(["Changer de thème", "Switch theme"])} className={cn("inline-flex size-9 items-center justify-center rounded-full transition-colors", onDark ? "text-brand-sand/80 hover:bg-white/10" : "text-muted hover:bg-surface-alt hover:text-heading")}>
        {theme === "dark" ? <Sun className="size-[18px]" aria-hidden="true" /> : <Moon className="size-[18px]" aria-hidden="true" />}
        <span className="sr-only">{tr(["Changer de thème", "Switch theme"])}</span>
      </button>
    </div>
  );
}

// Two-pane frame shared by sign-in, two-factor and password-reset screens.
export function AuthFrame({ children }: { children: React.ReactNode }) {
  const { tr } = usePrefs();
  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-2">
      <aside className="grain relative isolate hidden overflow-hidden bg-espresso p-12 text-brand-sand lg:flex lg:flex-col lg:justify-between">
        <Image src="/photos/bvmac-building.webp" alt="" fill priority sizes="50vw" className="-z-20 object-cover opacity-45" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-espresso via-espresso/75 to-espresso/40" />
        <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-brand-gold/25 blur-[110px]" />
        <Logo variant="dark" className="h-14 w-auto self-start" priority />
        <div>
          <p className="eyebrow text-brand-gold-light!">{tr(["Espace équipe", "Team area"])}</p>
          <h2 className="font-serif-display mt-4 max-w-md text-[2.75rem] leading-[1.08] text-brand-ivory">{tr(["Publiez le marché, en toute confiance.", "Publish the market, with confidence."])}</h2>
          <ul className="mt-8 space-y-3.5">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text[0]} className="flex items-center gap-3 text-sm text-brand-sand/85">
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-brand-gold-light"><Icon className="size-4" aria-hidden="true" /></span>
                {tr(text)}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-brand-sand/50">© 2026 BVMAC · Immeuble de la Bourse, Douala</p>
      </aside>
      <main className="relative flex flex-col">
        <div className="flex items-center justify-between p-5 lg:justify-end">
          <Image src="/brand/bvmac-medal.png" alt="BVMAC" width={40} height={40} className="size-10 lg:hidden" />
          <LangThemeSwitch />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}

export function Login() {
  const { tr, lang } = usePrefs();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(0);
  const failures = useRef(0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (Date.now() < lockedUntil) return setError(tr(["Trop de tentatives. Patientez une minute.", "Too many attempts. Wait a minute."]));
    setBusy(true);
    setError("");
    const { error: err } = await getBrowserClient().auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) {
      failures.current += 1;
      if (failures.current >= 5) {
        failures.current = 0;
        setLockedUntil(Date.now() + 60_000);
      }
      // Same message for unknown e-mail and wrong password.
      setError(tr(["E-mail ou mot de passe incorrect.", "Incorrect e-mail or password."]));
    }
  }

  async function forgot(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    await getBrowserClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/admin` });
    setBusy(false);
    setSent(true); // Same answer whether or not the account exists.
  }

  if (mode === "forgot") {
    return (
      <AuthFrame>
        <h1 className="font-serif-display text-4xl text-heading">{tr(["Mot de passe oublié", "Forgot password"])}</h1>
        <p className="mt-2 text-sm text-muted">{tr(["Saisissez votre e-mail : si un compte existe, vous recevrez un lien pour choisir un nouveau mot de passe.", "Enter your e-mail: if an account exists, you will receive a link to choose a new password."])}</p>
        <form onSubmit={forgot} className="mt-8 space-y-4">
          <div>
            <label htmlFor="f-email" className="mb-1.5 block text-sm font-medium">{tr(["Adresse e-mail", "E-mail address"])}</label>
            <input id="f-email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={cn(inputCls, "h-12")} />
          </div>
          {sent && <Notice tone="ok">{tr(["Si ce compte existe, un e-mail vient d’être envoyé.", "If this account exists, an e-mail has just been sent."])}</Notice>}
          <button type="submit" disabled={busy} className={cn(btnPrimary, "h-12 w-full")}>{busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{tr(["Envoyer le lien", "Send the link"])}</button>
        </form>
        <button type="button" onClick={() => { setMode("login"); setSent(false); }} className="mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-heading"><ArrowLeft className="size-4" aria-hidden="true" />{tr(["Retour à la connexion", "Back to sign-in"])}</button>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame>
      <h1 className="font-serif-display text-4xl text-heading">{tr(["Connexion", "Sign in"])}</h1>
      <p className="mt-2 text-sm text-muted">{tr(["Accédez à l’espace de publication de la BVMAC.", "Access the BVMAC publishing area."])}</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="a-email" className="mb-1.5 block text-sm font-medium">{tr(["Adresse e-mail", "E-mail address"])}</label>
          <input id="a-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={cn(inputCls, "h-12")} />
        </div>
        <div>
          <label htmlFor="a-pass" className="mb-1.5 block text-sm font-medium">{tr(["Mot de passe", "Password"])}</label>
          <div className="relative">
            <input id="a-pass" type={show ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={cn(inputCls, "h-12 pr-12")} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? tr(["Masquer le mot de passe", "Hide password"]) : tr(["Afficher le mot de passe", "Show password"])} className="absolute right-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-alt">
              {show ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
        {error && <Notice tone="error">{error}</Notice>}
        <button type="submit" disabled={busy} className={cn(btnPrimary, "h-12 w-full")}>
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {tr(["Se connecter", "Sign in"])}
        </button>
      </form>
      <button type="button" onClick={() => { setMode("forgot"); setError(""); }} className="mt-5 block w-full text-center text-sm font-medium text-heading hover:underline">{tr(["Mot de passe oublié ?", "Forgot password?"])}</button>
      <a href={`/${lang}`} className="mt-8 inline-flex items-center gap-2 text-sm text-muted hover:text-heading"><ArrowLeft className="size-4" aria-hidden="true" />{tr(["Retour au site", "Back to the site"])}</a>
      <p className="mt-8 flex items-start gap-2 text-xs text-muted"><ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{tr(["Accès réservé au personnel habilité. Les connexions et modifications sont journalisées.", "Access restricted to authorised staff. Sign-ins and changes are logged."])}</p>
    </AuthFrame>
  );
}

// Second step: 6-digit code from the authenticator app.
export function MfaChallenge({ onVerified }: { onVerified: () => void }) {
  const { tr } = usePrefs();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const db = getBrowserClient();
    const { data } = await db.auth.mfa.listFactors();
    const factor = data?.totp?.find((f) => f.status === "verified");
    if (!factor) {
      setBusy(false);
      return setError(tr(["Aucun second facteur n’est configuré.", "No second factor is set up."]));
    }
    const { error: err } = await db.auth.mfa.challengeAndVerify({ factorId: factor.id, code: code.trim() });
    setBusy(false);
    if (err) return setError(tr(["Code incorrect ou expiré. Réessayez.", "Incorrect or expired code. Try again."]));
    onVerified();
  }

  return (
    <AuthFrame>
      <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-text"><KeyRound className="size-6" aria-hidden="true" /></span>
      <h1 className="font-serif-display mt-5 text-4xl text-heading">{tr(["Vérification en deux étapes", "Two-step verification"])}</h1>
      <p className="mt-2 text-sm text-muted">{tr(["Saisissez le code à 6 chiffres affiché par votre application d’authentification.", "Enter the 6-digit code shown by your authenticator app."])}</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label htmlFor="mfa-code" className="sr-only">{tr(["Code à 6 chiffres", "6-digit code"])}</label>
        <input id="mfa-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required autoFocus value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" className={cn(inputCls, "figure h-14 text-center text-2xl tracking-[0.5em]")} />
        {error && <Notice tone="error">{error}</Notice>}
        <button type="submit" disabled={busy || code.length !== 6} className={cn(btnPrimary, "h-12 w-full")}>{busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{tr(["Vérifier", "Verify"])}</button>
      </form>
      <button type="button" onClick={() => getBrowserClient().auth.signOut()} className="mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-heading"><ArrowLeft className="size-4" aria-hidden="true" />{tr(["Changer de compte", "Use another account"])}</button>
    </AuthFrame>
  );
}

export const passwordProblems = (p: string): B | null =>
  p.length < 12 ? ["12 caractères au minimum.", "At least 12 characters."] : !/[a-z]/.test(p) || !/[A-Z]/.test(p) || !/\d/.test(p) ? ["Mélangez majuscules, minuscules et chiffres.", "Mix upper case, lower case and digits."] : null;

// Shown after the user follows a password-reset link.
export function NewPassword({ onDone }: { onDone: () => void }) {
  const { tr } = usePrefs();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const problem = passwordProblems(password);
    if (problem) return setError(tr(problem));
    setBusy(true);
    const { error: err } = await getBrowserClient().auth.updateUser({ password });
    setBusy(false);
    if (err) return setError(err.message);
    onDone();
  }

  return (
    <AuthFrame>
      <h1 className="font-serif-display text-4xl text-heading">{tr(["Nouveau mot de passe", "New password"])}</h1>
      <p className="mt-2 text-sm text-muted">{tr(["12 caractères au minimum, avec majuscules, minuscules et chiffres.", "At least 12 characters, with upper case, lower case and digits."])}</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label htmlFor="np" className="sr-only">{tr(["Nouveau mot de passe", "New password"])}</label>
        <input id="np" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={cn(inputCls, "h-12")} />
        {error && <Notice tone="error">{error}</Notice>}
        <button type="submit" disabled={busy} className={cn(btnPrimary, "h-12 w-full")}>{busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{tr(["Enregistrer", "Save"])}</button>
      </form>
    </AuthFrame>
  );
}
