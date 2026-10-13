import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { GATE_COOKIE, gateEnabled, verifyGateToken } from "@/lib/gate";

// Reachable without signing in: the sign-in page, its form target and the icon it shows.
const GATE_OPEN = ["/login", "/api/gate/login", "/api/gate/logout", "/icon.png", "/apple-icon.png", "/favicon.ico"];
// Paths that never get a locale prefix: build output, API, admin, and any file (has a dot).
const NO_LOCALE = /^\/(?:_next|api|admin|login|brand|icon|apple-icon|favicon|robots\.txt|sitemap\.xml|.*\..*)/;

// 1. Access gate (internal previews): every page, file and API route needs a valid session.
// 2. Redirects any path without a locale prefix to /fr, /en or /es.
//    Order: saved choice (cookie), browser language, then French.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (gateEnabled() && !GATE_OPEN.includes(pathname)) {
    if (pathname === "/robots.txt") return new NextResponse("User-agent: *\nDisallow: /\n", { headers: { "Content-Type": "text/plain" } });
    if (!(await verifyGateToken(request.cookies.get(GATE_COOKIE)?.value))) {
      if (request.method !== "GET" && request.method !== "HEAD") return new NextResponse("Sign-in required", { status: 401 });
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
  }

  const first = pathname.split("/")[1];
  if (NO_LOCALE.test(pathname) || isLocale(first)) return NextResponse.next();

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

// Runs on every path, so files and build output sit behind the gate too.
export const config = { matcher: ["/(.*)"] };
