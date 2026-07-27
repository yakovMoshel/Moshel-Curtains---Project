import { describe, expect, it } from "vitest";
import { categoryOpacity } from "@/components/category-overlay/categoryOpacity";
import type { CategorySection } from "@/lib/manifest.types";

const curtains: CategorySection = {
  category: "curtains",
  label: "Curtains",
  contentStartFrame: 1,
  contentEndFrame: 73,
  fadeInRange: [1, 1],
  fadeOutRange: [74, 104],
  sectionStartFrame: 1,
  sectionEndFrame: 104,
};

const tablecloths: CategorySection = {
  category: "tablecloths",
  label: "Tablecloths",
  contentStartFrame: 391,
  contentEndFrame: 451,
  fadeInRange: [360, 390],
  fadeOutRange: [451, 451],
  sectionStartFrame: 360,
  sectionEndFrame: 451,
};

const blinds: CategorySection = {
  category: "blinds",
  label: "Blinds",
  contentStartFrame: 135,
  contentEndFrame: 195,
  fadeInRange: [104, 134],
  fadeOutRange: [196, 226],
  sectionStartFrame: 104,
  sectionEndFrame: 226,
};

describe("categoryOpacity", () => {
  it("is fully visible at the very first frame when fadeInRange is zero-width", () => {
    expect(categoryOpacity(1, curtains)).toBe(1);
  });

  it("fades out to 0 by the end of its fadeOutRange", () => {
    expect(categoryOpacity(104, curtains)).toBe(0);
  });

  it("is partially faded mid-way through its fadeOutRange", () => {
    const opacity = categoryOpacity(89, curtains);
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThan(1);
  });

  it("stays fully visible at the very last frame when fadeOutRange is zero-width", () => {
    expect(categoryOpacity(451, tablecloths)).toBe(1);
  });

  it("is invisible before its fadeInRange begins", () => {
    expect(categoryOpacity(50, blinds)).toBe(0);
  });

  it("is fully visible at its content start, after fading in completes", () => {
    expect(categoryOpacity(135, blinds)).toBe(1);
  });

  it("is invisible well after its fadeOutRange ends", () => {
    expect(categoryOpacity(300, curtains)).toBe(0);
  });
});
