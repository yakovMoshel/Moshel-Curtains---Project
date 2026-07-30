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
  /** Tells the cache which frame the user is currently at/heading to, so eviction protects it. */
  setFocus(index: number): void;
  size(): number;
}

/**
 * Picks which cached index to evict when the cache is over capacity: whichever
 * is farthest (by frame distance) from `focus`. Extracted as a pure function so
 * the eviction policy is unit-testable without mocking fetch/ImageBitmap.
 */
export function selectEvictionIndex(
  cachedIndices: Iterable<number>,
  focus: number,
): number | undefined {
  let farthest: number | undefined;
  let farthestDistance = -1;
  for (const index of cachedIndices) {
    const distance = Math.abs(index - focus);
    if (distance > farthestDistance) {
      farthestDistance = distance;
      farthest = index;
    }
  }
  return farthest;
}

/**
 * Distance-based cache of decoded frame bitmaps, capped at a fixed size.
 *
 * Holding every decoded frame in memory is not viable (hundreds of frames at
 * 1280x712 RGBA would be gigabytes), so eviction must free space when full.
 * Critically, eviction is based on distance from the current focus frame, not
 * recency of access — a background loader sweeping sequentially through the
 * whole sequence must not be able to evict frames near where the user
 * actually is just because they happen to have been fetched "long ago".
 */
export function createFrameCache(
  variant: FrameVariant,
  framePattern: string,
  cap: number,
): FrameCache {
  const cache = new Map<number, ImageBitmap>();
  let focus = 1;

  function insert(index: number, bitmap: ImageBitmap): void {
    cache.set(index, bitmap);
    if (cache.size > cap) {
      const evictIndex = selectEvictionIndex(cache.keys(), focus);
      if (evictIndex !== undefined) {
        cache.get(evictIndex)?.close();
        cache.delete(evictIndex);
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
        insert(index, bitmap);
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
      return cache.get(index);
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
    setFocus(index) {
      focus = index;
    },
    size() {
      return cache.size;
    },
  };
}
