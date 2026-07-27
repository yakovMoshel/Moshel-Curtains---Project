import { beforeEach, describe, expect, it, vi } from "vitest";
import { frameStore } from "@/components/scroll-sequence/frameStore";

describe("frameStore", () => {
  beforeEach(() => {
    frameStore.setFrameIndex(1);
  });

  it("broadcasts frame index updates to subscribers", () => {
    const listener = vi.fn();
    const unsubscribe = frameStore.subscribe(listener);

    frameStore.setFrameIndex(42);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(frameStore.getState().currentFrameIndex).toBe(42);

    unsubscribe();
  });

  it("does not notify subscribers when the frame index is unchanged", () => {
    frameStore.setFrameIndex(10);
    const listener = vi.fn();
    const unsubscribe = frameStore.subscribe(listener);

    frameStore.setFrameIndex(10);

    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });

  it("stops notifying a subscriber after it unsubscribes", () => {
    const listener = vi.fn();
    const unsubscribe = frameStore.subscribe(listener);
    unsubscribe();

    frameStore.setFrameIndex(99);

    expect(listener).not.toHaveBeenCalled();
  });
});
