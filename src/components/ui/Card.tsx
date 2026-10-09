import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
  as: Tag = "div",
  interactive = false,
  ...rest
}: { children: React.ReactNode; className?: string; as?: React.ElementType; interactive?: boolean } & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={cn("rounded-[var(--radius-card)] border border-line bg-surface", interactive && "card-lift", className)} {...rest}>
      {children}
    </Tag>
  );
}
