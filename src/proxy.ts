import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

// Redirects any path without a locale prefix to /fr, /en or /es.
// Order: saved choice (cookie), browser language, then French.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const saved = request.cookies.get("NEXT_LOCALE")?.value;
  let locale = isLocale(saved) ? saved : undefined;
  if (!locale) {
    const header = request.headers.get("accept-language") ?? "";
    const preferred = header.split(",").map((part) => part.trim().slice(0, 2).toLowerCase());
    locale = preferred.find((code) => (locales as readonly string[]).includes(code)) as
      | (typeof locales)[number]
      | undefined;
  }
  const url = request.nextUrl.clone();
  url.pathname = `/${locale ?? defaultLocale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|brand|icon|apple-icon|favicon|robots.txt|sitemap.xml|.*\\..*).*)"],
};
