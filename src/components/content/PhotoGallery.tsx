"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import type { Album } from "@/data/media";

// Album grid with an accessible lightbox (Escape, arrow keys, focus kept in the dialog).
export function PhotoGallery({ albums }: { albums: Album[] }) {
  const { dict } = useI18n();
  const [open, setOpen] = useState<{ album: number; photo: number } | null>(null);
  const current = open ? albums[open.album].photos[open.photo] : null;

  const move = useCallback(
    (dir: 1 | -1) => setOpen((o) => (o ? { ...o, photo: (o.photo + dir + albums[o.album].photos.length) % albums[o.album].photos.length } : o)),
    [albums],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, move]);

  return (
    <div className="grid gap-16">
      {albums.map((album, ai) => (
        <section key={album.id} aria-labelledby={`al-${album.id}`}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id={`al-${album.id}`} className="text-h2">{album.title}</h2>
            <p className="text-sm text-muted">{album.date} · {album.photos.length} photos</p>
          </div>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {album.photos.map((p, pi) => (
              <li key={p.src} className={pi === 0 ? "col-span-2 row-span-2" : ""}>
                <button type="button" onClick={() => setOpen({ album: ai, photo: pi })} className="group relative block aspect-[4/3] size-full overflow-hidden rounded-2xl bg-surface-alt">
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-espresso/0 transition-colors group-hover:bg-espresso/15" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <AnimatePresence>
        {open && current && (
          <motion.div role="dialog" aria-modal="true" aria-label={albums[open.album].title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex flex-col bg-espresso/95 p-4 text-brand-sand backdrop-blur md:p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm">{albums[open.album].title} · {open.photo + 1}/{albums[open.album].photos.length}</p>
              <button type="button" autoFocus onClick={() => setOpen(null)} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10">
                <X aria-hidden="true" className="size-6" /><span className="sr-only">{dict.common.close}</span>
              </button>
            </div>
            <div className="relative my-4 flex-1">
              <AnimatePresence mode="wait">
                <motion.div key={current.src} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                  <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-between gap-4">
              <button type="button" onClick={() => move(-1)} className="inline-flex size-12 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"><ChevronLeft aria-hidden="true" className="size-5" /><span className="sr-only">{dict.common.previous}</span></button>
              <p className="max-w-xl text-center text-sm text-brand-sand/80">{current.alt} · © BVMAC</p>
              <button type="button" onClick={() => move(1)} className="inline-flex size-12 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"><ChevronRight aria-hidden="true" className="size-5" /><span className="sr-only">{dict.common.next}</span></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
