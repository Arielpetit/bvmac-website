"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import { Button } from "@/components/ui/Button";
import { useConsent } from "./ConsentProvider";

// Banner on first visit: "Tout refuser" and "Tout accepter" have the same style
// and size; no pre-ticked choices; closing does not count as consent.
export function CookieConsent() {
  const { locale, dict } = useI18n();
  const { consent, ready, save, settingsOpen, openSettings, closeSettings } = useConsent();
  const t = dict.cookie;

  if (!ready) return null;

  return (
    <>
      {!consent && !settingsOpen && (
        <div role="region" aria-label={t.title} className="fixed inset-x-0 bottom-0 z-[72] p-2 md:bottom-5 md:left-5 md:right-auto md:max-w-[520px] md:p-0">
          <div>
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.45)] md:p-6">
              <div className="flex-1">
                <p className="font-serif-display text-base text-heading md:text-xl">{t.title}</p>
                <p className="mt-1 text-[13px] leading-snug text-muted md:mt-2 md:text-sm">
                  {t.text}{" "}
                  <Link href={localePath(locale, "/politique-de-confidentialite")} className="link">
                    {t.policy}
                  </Link>
                </p>
              </div>
              <div className="mt-3 flex gap-1.5 md:mt-5 md:gap-2">
                <Button size="sm" variant="ghost" className="min-w-0 whitespace-nowrap px-2! text-[13px]! md:px-4! md:text-sm!" onClick={openSettings}>
                  {t.customise}
                </Button>
                <Button size="sm" className="flex-1 min-w-0 whitespace-nowrap px-2! text-[13px]! md:px-4! md:text-sm!" onClick={() => save({ analytics: false, thirdParty: false })}>{t.reject}</Button>
                <Button size="sm" className="flex-1 min-w-0 whitespace-nowrap px-2! text-[13px]! md:px-4! md:text-sm!" onClick={() => save({ analytics: true, thirdParty: true })}>{t.accept}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {settingsOpen && (
        <CookieSettings
          initial={consent ?? { analytics: false, thirdParty: false }}
          onSave={save}
          onClose={closeSettings}
        />
      )}
    </>
  );
}

function CookieSettings({
  initial,
  onSave,
  onClose,
}: {
  initial: { analytics: boolean; thirdParty: boolean };
  onSave: (c: { analytics: boolean; thirdParty: boolean }) => void;
  onClose: () => void;
}) {
  const { dict } = useI18n();
  const t = dict.cookie;
  const [analytics, setAnalytics] = useState(initial.analytics);
  const [thirdParty, setThirdParty] = useState(initial.thirdParty);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const rows = [
    { id: "necessary", title: t.necessary, text: t.necessaryText, checked: true, disabled: true, set: () => {} },
    { id: "analytics", title: t.analytics, text: t.analyticsText, checked: analytics, disabled: false, set: setAnalytics },
    { id: "third", title: t.thirdParty, text: t.thirdPartyText, checked: thirdParty, disabled: false, set: setThirdParty },
  ];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="cookie-settings-title"
      className="mx-auto mt-[10vh] w-[min(560px,calc(100vw-2rem))] rounded-[var(--radius-panel)] border border-line bg-surface p-7 text-text shadow-2xl backdrop:bg-espresso/50 backdrop:backdrop-blur-sm"
    >
      <h2 id="cookie-settings-title" className="text-h3">
        {t.settingsTitle}
      </h2>
      <ul className="mt-4 divide-y divide-line">
        {rows.map((row) => (
          <li key={row.id} className="flex items-start justify-between gap-6 py-4">
            <label htmlFor={`consent-${row.id}`} className="cursor-pointer">
              <span className="block font-semibold">{row.title}</span>
              <span className="block text-sm text-muted">{row.text}</span>
            </label>
            <input
              id={`consent-${row.id}`}
              type="checkbox"
              checked={row.checked}
              disabled={row.disabled}
              onChange={(e) => row.set(e.target.checked)}
              className="mt-1 size-5 shrink-0 accent-[#1c130b] disabled:opacity-60"
            />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={() => onSave({ analytics: false, thirdParty: false })}>
          {t.reject}
        </Button>
        <Button onClick={() => onSave({ analytics, thirdParty })}>{t.save}</Button>
      </div>
    </dialog>
  );
}

export function CookieSettingsLink({ className }: { className?: string }) {
  const { dict } = useI18n();
  const { openSettings } = useConsent();
  return (
    <button type="button" onClick={openSettings} className={className}>
      {dict.footer.cookies}
    </button>
  );
}
