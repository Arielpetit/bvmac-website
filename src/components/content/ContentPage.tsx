import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { PageHeader } from "@/components/ui/PageHeader";

// Standard inner page: header (title and intro) and the page body.
export function ContentPage({
  locale,
  title,
  intro,
  overline,
  meta,
  children,
}: {
  locale: Locale;
  dict?: Dictionary;
  title: string;
  intro?: string;
  overline?: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader title={title} intro={intro} overline={overline} meta={meta} />
      <div lang={locale} className="container-site pt-10 pb-14 md:pt-12 md:pb-20">
        {children}
      </div>
    </>
  );
}
