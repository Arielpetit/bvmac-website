"use client";

import { useSyncExternalStore } from "react";

export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => fallback,
  );
  return <>{year}</>;
}
