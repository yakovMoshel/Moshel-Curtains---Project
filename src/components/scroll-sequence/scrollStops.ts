import type { SequenceManifest } from "@/lib/manifest.types";

/**
 * The frame indices where a scroll gesture should land: frame 1 (the resting
 * position on load — today that's the intro, previously it was Curtains
 * itself), the start of each category, and the very last frame of the
 * sequence (where control hands off to normal document scroll for
 * Gallery/About/Contact).
 *
 * `stops[0]` is treated by the controller as "where we're already resting",
 * not a destination — the first gesture travels to `stops[1]`. Frame 1 is
 * always prepended explicitly so that holds true whether or not the first
 * category itself happens to start at frame 1 (it did before the intro
 * clip existed; a duplicate is deduped here so that case still works).
 */
export function buildStops(manifest: SequenceManifest): number[] {
  const categoryStarts = manifest.categorySections.map((section) => section.contentStartFrame);
  const stops = [1, ...categoryStarts, manifest.totalFrames];
  return stops.filter((frame, i) => i === 0 || frame !== stops[i - 1]);
}

export interface StopTransition {
  nextIndex: number;
  /** False means: don't preventDefault, let the browser handle this scroll natively. */
  shouldIntercept: boolean;
}

/**
 * Given the current stop and a gesture direction, decides which stop to move
 * to next, and whether this gesture should be captured at all. At the very
 * last stop, a further forward gesture is released to native scroll (so the
 * page can continue past the pinned section into Gallery); at the first
 * stop, a further backward gesture is a captured no-op (nothing above it).
 */
export function resolveStopTransition(
  currentIndex: number,
  direction: 1 | -1,
  stopCount: number,
): StopTransition {
  const candidate = currentIndex + direction;

  if (direction > 0 && currentIndex >= stopCount - 1) {
    return { nextIndex: currentIndex, shouldIntercept: false };
  }
  if (direction < 0 && currentIndex <= 0) {
    return { nextIndex: currentIndex, shouldIntercept: true };
  }

  const clamped = Math.min(stopCount - 1, Math.max(0, candidate));
  return { nextIndex: clamped, shouldIntercept: true };
}

/** Maps a target frame to an absolute page scrollY within the pinned track's scroll range. */
export function frameToScrollY(
  targetFrame: number,
  totalFrames: number,
  trackStartY: number,
  trackEndY: number,
): number {
  const progress = totalFrames <= 1 ? 0 : (targetFrame - 1) / (totalFrames - 1);
  return trackStartY + progress * (trackEndY - trackStartY);
}
