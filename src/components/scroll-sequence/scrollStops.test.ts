import { describe, expect, it } from "vitest";
import {
  buildStops,
  frameToScrollY,
  resolveStopTransition,
} from "@/components/scroll-sequence/scrollStops";
import type { SequenceManifest } from "@/lib/manifest.types";

const manifest: SequenceManifest = {
  version: 1,
  generatedAt: "2026-01-01T00:00:00.000Z",
  fps: 12,
  totalFrames: 451,
  framePattern: "frame_%05d.webp",
  variants: {
    desktop: { width: 1280, height: 712, basePath: "/frames/sequence" },
    mobile: { width: 720, height: 400, basePath: "/frames/sequence-mobile" },
  },
  segments: [],
  categorySections: [
    {
      category: "curtains",
      label: "Curtains",
      contentStartFrame: 1,
      contentEndFrame: 73,
      fadeInRange: [1, 1],
      fadeOutRange: [74, 104],
      sectionStartFrame: 1,
      sectionEndFrame: 104,
    },
    {
      category: "blinds",
      label: "Blinds",
      contentStartFrame: 135,
      contentEndFrame: 195,
      fadeInRange: [104, 134],
      fadeOutRange: [196, 226],
      sectionStartFrame: 104,
      sectionEndFrame: 226,
    },
    {
      category: "upholstery",
      label: "Upholstery",
      contentStartFrame: 257,
      contentEndFrame: 329,
      fadeInRange: [226, 256],
      fadeOutRange: [330, 360],
      sectionStartFrame: 226,
      sectionEndFrame: 360,
    },
    {
      category: "tablecloths",
      label: "Tablecloths",
      contentStartFrame: 391,
      contentEndFrame: 451,
      fadeInRange: [360, 390],
      fadeOutRange: [451, 451],
      sectionStartFrame: 360,
      sectionEndFrame: 451,
    },
  ],
};

describe("buildStops", () => {
  it("builds a stop per category start plus the final frame", () => {
    expect(buildStops(manifest)).toEqual([1, 135, 257, 391, 451]);
  });
});

describe("resolveStopTransition", () => {
  const stopCount = 5;

  it("advances to the next stop on a forward gesture", () => {
    expect(resolveStopTransition(0, 1, stopCount)).toEqual({ nextIndex: 1, shouldIntercept: true });
  });

  it("steps back to the previous stop on a backward gesture", () => {
    expect(resolveStopTransition(2, -1, stopCount)).toEqual({
      nextIndex: 1,
      shouldIntercept: true,
    });
  });

  it("releases control to native scroll on a forward gesture at the last stop", () => {
    expect(resolveStopTransition(stopCount - 1, 1, stopCount)).toEqual({
      nextIndex: stopCount - 1,
      shouldIntercept: false,
    });
  });

  it("captures a no-op backward gesture at the first stop", () => {
    expect(resolveStopTransition(0, -1, stopCount)).toEqual({
      nextIndex: 0,
      shouldIntercept: true,
    });
  });
});

describe("frameToScrollY", () => {
  it("maps the first frame to the track start", () => {
    expect(frameToScrollY(1, 451, 1000, 6412)).toBe(1000);
  });

  it("maps the last frame to the track end", () => {
    expect(frameToScrollY(451, 451, 1000, 6412)).toBe(6412);
  });

  it("maps a mid-sequence frame proportionally", () => {
    expect(frameToScrollY(226, 451, 0, 4500)).toBeCloseTo(2250, 0);
  });
});
