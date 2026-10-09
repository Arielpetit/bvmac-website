"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, FileText, LayoutGrid, LineChart, Megaphone, Search, X } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import { cn } from "@/lib/cn";

export type SearchEntry = {
  type: "page" | "security" | "notice" | "document";
  title: string;
  subtitle?: string;
  href: string;
  keywords?: string;
};

const icons = { page: LayoutGrid, security: LineChart, notice: Megaphone, document: FileText };
const ORDER: SearchEntry["type"][] = ["security", "page", "notice", "document"];

const normalise = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function SearchDialog({ open, onClose, index }: { open: boolean; onClose: () => void; index: SearchEntry[] }) {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const results = useMemo(() => {
    const q = normalise(query.trim());
    const list = q
      ? index.filter((e) => normalise(`${e.title} ${e.subtitle ?? ""} ${e.keywords ?? ""}`).includes(q))
      : index.filter((e) => e.type === "security" || (e.type === "page" && ["/marches/boc", "/participants/societes-de-bourse", "/investisseurs/comment-investir", "/ecole-de-bourse", "/avis-et-communiques"].includes(e.href)));
    return ORDER.flatMap((type) => list.filter((e) => e.type === type).slice(0, q ? 6 : 7));
  }, [query, index]);

  function go(entry: SearchEntry) {
    onClose();
    setQuery("");
    router.push(localePath(locale, entry.href));
  }

  const labels: Record<SearchEntry["type"], string> = {
    page: { fr: "Pages", en: "Pages", es: "Páginas" }[locale],
    security: { fr: "Valeurs cotées", en: "Listed securities", es: "Valores cotizados" }[locale],
    notice: { fr: "Avis et communiqués", en: "Notices", es: "Avisos" }[locale],
    document: { fr: "Documents", en: "Documents", es: "Documentos" }[locale],
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      aria-label={dict.nav.search}
      className="mx-auto mt-[12vh] w-[min(680px,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface p-0 text-text shadow-[0_40px_120px_-30px_rgb(0_0_0/0.5)] backdrop:bg-espresso/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-line px-5">
        <Search aria-hidden="true" className="size-5 text-muted" strokeWidth={1.6} />
        <label htmlFor="site-search" className="sr-only">{dict.common.search}</label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          role="combobox"
          aria-expanded="true"
          aria-controls="search-results"
          aria-activedescendant={results[active] ? `result-${active}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && results[active]) {
              e.preventDefault();
              go(results[active]);
            }
          }}
          placeholder={dict.common.searchPlaceholder}
          className="h-16 flex-1 bg-transparent text-lg outline-none placeholder:text-muted focus-visible:outline-none"
        />
        <button type="button" onClick={onClose} className="inline-flex size-9 items-center justify-center rounded-full hover:bg-surface-alt">
          <X className="size-5" strokeWidth={1.6} aria-hidden="true" />
          <span className="sr-only">{dict.common.close}</span>
        </button>
      </div>
      <ul id="search-results" role="listbox" className="max-h-[60vh] overflow-y-auto p-2" data-lenis-prevent>
        {results.length === 0 && <li className="p-6 text-center text-sm text-muted">{dict.common.noResults}</li>}
        {results.map((entry, i) => {
          const Icon = icons[entry.type];
          const header = i === 0 || entry.type !== results[i - 1].type;
          return (
            <li key={entry.type + entry.href + entry.title} role="presentation">
              {header && <p className="px-3 pb-1 pt-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">{labels[entry.type]}</p>}
              <button
                type="button"
                id={`result-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(entry)}
                className={cn("flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors", i === active && "bg-surface-alt")}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface">
                  <Icon aria-hidden="true" className="size-4 text-accent-text" strokeWidth={1.6} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.9375rem] text-heading">{entry.title}</span>
                  {entry.subtitle && <span className="block truncate text-xs text-muted">{entry.subtitle}</span>}
                </span>
                {i === active && <CornerDownLeft aria-hidden="true" className="size-4 text-muted" />}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-muted">
        <span>↑ ↓ · ↵</span>
        <span>Esc</span>
      </div>
    </dialog>
  );
}
