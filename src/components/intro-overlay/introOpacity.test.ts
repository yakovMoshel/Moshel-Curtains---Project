import { describe, expect, it } from "vitest";
import { introOpacity } from "@/components/intro-overlay/introOpacity";
import type { IntroSection } from "@/lib/manifest.types";

const intro: IntroSection = {
  label: "ברוכים הבאים למושל הוילונות",
  sectionStartFrame: 1,
  sectionEndFrame: 73,
  textFadeInRange: [1, 18],
  textFadeOutRange: [47, 73],
};

describe("introOpacity", () => {
  it("is invisible at the very first frame (fade-in has a real width)", () => {
    expect(introOpacity(1, intro)).toBe(0);
  });

  it("is fully visible once the fade-in completes", () => {
    expect(introOpacity(18, intro)).toBe(1);
  });

  it("is partially faded mid-way through the fade-in", () => {
    const opacity = introOpacity(9, intro);
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThan(1);
  });

  it("stays fully visible through the held middle section", () => {
    expect(introOpacity(30, intro)).toBe(1);
  });

  it("fades out to 0 by the end of the section", () => {
    expect(introOpacity(73, intro)).toBe(0);
  });

  it("is partially faded mid-way through the fade-out", () => {
    const opacity = introOpacity(60, intro);
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThan(1);
  });
});
