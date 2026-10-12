"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

type Item = { date: string; title: string; text: string };

// Vertical timeline whose gold rail fills as the reader scrolls through it.
export function ScrollTimeline({ items }: { items: Item[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative mx-auto max-w-4xl">
      <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-line md:left-1/2" />
      <motion.span aria-hidden="true" style={{ scaleY }} className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-brand-gold md:left-1/2" />
      {items.map((item, i) => {
        const right = i % 2 === 1;
        return (
          <motion.li
            key={item.date}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative grid pb-14 pl-10 last:pb-0 md:grid-cols-2 md:gap-16 md:pl-0"
          >
            <span aria-hidden="true" className="absolute left-0 top-1.5 flex size-[15px] items-center justify-center rounded-full border border-brand-gold bg-background md:left-1/2 md:-translate-x-1/2">
              <span className="size-[7px] rounded-full bg-brand-gold" />
            </span>
            <div className={right ? "md:col-start-2" : "md:text-right"}>
              <p className="font-serif-display text-3xl text-accent-text md:text-4xl">{item.date}</p>
              <h2 className="text-h3 mt-2">{item.title}</h2>
              <p className="mt-2 leading-relaxed text-muted [overflow-wrap:anywhere]">{item.text}</p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
