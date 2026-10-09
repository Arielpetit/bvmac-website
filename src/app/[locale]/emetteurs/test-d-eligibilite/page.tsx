import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ContentPage } from "@/components/content/ContentPage";
import { EligibilityCheck } from "@/components/institution/EligibilityCheck";

export async function generateMetadata({ params }: PageProps<"/[locale]/emetteurs/test-d-eligibilite">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.eligibility);
}

export default async function EligibilityPage({ params }: PageProps<"/[locale]/emetteurs/test-d-eligibilite">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="issuers" title={dict.nav.items.eligibility} intro="Une première indication, en quatre questions, sur l'accès de votre entreprise au compartiment A-Premium.">
      <EligibilityCheck />
    </ContentPage>
  );
}
