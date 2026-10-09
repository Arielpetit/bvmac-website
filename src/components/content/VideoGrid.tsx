"use client";

import Image from "next/image";
import { useState } from "react";
import { FileText, Play } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { CONTACT } from "@/lib/navigation";
import type { Video } from "@/data/media";
import { VideoCard } from "./VideoCard";
import { cn } from "@/lib/cn";

export function VideoGrid({ videos }: { videos: Video[] }) {
  const { locale } = useI18n();
  const [list, setList] = useState("");
  const [current, setCurrent] = useState(videos[0]);
  const playlists = [...new Set(videos.map((v) => v.playlist))];
  const shown = videos.filter((v) => !list || v.playlist === list);
  const L = { fr: ["Toutes", "Transcription (à venir)"], en: ["All", "Transcript (coming soon)"], es: ["Todas", "Transcripción (próximamente)"] }[locale];
  return (
    <div className="grid gap-10">
      <VideoCard title={current.title} caption={current.caption} channelUrl={CONTACT.social.youtube} poster={current.poster} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Playlists" className="flex flex-wrap gap-2">
          {["", ...playlists].map((p) => (
            <button key={p || "all"} type="button" aria-pressed={list === p} onClick={() => setList(p)} className={cn("h-10 rounded-full border px-4 text-sm", list === p ? "border-transparent bg-action text-action-text" : "border-line bg-surface hover:border-line-strong")}>{p || L[0]}</button>
          ))}
        </div>
        <span className="inline-flex items-center gap-2 text-sm text-muted"><FileText aria-hidden="true" className="size-4" />{L[1]}</span>
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((v) => (
          <li key={v.id}>
            <button type="button" onClick={() => { setCurrent(v); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-current={current.id === v.id} className="group w-full text-left">
              <span className="relative block aspect-video overflow-hidden rounded-2xl bg-espresso">
                <Image src={v.poster} alt="" fill sizes="(min-width:1024px) 400px, 100vw" className="object-cover opacity-75 transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-brand-ivory/90 text-espresso transition-transform group-hover:scale-110"><Play aria-hidden="true" className="size-5 translate-x-0.5 fill-current" /></span>
                </span>
              </span>
              <span className="mt-4 block text-xs uppercase tracking-[0.12em] text-muted">{v.playlist}</span>
              <span className="mt-1 block font-serif-display text-xl text-heading group-hover:text-link">{v.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
