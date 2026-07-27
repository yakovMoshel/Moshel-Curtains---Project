import { describe, expect, it } from "vitest";
import { progressToFrameIndex } from "@/components/scroll-sequence/frame-index";

describe("progressToFrameIndex", () => {
  it("maps progress 0 to the first frame", () => {
    expect(progressToFrameIndex(0, 451)).toBe(1);
  });

  it("maps progress 1 to the last frame", () => {
    expect(progressToFrameIndex(1, 451)).toBe(451);
  });

  it("maps mid-scroll progress to a proportional frame", () => {
    expect(progressToFrameIndex(0.5, 451)).toBe(226);
  });

  it("clamps out-of-range progress values", () => {
    expect(progressToFrameIndex(-0.5, 451)).toBe(1);
    expect(progressToFrameIndex(1.5, 451)).toBe(451);
  });

  it("returns 0 when there are no frames", () => {
    expect(progressToFrameIndex(0.5, 0)).toBe(0);
  });
});
