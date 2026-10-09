"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

// Image that drifts slower than the page for a sense of depth.
export function ParallaxImage({
  src,
  alt,
  className,
  strength = 60,
  priority,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);
  return (
    <div ref={ref} className={cn("overflow-hidden", className?.includes("absolute") ? "" : "relative", className)}>
      <motion.div style={{ y }} className="absolute inset-[-12%_0]">
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </motion.div>
    </div>
  );
}
