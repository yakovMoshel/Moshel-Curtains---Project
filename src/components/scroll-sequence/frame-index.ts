/**
 * Maps a GSAP ScrollTrigger progress value (0..1) to a 1-indexed frame number.
 * Extracted as a pure function so the scroll->frame mapping is unit-testable
 * without mounting GSAP or a DOM.
 */
export function progressToFrameIndex(progress: number, totalFrames: number): number {
  if (totalFrames <= 0) return 0;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const index = Math.round(clampedProgress * (totalFrames - 1)) + 1;
  return Math.min(totalFrames, Math.max(1, index));
}
