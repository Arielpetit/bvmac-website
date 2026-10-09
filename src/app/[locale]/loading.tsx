import { Loader } from "@/components/ui/Loader";
import { Skeleton } from "@/components/ui/States";

// Shown instantly while a page streams in.
export default function Loading() {
  return (
    <div>
      <div className="border-b border-line bg-surface">
        <div className="container-site pb-14 pt-[132px]">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-8 h-12 w-[min(560px,90%)]" />
          <Skeleton className="mt-4 h-5 w-[min(420px,80%)]" />
        </div>
      </div>
      <div className="container-site flex flex-col items-center gap-10 py-20">
        <Loader />
        <div className="grid w-full gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-44 rounded-[var(--radius-card)]" />)}
        </div>
      </div>
    </div>
  );
}
