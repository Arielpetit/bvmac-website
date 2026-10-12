"use client";

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useStoredJSON } from "@/lib/client-store";

export type Lang = "fr" | "en";
export type Theme = "light" | "dark";
/** Bilingual text: [French, English]. */
export type B = readonly [string, string];

type Prefs = { lang: Lang; setLang: (l: Lang) => void; theme: Theme; setTheme: (t: Theme) => void; tr: (b: B) => string };
const Ctx = createContext<Prefs | null>(null);

// Admin language and theme, remembered on this device.
export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useStoredJSON<Lang>("bvmac-admin-lang", "fr");
  const [theme, setTheme] = useStoredJSON<Theme>("bvmac-admin-theme", "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang;
  }, [theme, lang]);

  const tr = useCallback((b: B) => b[lang === "fr" ? 0 : 1], [lang]);
  const value = useMemo(() => ({ lang, setLang, theme, setTheme, tr }), [lang, setLang, theme, setTheme, tr]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePrefs outside PrefsProvider");
  return v;
}
