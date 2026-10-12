import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getGlossary } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { GlossaryBrowser } from "@/components/school/GlossaryBrowser";

export async function generateMetadata({ params }: PageProps<"/[locale]/ecole-de-bourse/glossaire">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.glossary);
}

export default async function GlossaryPage({ params }: PageProps<"/[locale]/ecole-de-bourse/glossaire">) {
  const { locale, dict } = await resolveLocale(params);
  const glossary = await getGlossary();
  return (
    <ContentPage locale={locale} dict={dict} group="learn" title={dict.nav.items.glossary} intro={`${glossary.length} termes de la bourse expliqués simplement, avec leur équivalent en anglais et en espagnol.`}>
      <GlossaryBrowser terms={glossary} />
    </ContentPage>
  );
}
