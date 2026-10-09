"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { useConsent } from "@/components/layout/ConsentProvider";

// YouTube loads only after consent to third-party content (privacy-enhanced domain).
export function VideoCard({
  videoId,
  title,
  caption,
  channelUrl,
  poster = "/photos/ceremony-trading-floor.webp",
}: {
  videoId?: string;
  title: string;
  caption: string;
  channelUrl: string;
  poster?: string;
}) {
  const { dict } = useI18n();
  const { consent, save, openSettings } = useConsent();
  const allowed = consent?.thirdParty;

  return (
    <figure className="group overflow-hidden rounded-[var(--radius-panel)] bg-espresso text-brand-sand">
      <div className="relative aspect-video md:aspect-[21/9]">
        {allowed && videoId ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <>
            <Image src={poster} alt="" fill sizes="100vw" className="object-cover opacity-60 transition-transform duration-[1.4s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
              {allowed ? (
                <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 text-brand-ivory">
                  <span className="flex size-20 items-center justify-center rounded-full bg-brand-gold text-espresso transition-transform duration-500 group-hover:scale-110">
                    <Play aria-hidden="true" className="size-7 translate-x-0.5 fill-current" />
                  </span>
                  <span className="text-sm underline underline-offset-4">BVMAC TV – YouTube {dict.a11y.external}</span>
                </a>
              ) : (
                <>
                  <span className="flex size-20 items-center justify-center rounded-full border border-white/30 text-brand-ivory backdrop-blur">
                    <Play aria-hidden="true" className="size-7 translate-x-0.5" />
                  </span>
                  <p className="max-w-md text-sm text-brand-sand/85">{dict.cookie.videoBlocked}</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => save({ analytics: consent?.analytics ?? false, thirdParty: true })}
                      className="inline-flex h-10 items-center rounded-full bg-brand-gold px-5 text-sm font-medium text-espresso hover:bg-brand-gold-light"
                    >
                      {dict.cookie.videoAllow}
                    </button>
                    <button type="button" onClick={openSettings} className="text-sm text-brand-sand underline underline-offset-4">
                      {dict.cookie.customise}
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <figcaption className="flex flex-wrap items-end justify-between gap-3 p-6 md:p-8">
        <span>
          <span className="block font-serif-display text-2xl text-brand-ivory">{title}</span>
          <span className="mt-1 block text-sm text-brand-sand/70">{caption}</span>
        </span>
      </figcaption>
    </figure>
  );
}
