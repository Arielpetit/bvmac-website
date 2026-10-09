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

  const onDark = isHome && !scrolled && !open;
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
          onDark ? "border-b border-transparent bg-transparent" : "border-b border-line/70 bg-surface/[0.97] shadow-[0_8px_30px_-20px_rgb(var(--shadow-color)/0.25)] backdrop-blur-xl backdrop-saturate-150",
        )}
      >
        <div className="container-site flex h-[76px] items-center justify-between gap-6">
          <Link href={localePath(locale, "/")} className="relative z-10 flex shrink-0 items-center" aria-label={`BVMAC – ${dict.nav.home}`}>
            <Logo variant="medal" className="size-11 sm:hidden" alt="" priority />
            <span className="hidden sm:block">
              {onDark ? (
                <Logo variant="dark" className="h-[52px] w-auto" alt="" priority />
              ) : (
                <>
                  <Logo variant="light" className="h-[52px] w-auto dark:hidden" alt="" priority />
                  <Logo variant="dark" className="hidden h-[52px] w-auto dark:block" alt="" />
                </>
              )}
            </span>
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

      <AnimatePresence>{drawer && <MobileSheet onClose={() => setDrawer(false)} />}</AnimatePresence>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} index={searchIndex} />
    </>
  );
}

function MobileSheet({ onClose }: { onClose: () => void }) {
  const { locale, dict } = useI18n();
  const [expanded, setExpanded] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={dict.a11y.mainNav}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex flex-col bg-background"
    >
      <div className="container-site flex h-[72px] items-center justify-between">
        <Logo variant="medal" className="size-10" alt="BVMAC" />
        <div className="flex items-center gap-2">
          <SessionChip withTime={false} />
          <button ref={closeRef} type="button" onClick={onClose} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-surface-alt">
            <X className="size-6" strokeWidth={1.6} aria-hidden="true" />
            <span className="sr-only">{dict.a11y.closeMenu}</span>
          </button>
        </div>
      </div>
      <nav className="container-site flex-1 overflow-y-auto pb-6" aria-label={dict.a11y.mainNav} data-lenis-prevent>
        <ul>
          {NAV.map((group, i) => {
            const isOpen = expanded === group.key;
            return (
              <motion.li
                key={group.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.4, ease: EASE }}
                className="border-b border-line"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : group.key)}
                  className="flex min-h-16 w-full items-center justify-between font-serif-display text-[1.75rem] text-heading"
                >
                  {dict.nav[group.key]}
                  <ChevronDown aria-hidden="true" strokeWidth={1.5} className={cn("size-6 transition-transform", isOpen && "rotate-180")} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="grid overflow-hidden pb-3"
                    >
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link href={localePath(locale, item.href)} onClick={onClose} className="flex min-h-12 items-center gap-3 rounded-xl px-2 text-text hover:bg-surface-alt">
                            <NavIcon name={item.icon} className="size-[18px] text-accent-text" />
                            {dict.nav.items[item.key]}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
          <li>
            <Link href={localePath(locale, "/contact")} onClick={onClose} className="flex min-h-16 items-center font-serif-display text-[1.75rem] text-heading">
              {dict.nav.contact}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="container-site flex items-center justify-between border-t border-line py-4">
        <LanguageMenu up />
        <ThemeToggle className="text-heading hover:bg-surface-alt" />
      </div>
    </motion.div>
  );
}
