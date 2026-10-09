"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Thin gold bar at the very top while an internal navigation is in flight.
export function NavigationProgress() {
  const pathname = usePathname();
  const [pending, setPending] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setPending(null);
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      setPending(url.pathname);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <AnimatePresence>
      {pending && (
        <motion.div
          key={pending}
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-light shadow-[0_0_12px_#c9a23a]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0.85, transition: { duration: 6, ease: [0.1, 0.8, 0.2, 1] } }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.35 } }}
        />
      )}
    </AnimatePresence>
  );
}
