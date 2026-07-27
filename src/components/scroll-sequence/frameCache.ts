import type { FrameVariant } from "@/lib/manifest.types";
import { getFrameUrl } from "@/lib/frame-url";

export interface NearestFrame {
  index: number;
  bitmap: ImageBitmap;
}

export interface FrameCache {
  get(index: number): ImageBitmap | undefined;
  nearest(index: number): NearestFrame | undefined;
  ensure(index: number, priority?: "high" | "low"): Promise<void>;
  size(): number;
}

/**
 * Distance-based LRU cache of decoded frame bitmaps.
 *
 * Holding every decoded frame in memory is not viable: ~450 frames at
 * 1280x712 RGBA would be roughly 1.6GB of decoded bitmaps, which can crash
 * mobile browsers well before the network payload is the bottleneck. Capping
 * the in-memory cache (evicting the least-recently-touched entries) keeps
 * memory bounded while the underlying HTTP cache still holds the bytes for
 * fast re-decoding.
 */
export function createFrameCache(
  variant: FrameVariant,
  framePattern: string,
  cap: number,
): FrameCache {
  const cache = new Map<number, ImageBitmap>();

  function touch(index: number, bitmap: ImageBitmap): void {
    if (cache.has(index)) {
      cache.delete(index);
    }
    cache.set(index, bitmap);
    if (cache.size > cap) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey !== undefined) {
        cache.get(oldestKey)?.close();
        cache.delete(oldestKey);
      }
    }
  }

  const inFlight = new Map<number, Promise<void>>();

  async function load(index: number, priority: "high" | "low"): Promise<void> {
    if (cache.has(index)) return;
    const existing = inFlight.get(index);
    if (existing) return existing;

    const promise = (async () => {
      try {
        const url = getFrameUrl(variant, framePattern, index);
        const res = await fetch(url, { priority } as RequestInit);
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob);
        touch(index, bitmap);
      } catch (err) {
        console.error(`Failed to load frame ${index}`, err);
      } finally {
        inFlight.delete(index);
      }
    })();

    inFlight.set(index, promise);
    return promise;
  }

  return {
    get(index) {
      const bitmap = cache.get(index);
      if (bitmap) touch(index, bitmap);
      return bitmap;
    },
    nearest(index) {
      let best: NearestFrame | undefined;
      let bestDistance = Infinity;
      for (const [cachedIndex, bitmap] of cache) {
        const distance = Math.abs(cachedIndex - index);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = { index: cachedIndex, bitmap };
        }
      }
      return best;
    },
    ensure(index, priority = "low") {
      return load(index, priority);
    },
    size() {
      return cache.size;
    },
  };
}
