import type { FrameVariant } from "@/lib/manifest.types";

/**
 * Expands a printf-style pattern like "frame_%05d.webp" for a given frame index.
 */
export function formatFrameFilename(framePattern: string, index: number): string {
  const match = /%0(\d+)d/.exec(framePattern);
  if (!match) {
    throw new Error(`Unsupported frame pattern: ${framePattern}`);
  }
  const width = Number(match[1]);
  const padded = String(index).padStart(width, "0");
  return framePattern.replace(/%0\d+d/, padded);
}

export function getFrameUrl(variant: FrameVariant, framePattern: string, index: number): string {
  return `${variant.basePath}/${formatFrameFilename(framePattern, index)}`;
}
