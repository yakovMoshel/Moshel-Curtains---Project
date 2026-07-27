"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { FrameVariant } from "@/lib/manifest.types";
import { createFrameCache, type FrameCache } from "@/components/scroll-sequence/frameCache";

const BOOTSTRAP_FRAME_COUNT = 30;
const IDLE_BATCH_SIZE = 20;

interface UseFrameLoaderOptions {
  variant: FrameVariant | null;
  framePattern: string;
  totalFrames: number;
  cacheCap: number;
}

interface RequestIdleCallbackWindow {
  requestIdleCallback?: (callback: () => void) => number;
}

function scheduleIdle(callback: () => void): void {
  const w = window as unknown as RequestIdleCallbackWindow;
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(callback);
  } else {
    setTimeout(callback, 200);
  }
}

export function useFrameLoader({
  variant,
  framePattern,
  totalFrames,
  cacheCap,
}: UseFrameLoaderOptions): {
  cacheRef: RefObject<FrameCache | null>;
  bootstrapped: boolean;
} {
  const cacheRef = useRef<FrameCache | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    if (!variant || totalFrames <= 0) return undefined;

    let cancelled = false;
    const cache = createFrameCache(variant, framePattern, cacheCap);
    cacheRef.current = cache;

    async function bootstrap(): Promise<void> {
      setBootstrapped(false);
      const bootstrapCount = Math.min(BOOTSTRAP_FRAME_COUNT, totalFrames);
      const loads = Array.from({ length: bootstrapCount }, (_, i) => cache.ensure(i + 1, "high"));

      // Cap the wait so a slow/broken frame doesn't block the hero indefinitely —
      // the canvas will just hold the nearest cached frame until the rest arrive.
      await Promise.race([
        Promise.allSettled(loads),
        new Promise<void>((resolve) => setTimeout(resolve, 3000)),
      ]);
      if (!cancelled) setBootstrapped(true);
      fillRemainingInBackground(bootstrapCount);
    }

    function fillRemainingInBackground(fromIndex: number): void {
      let next = fromIndex + 1;
      function step(): void {
        if (cancelled || next > totalFrames) return;
        const end = Math.min(next + IDLE_BATCH_SIZE - 1, totalFrames);
        for (let i = next; i <= end; i++) {
          cache.ensure(i, "low");
        }
        next = end + 1;
        scheduleIdle(step);
      }
      scheduleIdle(step);
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [variant, framePattern, totalFrames, cacheCap]);

  return { cacheRef, bootstrapped };
}
