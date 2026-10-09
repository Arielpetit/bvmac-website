import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "text" | "gold" | "outlineDark";

const styles: Record<Variant, string> = {
  primary: "bg-action text-action-text hover:bg-action-hover",
  secondary: "border border-line-strong bg-surface text-heading hover:border-heading/40",
  ghost: "text-heading hover:bg-surface-alt",
  text: "px-0! h-auto! text-link underline underline-offset-4 decoration-1 hover:decoration-2",
  gold: "bg-brand-gold text-espresso hover:bg-brand-gold-light",
  outlineDark: "border border-white/25 text-brand-ivory hover:border-white/60",
};

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.9375rem] font-medium transition-[background-color,border-color,color,transform] duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

type Common = { variant?: Variant; size?: "md" | "sm"; className?: string; children: React.ReactNode };

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
  ...rest
}: Common & { href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = cn(base, styles[variant], size === "sm" && "h-10 px-4 text-sm", className);
  if (external || href.startsWith("http")) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function Button({ variant = "primary", size = "md", className, children, ...rest }: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, styles[variant], size === "sm" && "h-10 px-4 text-sm", className)} {...rest}>
      {children}
    </button>
  );
}
