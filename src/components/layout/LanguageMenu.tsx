"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { setCookie } from "@/lib/client-store";
import { cn } from "@/lib/cn";

export function LanguageMenu({ tone = "default", up = false }: { tone?: "default" | "onDark"; up?: boolean }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const hrefFor = (target: Locale) => {
    const parts = pathname.split("/");
    parts[1] = target;
    return parts.join("/") || `/${target}`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
          tone === "onDark" ? "text-brand-ivory/85 hover:bg-white/10 hover:text-brand-ivory" : "text-muted hover:bg-surface-alt hover:text-heading",
        )}
      >
        <Globe className="size-4" strokeWidth={1.6} aria-hidden="true" />
        <span className="uppercase">{locale}</span>
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
        <span className="sr-only">{dict.a11y.language}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={cn("absolute z-50", up ? "bottom-12 left-0" : "right-0 top-12", " w-44 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-soft")}
          >
            {locales.map((code) => (
              <li key={code}>
                <a
                  href={hrefFor(code)}
                  hrefLang={code}
                  lang={code}
                  onClick={() => setCookie("NEXT_LOCALE", code, 31_536_000)}
                  aria-current={code === locale ? "true" : undefined}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-text hover:bg-surface-alt"
                >
                  {localeNames[code]}
                  {code === locale && <Check className="size-4 text-accent-text" aria-hidden="true" />}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
