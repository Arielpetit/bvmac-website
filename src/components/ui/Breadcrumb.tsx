import Link from "next/link";

export function Breadcrumb({ items, label }: { items: { label: string; href?: string }[]; label: string }) {
  return (
    <nav aria-label={label} className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-line-strong">/</span>}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-heading">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-heading">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
