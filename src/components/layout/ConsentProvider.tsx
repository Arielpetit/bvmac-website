"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useHydrated, useStoredJSON } from "@/lib/client-store";

export type Consent = { analytics: boolean; thirdParty: boolean; decidedAt: string; version: 1 };

type ConsentValue = {
  consent: Consent | null;
  ready: boolean;
  save: (choice: { analytics: boolean; thirdParty: boolean }) => void;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const ConsentContext = createContext<ConsentValue | null>(null);
const KEY = "bvmac-consent";

// Consent is stored on the device. In production the choice is also logged
// server-side (POST /v1/consent) for accountability under law n°2024/017.
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useStoredJSON<Consent | null>(KEY, null);
  const ready = useHydrated();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const save = useCallback(
    (choice: { analytics: boolean; thirdParty: boolean }) => {
      setConsent({ ...choice, decidedAt: new Date().toISOString(), version: 1 });
      setSettingsOpen(false);
    },
    [setConsent],
  );

  return (
    <ConsentContext.Provider
      value={{
        consent,
        ready,
        save,
        settingsOpen,
        openSettings: () => setSettingsOpen(true),
        closeSettings: () => setSettingsOpen(false),
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const value = useContext(ConsentContext);
  if (!value) throw new Error("useConsent must be used inside ConsentProvider");
  return value;
}
