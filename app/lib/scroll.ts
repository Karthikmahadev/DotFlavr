import { useSyncExternalStore } from "react";
import type Lenis from "lenis";

let instance: Lenis | null = null;
const listeners = new Set<() => void>();

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
  listeners.forEach((l) => l());
}

export const getLenis = () => instance;

export function useLenis() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => instance,
    () => null // server snapshot
  );
}