import { useSyncExternalStore } from "react";

let done = false;
const listeners = new Set<() => void>();

export const loaderStore = {
  finish() {
    if (done) return;
    done = true;
    listeners.forEach((l) => l());
  },
};

// Hero intro animations and the navbar entrance wait for this.
export function usePreloaderDone() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => done,
    () => false
  );
}