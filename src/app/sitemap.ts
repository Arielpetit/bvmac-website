import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { NAV } from "@/lib/navigation";
import { EQUITIES } from "@/data/market";
import { LESSONS, PATHS } from "@/data/school";
import { NEWS, NOTICES } from "@/data/real";

const BASE = "https://www.bvmac.cm";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...new Set(NAV.flatMap((g) => g.items.map((i) => i.href.split("?")[0]))),
    ...EQUITIES.map((e) => `/marches/actions/${e.slug}`),
    ...EQUITIES.map((e) => `/emetteurs/societes-cotees/${e.slug}`),
    ...LESSONS.map((l) => `/ecole-de-bourse/lecon/${l.slug}`),
    ...PATHS.map((p) => `/ecole-de-bourse/parcours/${p.slug}`),
    ...NOTICES.map((n) => `/avis-et-communiques/${n.id}`),
    ...NEWS.map((n) => `/actualites/${n.slug}`),
    "/la-bvmac/gouvernance/message-du-pca",
    "/la-bvmac/gouvernance/message-du-dg",
    "/politique-de-cookies",
    "/contact",
    "/mentions-legales",
    "/politique-de-confidentialite",
    "/accessibilite",
    "/plan-du-site",
  ];
  return paths.map((path) => {
    const clean = path === "/" ? "" : path;
    return {
      url: `${BASE}/fr${clean}`,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${BASE}/${l}${clean}`])) },
    };
  });
}
