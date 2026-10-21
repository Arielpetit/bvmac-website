import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { buildSearchIndex } from "@/lib/search-index";

// The search index is a separate file, built once per language. It is fetched the first time the
// search box opens, so it is not copied into the HTML of every page.
export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  return Response.json(buildSearchIndex(getDictionary(locale)));
}
