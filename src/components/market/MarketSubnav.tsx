"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { NAV, type NavGroupKey } from "@/lib/navigation";
import { localePath } from "@/lib/paths";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";

// Sticky in-section tabs with an animated indicator.
export function SectionSubnav({ group }: { group: NavGroupKey }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const items = NAV.find((g) => g.key === group)?.items ?? [];
  const current = pathname.replace(/^\/[a-z]{2}/, "") || "/";
  const activeHref = items
    .map((i) => i.href)
    .filter((href) => current === href || current.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <nav aria-label={dict.nav[group]} className="glass sticky top-[72px] z-30 border-b border-line/70">
      <div className="container-site">
        <ul className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
          {items.map((item) => {
            const active = item.href === activeHref;
            return (
              <li key={item.href} className="relative shrink-0">
                <Link
                  href={localePath(locale, item.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn("relative z-10 inline-flex h-9 items-center rounded-full px-4 text-sm transition-colors", active ? "font-medium text-action-text" : "text-muted hover:text-heading")}
                >
                  {dict.nav.items[item.key]}
                </Link>
                {active && <motion.span layoutId={`subnav-${group}`} className="absolute inset-0 rounded-full bg-action" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
