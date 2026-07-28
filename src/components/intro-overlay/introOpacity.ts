import type { IntroSection } from "@/lib/manifest.types";
import { fadeInOpacity, fadeOutOpacity } from "@/lib/fadeOpacity";

/** Opacity (0..1) the intro welcome text should have at a given frame of the scroll sequence. */
export function introOpacity(frameIndex: number, section: IntroSection): number {
  return Math.min(
    fadeInOpacity(section.textFadeInRange, frameIndex),
    fadeOutOpacity(section.textFadeOutRange, frameIndex),
  );
}
