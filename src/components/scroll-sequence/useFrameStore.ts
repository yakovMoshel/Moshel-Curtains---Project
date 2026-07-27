"use client";

import { useSyncExternalStore } from "react";
import { frameStore, type FrameStoreState } from "@/components/scroll-sequence/frameStore";

export function useFrameStore<T>(selector: (state: FrameStoreState) => T): T {
  return useSyncExternalStore(
    frameStore.subscribe,
    () => selector(frameStore.getState()),
    () => selector(frameStore.getState()),
  );
}
