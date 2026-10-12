import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { locales } from "@/i18n/config";
import { I18nProvider } from "@/i18n/provider";
import { resolveLocale } from "@/lib/i18n-server";
import { buildSearchIndex } from "@/lib/search-index";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsentProvider } from "@/components/layout/ConsentProvider";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { BackToTop } from "@/components/motion/BackToTop";
import { ChatWidget } from "@/components/ai/ChatWidget";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { getAnnouncement } from "@/lib/api";

// Self-hosted at build time by next/font (no request to Google from the browser).
const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], axes: ["SOFT", "opsz"], variable: "--font-fraunces", display: "swap" });
const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return {
    metadataBase: new URL("https://www.bvmac.cm"),
    title: { default: `${dict.meta.siteName} – ${dict.meta.fullName}`, template: `%s · ${dict.meta.siteName}` },
    description: dict.meta.description,
    alternates: { canonical: `/${locale}`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
    openGraph: { siteName: dict.meta.siteName, locale, type: "website", images: ["/photos/bvmac-building.webp"] },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbf9f5",
};

// Light by default; dark only when the visitor picked it with the theme toggle.
const themeScript = `(function(){try{if(localStorage.getItem('bvmac-theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}})();`;

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale, dict } = await resolveLocale(params);
  const announcement = await getAnnouncement();
  return (
    <html lang={locale} data-theme="light" suppressHydrationWarning className={`${fraunces.variable} ${geist.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <I18nProvider locale={locale} dict={dict}>
          <ConsentProvider>
            <SmoothScroll>
              <a
                href="#contenu"
                className="sr-only z-[80] rounded-full bg-brand-gold px-5 py-3 font-medium text-espresso focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
              >
                {dict.a11y.skip}
              </a>
              <ScrollProgress />
              <NavigationProgress />
              <Header searchIndex={buildSearchIndex(dict)} />
              <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
                {children}
              </main>
              <Footer locale={locale} dict={dict} />
              <BackToTop />
              {announcement && <AnnouncementBar text={announcement.text} link={announcement.link} />}
              <ChatWidget />
              <CookieConsent />
            </SmoothScroll>
          </ConsentProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
