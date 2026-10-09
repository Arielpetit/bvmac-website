import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/data/content";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/paths";
import { cn } from "@/lib/cn";

export function NewsCard({ item, locale, large = false }: { item: NewsItem; locale: Locale; large?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col">
      <div className={cn("relative overflow-hidden rounded-[var(--radius-card)] bg-surface-alt", large ? "aspect-[16/10]" : "aspect-[4/3]")}>
        <Image src={item.image} alt="" fill sizes={large ? "(min-width:1024px) 640px, 100vw" : "(min-width:1024px) 400px, 100vw"} className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-surface/90 px-3 py-1 text-xs font-medium text-heading backdrop-blur">{item.category}</span>
      </div>
      <div className="pt-5">
        <time dateTime={item.date} className="text-sm text-muted">{formatDate(item.date, locale, "short")}</time>
        <h3 className={cn("mt-2 font-serif-display leading-tight text-heading", large ? "text-[1.75rem]" : "text-xl")}>
          <Link href={localePath(locale, `/actualites/${item.slug}`)} className="after:absolute after:inset-0 group-hover:text-link">
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{item.excerpt}</p>
      </div>
    </article>
  );
}
