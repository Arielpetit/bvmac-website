"use client";

import { nbsp } from "@/lib/format";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";

export type AccordionItem = { id: string; title: React.ReactNode; content: React.ReactNode; meta?: React.ReactNode };

// Disclosure list with animated height. Several panels can be open at once.
export function Accordion({ items, className, numbered = false, defaultOpen = [] }: { items: AccordionItem[]; className?: string; numbered?: boolean; defaultOpen?: string[] }) {
  const uid = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  return (
    <ul className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(item.id);
        return (
          <li key={item.id}>
            <h3>
              <button
                type="button"
                id={`${uid}-h-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-p-${item.id}`}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-center gap-4 py-5 text-left"
              >
                {numbered && <span className="figure w-8 shrink-0 text-sm text-accent-text">{String(i + 1).padStart(2, "0")}</span>}
                <span className="flex-1 text-[1.0625rem] font-medium text-heading transition-colors group-hover:text-link">{typeof item.title === "string" ? nbsp(item.title) : item.title}</span>
                {item.meta && <span className="hidden shrink-0 text-sm text-muted sm:block">{item.meta}</span>}
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-300", isOpen && "rotate-45 border-transparent bg-action text-action-text")}>
                  <Plus aria-hidden="true" className="size-4" strokeWidth={1.8} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${uid}-p-${item.id}`}
                  role="region"
                  aria-labelledby={`${uid}-h-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className={cn("pb-6 text-muted", numbered && "sm:pl-12")}>{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

// FAQ block with schema.org FAQPage structured data.
export function Faq({ items, title }: { items: { q: string; a: string }[]; title?: string }) {
  const { locale } = useI18n();
  title ??= { fr: "Questions fréquentes", en: "Frequently asked questions", es: "Preguntas frecuentes" }[locale];
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <section aria-label={title} className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      <div>
        <p className="eyebrow">FAQ</p>
        <h2 className="text-h2 mt-3">{title}</h2>
      </div>
      <Accordion items={items.map((f, i) => ({ id: `faq-${i}`, title: f.q, content: <p className="max-w-[68ch] leading-relaxed">{f.a}</p> }))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}
