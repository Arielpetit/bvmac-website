import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Notice } from "@/data/content";
import { NOTICE_TYPES } from "@/data/content";
import { formatDayMonth, formatDate } from "@/lib/format";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/paths";
import { cn } from "@/lib/cn";
import { tc } from "@/i18n/content";

const TYPE_STYLE: Record<Notice["type"], string> = {
  avis: "bg-accent-soft text-accent-text",
  communique: "bg-[#e7eef8] text-[#24508f] dark:bg-[#16243a] dark:text-[#9cc0ec]",
  decision: "bg-[#efe7f6] text-[#6a3d8f] dark:bg-[#2a1d36] dark:text-[#cfa8ef]",
  convocation: "bg-[#e6f2ee] text-[#1d6b52] dark:bg-[#12291f] dark:text-[#7fd1ae]",
  ost: "bg-surface-alt text-heading",
};

export function NoticeTypeTag({ type, locale }: { type: Notice["type"]; locale: Locale }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", TYPE_STYLE[type])}>{NOTICE_TYPES[type][locale]}</span>;
}

export function NoticeRow({ notice, locale, compact = false }: { notice: Notice; locale: Locale; compact?: boolean }) {
  const dm = formatDayMonth(notice.date, locale);
  return (
    <article id={notice.id} className="group relative flex gap-4 py-5">
      <time dateTime={notice.date} className="flex w-12 shrink-0 flex-col items-center pt-0.5 text-center">
        <span className="figure font-serif-display text-2xl leading-none text-heading">{dm.day}</span>
        <span className="mt-1 text-[11px] uppercase tracking-wider text-muted">{dm.month}</span>
      </time>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
          <NoticeTypeTag type={notice.type} locale={locale} />
          {notice.number && <span className="code">N°{notice.number}</span>}
          {!compact && notice.issuer && <span className="font-medium text-heading/75">{tc(notice.issuer, locale)}</span>}
        </div>
        <h3 className={cn("text-[0.98rem] font-medium leading-snug text-heading", compact && "line-clamp-2")}>
          <Link href={localePath(locale, `/avis-et-communiques/${notice.id}`)} className="after:absolute after:inset-0 group-hover:text-link">
            {tc(notice.title, locale)}
          </Link>
        </h3>
        {!compact && <p className="mt-1 text-xs text-muted">{formatDate(notice.date, locale)}</p>}
      </div>
      <ArrowUpRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-link" />
    </article>
  );
}
