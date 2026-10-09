import { Info, Languages } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import type { NavGroupKey } from "@/lib/navigation";
import { crumbs } from "@/lib/page-helpers";
import { PageHeader } from "@/components/ui/PageHeader";

// Standard inner page: section tabs, header with breadcrumb, and a notice on
// English/Spanish pages whose body is still in French.
export function ContentPage({
  locale,
  dict,
  group,
  title,
  intro,
  overline,
  frenchBody = true,
  meta,
  isGroupRoot = false,
  image,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  group: NavGroupKey;
  title: string;
  intro?: string;
  overline?: string;
  frenchBody?: boolean;
  meta?: React.ReactNode;
  isGroupRoot?: boolean;
  image?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader
        title={title}
        intro={intro}
        overline={overline}
        meta={meta}
        image={image}
        group={group}
        breadcrumbLabel={dict.a11y.breadcrumb}
        breadcrumb={isGroupRoot ? crumbs(locale, dict, group) : crumbs(locale, dict, group, title)}
      />
      {frenchBody && locale !== "fr" && (
        <div className="container-site pt-8">
          <p lang={locale} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted">
            <Languages aria-hidden="true" className="size-4" strokeWidth={1.8} />
            {dict.common.french}
          </p>
        </div>
      )}
      <div lang={frenchBody ? "fr" : undefined} className="container-site py-14 md:py-20">
        {children}
        {group === "invest" && (
          <aside lang={locale} className="mt-20 flex gap-4 rounded-[var(--radius-card)] border border-line bg-surface-alt p-5 text-sm text-muted">
            <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-text" strokeWidth={1.6} />
            <p>{dict.common.disclaimer}</p>
          </aside>
        )}
      </div>
    </>
  );
}
