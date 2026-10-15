"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { NAV, type NavGroup } from "@/lib/navigation";
import { localePath } from "@/lib/paths";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { LanguageMenu } from "./LanguageMenu";
import { ThemeToggle } from "./ThemeToggle";
import { SessionChip } from "./SessionChip";
import { NavIcon } from "./NavIcon";
import { SearchDialog, type SearchEntry } from "./SearchDialog";

const EASE = [0.16, 1, 0.3, 1] as const;

function useActiveGroup() {
  const pathname = usePathname();
  return useCallback(
    (group: NavGroup) => {
      const rest = `/${pathname.split("/").slice(2).join("/")}`;
      if (rest === "/") return false;
      const owner = NAV.find((g) => g.items.some((i) => rest === i.href || rest.startsWith(`${i.href}/`)));
      return owner?.key === group.key;
    },
    [pathname],
  );
}

export function Header({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const isActive = useActiveGroup();
  const isHome = pathname.split("/").filter(Boolean).length <= 1;
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
    setDrawer(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  // The home hero is light, so the header keeps dark text; it is only transparent at the top.
  const transparent = isHome && !scrolled && !open;
  const onDark = false;
  const enter = (key: string) => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(key);
  };
  const leave = () => {
    timer.current = setTimeout(() => setOpen(null), 140);
  };
  const current = NAV.find((g) => g.key === open);

  return (
    <>
      <header
        onMouseLeave={leave}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500",
          transparent ? "border-b border-transparent bg-transparent" : "border-b border-line/70 bg-surface/[0.97] shadow-[0_8px_30px_-20px_rgb(var(--shadow-color)/0.25)] backdrop-blur-xl backdrop-saturate-150",
        )}
      >
        <div className="container-site flex h-[76px] items-center justify-between gap-6">
          <Link href={localePath(locale, "/")} className="relative z-10 flex shrink-0 items-center" aria-label={`BVMAC – ${dict.nav.home}`}>
            {onDark ? (
              <Logo variant="dark" className="h-[52px] w-auto sm:h-16" alt="" priority />
            ) : (
              <>
                <Logo variant="light" className="h-[52px] w-auto sm:h-16 dark:hidden" alt="" priority />
                <Logo variant="dark" className="hidden h-[52px] w-auto sm:h-16 dark:block" alt="" />
              </>
            )}
          </Link>

          <nav aria-label={dict.a11y.mainNav} className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {NAV.map((group) => {
                const active = isActive(group);
                const expanded = open === group.key;
                return (
                  <li key={group.key} onMouseEnter={() => enter(group.key)}>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls="mega-panel"
                      onClick={() => setOpen(expanded ? null : group.key)}
                      onFocus={() => enter(group.key)}
                      className={cn(
                        "relative flex h-10 items-center gap-1 whitespace-nowrap rounded-full px-3 text-[0.9375rem] font-medium transition-colors xl:px-3.5",
                        onDark ? "text-brand-ivory/85 hover:text-brand-ivory" : "text-muted hover:text-heading",
                        (expanded || active) && (onDark ? "text-brand-ivory" : "text-heading"),
                      )}
                    >
                      {dict.nav[group.key]}
                      <ChevronDown aria-hidden="true" className={cn("size-3.5 opacity-60 transition-transform duration-300", expanded && "rotate-180")} />
                      {(expanded || active) && (
                        <motion.span
                          layoutId="nav-pill"
                          className={cn("absolute inset-0 -z-10 rounded-full", onDark ? "bg-white/10" : "bg-surface-alt")}
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              title={`${dict.nav.search} (Ctrl K)`}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full transition-colors",
                onDark ? "text-brand-ivory/85 hover:bg-white/10" : "text-muted hover:bg-surface-alt hover:text-heading",
              )}
            >
              <Search className="size-[19px]" strokeWidth={1.7} aria-hidden="true" />
              <span className="sr-only">{dict.nav.search}</span>
            </button>
            <div className="hidden md:block">
              <LanguageMenu tone={onDark ? "onDark" : "default"} />
            </div>
            <ThemeToggle className={cn("hidden md:inline-flex", onDark ? "text-brand-ivory/85 hover:bg-white/10" : "text-muted hover:bg-surface-alt hover:text-heading")} />
            <Link
              href={localePath(locale, "/marches")}
              className={cn(
                "ml-1 hidden h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors 2xl:inline-flex",
                onDark ? "bg-brand-gold text-espresso hover:bg-brand-gold-light" : "bg-action text-action-text hover:bg-action-hover",
              )}
            >
              {dict.market.seeMarket}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              className={cn("inline-flex size-10 items-center justify-center rounded-full lg:hidden", onDark ? "text-brand-ivory hover:bg-white/10" : "text-heading hover:bg-surface-alt")}
              aria-expanded={drawer}
              aria-controls="mobile-menu"
              onClick={() => setDrawer(true)}
            >
              <Menu className="size-6" strokeWidth={1.6} aria-hidden="true" />
              <span className="sr-only">{dict.a11y.openMenu}</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {current && (
            <motion.div
              id="mega-panel"
              key="panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              onMouseEnter={() => enter(current.key)}
              className="absolute inset-x-0 top-full hidden border-b border-line bg-surface lg:block"
            >
              <div className="container-site grid grid-cols-[1fr_340px] gap-10 py-8">
                <div>
                  <p className="eyebrow">{dict.nav[current.key]}</p>
                  <p className="mt-2 max-w-md text-sm text-muted">{dict.nav.groupIntro[current.key]}</p>
                  <motion.ul key={current.key} initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.025 } } }} className="mt-6 grid grid-cols-2 gap-1 xl:grid-cols-3">
                    {current.items.map((item) => (
                      <motion.li key={item.href} variants={{ h: { opacity: 0, y: 6 }, s: { opacity: 1, y: 0 } }}>
                        <Link
                          href={localePath(locale, item.href)}
                          className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-surface-alt"
                        >
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-accent-text transition-colors group-hover:border-brand-gold/50">
                            <NavIcon name={item.icon} className="size-[18px]" />
                          </span>
                          <span className="text-[0.9375rem] font-medium text-heading">{dict.nav.items[item.key]}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
                <Link href={localePath(locale, current.feature.href)} className="group relative block h-full min-h-60 overflow-hidden rounded-[var(--radius-card)] bg-espresso">
                  <Image src={current.feature.image} alt="" fill sizes="340px" className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block font-serif-display text-xl text-brand-ivory">{current.feature.title[locale]}</span>
                    <span className="mt-1 block text-sm text-brand-sand/80">{current.feature.text[locale]}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-gold-light">
                      {dict.common.readMore} <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>{drawer && <MobileSheet onClose={() => setDrawer(false)} onSearch={() => { setDrawer(false); setSearchOpen(true); }} />}</AnimatePresence>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} index={searchIndex} />
    </>
  );
}

const GROUP_ICONS: Record<NavGroup["key"], string> = {
  markets: "Activity",
  invest: "Compass",
  issuers: "Briefcase",
  learn: "GraduationCap",
  news: "Newspaper",
  about: "Landmark",
};

function MobileSheet({ onClose, onSearch }: { onClose: () => void; onSearch: () => void }) {
  const { locale, dict } = useI18n();
  const isActive = useActiveGroup();
  const [expanded, setExpanded] = useState<string | null>(() => NAV.find((g) => isActive(g))?.key ?? null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    // Lock page scroll and let fixed widgets (chat launcher) step aside while the menu is open.
    const html = document.documentElement;
    html.style.overflow = "hidden";
    html.dataset.menu = "open";
    return () => {
      html.style.overflow = "";
      delete html.dataset.menu;
    };
  }, []);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={dict.a11y.mainNav}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="fixed inset-0 z-[80] flex flex-col bg-background"
    >
      <div className="container-site flex h-[72px] shrink-0 items-center justify-between border-b border-line">
        <Link href={localePath(locale, "/")} onClick={onClose} aria-label="BVMAC">
          <Logo variant="light" className="h-9 w-auto dark:hidden" alt="BVMAC" />
          <Logo variant="dark" className="hidden h-9 w-auto dark:block" alt="BVMAC" />
        </Link>
        <button ref={closeRef} type="button" onClick={onClose} className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-heading transition-colors hover:bg-surface-alt">
          <X className="size-5" strokeWidth={1.6} aria-hidden="true" />
          <span className="sr-only">{dict.a11y.closeMenu}</span>
        </button>
      </div>

      <nav className="container-site flex-1 overflow-y-auto py-5" aria-label={dict.a11y.mainNav} data-lenis-prevent>
        <button
          type="button"
          onClick={onSearch}
          className="mb-5 flex h-12 w-full items-center gap-3 rounded-full border border-line bg-surface px-4 text-left text-sm text-muted shadow-soft"
        >
          <Search aria-hidden="true" className="size-[18px] text-accent-text" strokeWidth={1.8} />
          <span className="truncate">{dict.common.searchPlaceholder}</span>
        </button>

        <ul className="grid gap-1">
          {NAV.map((group, i) => {
            const isOpen = expanded === group.key;
            const active = isActive(group);
            return (
              <motion.li key={group.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i, duration: 0.35, ease: EASE }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : group.key)}
                  className={cn("flex min-h-14 w-full items-center gap-3.5 rounded-2xl px-2 text-left transition-colors", isOpen ? "bg-surface-alt" : "hover:bg-surface-alt/60")}
                >
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors", isOpen ? "bg-action text-action-text" : "bg-accent-soft text-accent-text")}>
                    <NavIcon name={GROUP_ICONS[group.key]} className="size-[18px]" />
                  </span>
                  <span className="flex-1 text-[1.0625rem] font-medium text-heading">{dict.nav[group.key]}</span>
                  {active && <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />}
                  <ChevronDown aria-hidden="true" strokeWidth={1.8} className={cn("size-[18px] text-muted transition-transform duration-300", isOpen && "rotate-180 text-heading")} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="ml-[1.6rem] grid overflow-hidden border-l border-line pl-4"
                    >
                      {group.items.map((item, k) => (
                        <li key={item.href} className={cn(k === 0 && "pt-2", k === group.items.length - 1 && "pb-3")}>
                          <Link href={localePath(locale, item.href)} onClick={onClose} className="group flex min-h-11 items-center gap-3 rounded-xl px-2.5 text-[0.9375rem] text-text transition-colors hover:bg-surface-alt hover:text-heading">
                            <NavIcon name={item.icon} className="size-4 text-accent-text" />
                            <span className="flex-1">{dict.nav.items[item.key]}</span>
                            <ArrowRight aria-hidden="true" className="size-3.5 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
          <motion.li initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * NAV.length, duration: 0.35, ease: EASE }}>
            <Link href={localePath(locale, "/contact")} onClick={onClose} className="flex min-h-14 items-center gap-3.5 rounded-2xl px-2 transition-colors hover:bg-surface-alt/60">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
                <NavIcon name="Mail" className="size-[18px]" />
              </span>
              <span className="flex-1 text-[1.0625rem] font-medium text-heading">{dict.nav.contact}</span>
              <ArrowUpRight aria-hidden="true" strokeWidth={1.8} className="size-[18px] text-muted" />
            </Link>
          </motion.li>
        </ul>
      </nav>

      <div className="container-site shrink-0 border-t border-line bg-surface pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
        <Link href={localePath(locale, "/marches")} onClick={onClose} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-action font-medium text-action-text transition-colors hover:bg-action-hover">
          {dict.market.seeMarket}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <div className="mt-3 flex items-center justify-between gap-3">
          <SessionChip withTime={false} />
          <div className="flex items-center gap-1">
            <LanguageMenu up />
            <ThemeToggle className="text-heading hover:bg-surface-alt" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
