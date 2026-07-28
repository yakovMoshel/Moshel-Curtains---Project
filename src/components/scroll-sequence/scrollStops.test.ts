import { describe, expect, it } from "vitest";
import {
  buildStops,
  frameToScrollY,
  resolveStopTransition,
} from "@/components/scroll-sequence/scrollStops";
import type { SequenceManifest } from "@/lib/manifest.types";

// A placeholder introSection — buildStops() never reads it, only categorySections
// and totalFrames, so its exact values don't matter for these fixtures.
const placeholderIntroSection = {
  label: "intro",
  sectionStartFrame: 1,
  sectionEndFrame: 1,
  textFadeInRange: [1, 1] as [number, number],
  textFadeOutRange: [1, 1] as [number, number],
};

// Shape from before the intro clip existed: the first category (Curtains)
// itself starts at frame 1.
const manifestWithoutIntro: SequenceManifest = {
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
  introSection: placeholderIntroSection,
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

// Current shape: the intro clip occupies frames 1-73, so Curtains (the first
// category) now starts later.
const manifestWithIntro: SequenceManifest = {
  ...manifestWithoutIntro,
  totalFrames: 524,
  introSection: {
    label: "ברוכים הבאים למושל הוילונות",
    sectionStartFrame: 1,
    sectionEndFrame: 73,
    textFadeInRange: [1, 1],
    textFadeOutRange: [47, 73],
  },
  categorySections: manifestWithoutIntro.categorySections.map((section) => ({
    ...section,
    contentStartFrame: section.contentStartFrame + 73,
    contentEndFrame: section.contentEndFrame + 73,
    fadeInRange: [section.fadeInRange[0] + 73, section.fadeInRange[1] + 73],
    fadeOutRange: [section.fadeOutRange[0] + 73, section.fadeOutRange[1] + 73],
    sectionStartFrame: section.sectionStartFrame + 73,
    sectionEndFrame: section.sectionEndFrame + 73,
  })),
};

describe("buildStops", () => {
  it("dedupes frame 1 when the first category already starts there (no intro)", () => {
    expect(buildStops(manifestWithoutIntro)).toEqual([1, 135, 257, 391, 451]);
  });

  it("keeps frame 1 as its own stop when the first category starts later (with intro)", () => {
    expect(buildStops(manifestWithIntro)).toEqual([1, 74, 208, 330, 464, 524]);
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

  describe("with minIndex (one-way intro gate)", () => {
    it("captures a no-op backward gesture at minIndex instead of returning to stop 0", () => {
      expect(resolveStopTransition(1, -1, stopCount, 1)).toEqual({
        nextIndex: 1,
        shouldIntercept: true,
      });
    });

    it("still steps back normally between stops above minIndex", () => {
      expect(resolveStopTransition(2, -1, stopCount, 1)).toEqual({
        nextIndex: 1,
        shouldIntercept: true,
      });
    });

    it("leaves forward navigation unaffected by minIndex", () => {
      expect(resolveStopTransition(1, 1, stopCount, 1)).toEqual({
        nextIndex: 2,
        shouldIntercept: true,
      });
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
