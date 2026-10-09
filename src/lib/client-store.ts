"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// Small external stores read with useSyncExternalStore, so values that only
// exist in the browser (localStorage, URL, media queries, clock) hydrate safely.

const noopSubscribe = () => () => {};

export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

const storageListeners = new Set<() => void>();
function subscribeStorage(callback: () => void) {
  storageListeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    storageListeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {}
  storageListeners.forEach((listener) => listener());
}

// JSON value persisted in localStorage on this device only.
export function useStoredJSON<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const raw = useSyncExternalStore(subscribeStorage, () => readStorage(key), () => null);
  const value = useMemo<T>(() => {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
    // fallback is a constant default supplied by the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const current = (() => {
        const r = readStorage(key);
        try {
          return r ? (JSON.parse(r) as T) : fallback;
        } catch {
          return fallback;
        }
      })();
      writeStorage(key, typeof next === "function" ? (next as (prev: T) => T)(current) : next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [value, set];
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useUrlParam(name: string): string {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("popstate", callback);
      return () => window.removeEventListener("popstate", callback);
    },
    () => new URLSearchParams(window.location.search).get(name) ?? "",
    () => "",
  );
}

export function setUrlParam(name: string, value: string) {
  const url = new URL(window.location.href);
  if (value) url.searchParams.set(name, value);
  else url.searchParams.delete(name);
  window.history.replaceState(null, "", url);
}

export function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}
