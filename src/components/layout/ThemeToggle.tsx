"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { useHydrated } from "@/lib/client-store";
import { cn } from "@/lib/cn";

function applyTheme(dark: boolean) {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  try {
    localStorage.setItem("bvmac-theme", dark ? "dark" : "light");
  } catch {}
}

export function ThemeToggle({ className }: { className?: string }) {
  const { dict } = useI18n();
  const hydrated = useHydrated();
  const [override, setOverride] = useState<boolean | null>(null);
  const dark = override ?? (hydrated && document.documentElement.dataset.theme === "dark");

  function toggle() {
    const next = !dark;
    setOverride(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? dict.a11y.themeLight : dict.a11y.themeDark}
      className={cn("inline-flex size-9 items-center justify-center rounded-[var(--radius-control)]", className)}
    >
      {dark ? <Sun className="size-4.5" strokeWidth={1.8} /> : <Moon className="size-4.5" strokeWidth={1.8} />}
    </button>
  );
}
