import type { CategorySection } from "@/lib/manifest.types";
import { fadeInOpacity, fadeOutOpacity } from "@/lib/fadeOpacity";

/** Opacity (0..1) a category's overlay should have at a given frame of the scroll sequence. */
export function categoryOpacity(frameIndex: number, section: CategorySection): number {
  return Math.min(
    fadeInOpacity(section.fadeInRange, frameIndex),
    fadeOutOpacity(section.fadeOutRange, frameIndex),
  );
}
