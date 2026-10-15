import { pageTitle } from "@/lib/page-helpers";
import type { Metadata } from "next";
import Link from "next/link";
import { resolveLocale } from "@/lib/i18n-server";
import { localePath } from "@/lib/paths";
import { NAV } from "@/lib/navigation";
import { PageHeader } from "@/components/ui/PageHeader";

export async function generateMetadata({ params }: PageProps<"/[locale]/plan-du-site">): Promise<Metadata> {
  return pageTitle(params, (d) => d.footer.sitemap);
}

export default async function SitemapPage({ params }: PageProps<"/[locale]/plan-du-site">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <>
      <PageHeader title={dict.footer.sitemap} />
      <div className="container-site grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {NAV.map((g) => (
          <section key={g.key} aria-labelledby={`sm-${g.key}`}>
            <h2 id={`sm-${g.key}`} className="text-h3">
              <Link href={localePath(locale, g.href)} className="hover:text-link">{dict.nav[g.key]}</Link>
            </h2>
            <ul className="mt-3 grid gap-2 text-sm">
              {g.items.map((i) => (
                <li key={i.key + i.href}>
                  <Link href={localePath(locale, i.href)} className="link">{dict.nav.items[i.key]}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section aria-labelledby="sm-other">
          <h2 id="sm-other" className="text-h3">Informations</h2>
          <ul className="mt-3 grid gap-2 text-sm">
            {[["/contact", dict.nav.contact], ["/mentions-legales", dict.footer.legal], ["/politique-de-confidentialite", dict.footer.privacy], ["/accessibilite", dict.footer.accessibility]].map(([href, label]) => (
              <li key={href}><Link href={localePath(locale, href)} className="link">{label}</Link></li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
