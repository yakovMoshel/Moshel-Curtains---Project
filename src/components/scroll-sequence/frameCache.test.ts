import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFrameCache, selectEvictionIndex } from "@/components/scroll-sequence/frameCache";
import type { FrameVariant } from "@/lib/manifest.types";

describe("selectEvictionIndex", () => {
  it("picks the cached index farthest from focus", () => {
    expect(selectEvictionIndex([10, 50, 100], 12)).toBe(100);
  });

  it("picks the only candidate when there's just one", () => {
    expect(selectEvictionIndex([42], 1)).toBe(42);
  });

  it("returns undefined for an empty cache", () => {
    expect(selectEvictionIndex([], 1)).toBeUndefined();
  });

  it("is unaffected by insertion order — only distance from focus matters", () => {
    // A frame inserted long ago but close to focus should NOT be picked over one
    // inserted recently but far away — this is the core fix over plain LRU.
    expect(selectEvictionIndex([5, 6, 500], 5)).toBe(500);
  });
});

describe("createFrameCache", () => {
  const variant: FrameVariant = { width: 1280, height: 712, basePath: "/frames/sequence" };
  const framePattern = "frame_%05d.webp";

  function makeFakeBitmap(): ImageBitmap {
    return { close: vi.fn() } as unknown as ImageBitmap;
  }

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ blob: async () => new Blob() }) as unknown as Response),
    );
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => makeFakeBitmap()),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("evicts the frame farthest from the current focus, not the oldest-inserted one", async () => {
    const cache = createFrameCache(variant, framePattern, 2);
    cache.setFocus(1);

    // Insert frames in an order where the *oldest* insertion (1) is actually the
    // one closest to focus, and the newest insertion (500) is farthest — a plain
    // LRU would evict frame 1 here, which is exactly the bug being fixed.
    await cache.ensure(1);
    await cache.ensure(2);
    await cache.ensure(500);

    expect(cache.get(1)).toBeDefined();
    expect(cache.get(2)).toBeDefined();
    expect(cache.get(500)).toBeUndefined();
  });

  it("re-evaluates eviction against an updated focus", async () => {
    const cache = createFrameCache(variant, framePattern, 2);
    cache.setFocus(1);
    await cache.ensure(1);
    await cache.ensure(2);

    // Focus moves far away; the next insertion should evict whichever of the
    // existing entries is now farthest from the new focus.
    cache.setFocus(100);
    await cache.ensure(3);

    expect(cache.get(3)).toBeDefined();
    // Frame 1 (distance 99 from focus 100) should be evicted before frame 2 (distance 98).
    expect(cache.get(1)).toBeUndefined();
    expect(cache.get(2)).toBeDefined();
  });

  it("does not re-fetch a frame that's already cached", async () => {
    const fetchSpy = vi.mocked(global.fetch);
    const cache = createFrameCache(variant, framePattern, 10);
    await cache.ensure(5);
    await cache.ensure(5);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
