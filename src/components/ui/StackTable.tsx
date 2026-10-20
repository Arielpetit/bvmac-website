import { cn } from "@/lib/cn";

// Table on tablets and desktops; on phones each row becomes a card with the column
// names as labels, so long cells are never squeezed or cut off.
export function StackTable({
  caption,
  title,
  head,
  rows,
  minWidth = 720,
  highlight,
  firstColClassName,
  className,
  alwaysStack = false,
}: {
  caption: string;
  title?: React.ReactNode;
  head: string[];
  rows: React.ReactNode[][];
  minWidth?: number;
  // Column index (in `head`) drawn with a gold tint, e.g. the main compartment.
  highlight?: number;
  firstColClassName?: string;
  className?: string;
  // Wide registers (6+ columns) read better as cards at every size.
  alwaysStack?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface",
        className,
      )}
    >
      {title && <div className="px-5 pt-5 sm:px-6">{title}</div>}
      <ul
        className={cn(
          "mb-0 max-w-none list-none divide-y divide-line pl-0",
          !alwaysStack && "sm:hidden",
          title && "mt-4 border-t border-line",
        )}
      >
        {rows.map((r, k) => (
          <li key={k} className="mb-0 px-5 py-4">
            <p
              className={cn("mb-0 font-medium text-heading", firstColClassName)}
            >
              {r[0]}
            </p>
            <dl className="mt-2 grid gap-2 text-sm">
              {r.slice(1).map((cell, i) => (
                <div
                  key={i}
                  className={cn(
                    "grid grid-cols-1 gap-0.5 min-[420px]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] min-[420px]:gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]",
                    highlight === i + 1 &&
                      "-mx-2 rounded-lg bg-accent-soft/50 px-2 py-1",
                  )}
                >
                  <dt className="text-xs uppercase tracking-[0.08em] text-muted">
                    {head[i + 1]}
                  </dt>
                  <dd className="text-heading">{cell}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      {!alwaysStack && (
        <div
          className="relative hidden overflow-x-auto sm:block"
          data-lenis-prevent
        >
          <table className="w-full text-sm" style={{ minWidth }}>
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr className={cn("border-b border-line", title && "border-t")}>
                {head.map((h, i) => (
                  <th
                    key={h}
                    scope="col"
                    className={cn(
                      "px-5 py-3.5 text-left text-xs font-medium uppercase tracking-[0.1em] text-muted",
                      highlight === i && "bg-accent-soft/60 text-heading",
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r, k) => (
                <tr key={k}>
                  {r.map((cell, i) =>
                    i === 0 ? (
                      <th
                        key={i}
                        scope="row"
                        className={cn(
                          "px-5 py-4 text-left align-top font-medium text-heading",
                          firstColClassName,
                        )}
                      >
                        {cell}
                      </th>
                    ) : (
                      <td
                        key={i}
                        className={cn(
                          "px-5 py-4 align-top text-muted",
                          highlight === i && "bg-accent-soft/30 text-heading",
                        )}
                      >
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
