"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/States";

// Charts load in their own chunk, after the page shell, with a skeleton placeholder.
export const TimeSeriesChart = dynamic(() => import("./TimeSeriesChart").then((m) => m.TimeSeriesChart), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="grid gap-4">
      <Skeleton className="h-10 w-72 rounded-full" />
      <Skeleton className="h-[320px] w-full rounded-[var(--radius-card)]" />
    </div>
  ),
});

export const ShareholdingChart = dynamic(() => import("@/components/institution/ShareholdingChart").then((m) => m.ShareholdingChart), {
  ssr: false,
  loading: () => <Skeleton className="mx-auto mt-6 size-64 rounded-full" />,
});

export const Simulator = dynamic(() => import("@/components/school/Simulator").then((m) => m.Simulator), {
  ssr: false,
  loading: () => <Skeleton className="h-[640px] w-full rounded-[var(--radius-panel)]" />,
});
