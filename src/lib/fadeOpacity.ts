function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/** 0 -> 1 as frameIndex moves through [edge0, edge1]. A zero-width range means "always fully visible". */
export function fadeInOpacity([edge0, edge1]: [number, number], frameIndex: number): number {
  if (edge1 <= edge0) return 1;
  return smoothstep(clamp01((frameIndex - edge0) / (edge1 - edge0)));
}

/** 1 -> 0 as frameIndex moves through [edge0, edge1]. A zero-width range means "never fades out". */
export function fadeOutOpacity([edge0, edge1]: [number, number], frameIndex: number): number {
  if (edge1 <= edge0) return 1;
  return 1 - smoothstep(clamp01((frameIndex - edge0) / (edge1 - edge0)));
}
