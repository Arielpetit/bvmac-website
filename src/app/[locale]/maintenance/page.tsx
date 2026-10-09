import type { Metadata } from "next";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { CONTACT } from "@/lib/navigation";

export const metadata: Metadata = { title: "Maintenance", robots: { index: false } };

// Shown during planned maintenance (the proxy can rewrite all routes here).
export default function MaintenancePage() {
  return (
    <section className="grain relative isolate flex min-h-svh items-center overflow-hidden bg-espresso pt-[72px] text-brand-sand">
      <Image src="/photos/bvmac-building.webp" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-20" />
      <div className="animate-orb absolute -left-32 top-1/4 -z-10 size-[480px] rounded-full bg-brand-gold/20 blur-3xl" aria-hidden="true" />
      <div className="container-site py-24">
        <p className="eyebrow inline-flex items-center gap-2 text-brand-gold-light!"><span className="size-1.5 animate-live rounded-full bg-brand-gold" />Maintenance programmée</p>
        <h1 className="text-display mt-6 max-w-3xl text-brand-ivory!">Nous améliorons le site de la BVMAC.</h1>
        <p className="mt-6 max-w-xl text-lg text-brand-sand/75">Le site sera de nouveau disponible très bientôt. Les séances de cotation ne sont pas affectées. Le Bulletin Officiel de la Cote reste disponible auprès des sociétés de bourse.</p>
        <p lang="en" className="mt-4 max-w-xl text-sm text-brand-sand/50">We are carrying out planned maintenance. Trading sessions are not affected.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={`mailto:${CONTACT.email}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-gold px-6 font-medium text-espresso hover:bg-brand-gold-light"><Mail aria-hidden="true" className="size-4" />{CONTACT.email}</a>
          <a href={CONTACT.phoneHref} className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 hover:border-white/50"><Phone aria-hidden="true" className="size-4" />{CONTACT.phone}</a>
        </div>
      </div>
    </section>
  );
}
