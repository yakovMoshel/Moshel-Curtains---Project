"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { FrameCache } from "@/components/scroll-sequence/frameCache";

const NEIGHBORHOOD_RADIUS = 10;

interface ScrollSequenceCanvasProps {
  frameIndexRef: RefObject<number>;
  cacheRef: RefObject<FrameCache | null>;
  width: number;
  height: number;
  totalFrames: number;
}

export function ScrollSequenceCanvas({
  frameIndexRef,
  cacheRef,
  width,
  height,
  totalFrames,
}: ScrollSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    let rafId = 0;
    let lastTarget = -1;
    let lastPaintedIndex = -1;

    function paint(bitmap: ImageBitmap, paintedIndex: number): void {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.drawImage(bitmap, 0, 0, canvas!.width, canvas!.height);
      lastPaintedIndex = paintedIndex;
    }

    function requestNeighborhood(cache: FrameCache, target: number): void {
      const clamp = (index: number) => Math.min(totalFrames, Math.max(1, index));
      cache.ensure(clamp(target), "high");
      for (let offset = 1; offset <= NEIGHBORHOOD_RADIUS; offset++) {
        const upper = target + offset;
        const lower = target - offset;
        if (upper <= totalFrames) cache.ensure(upper, "high");
        if (lower >= 1) cache.ensure(lower, "high");
      }
    }

    function draw(): void {
      const cache = cacheRef.current;
      const target = frameIndexRef.current;

      if (cache) {
        if (target !== lastTarget) {
          lastTarget = target;
          const exact = cache.get(target);
          if (exact) {
            paint(exact, target);
          } else {
            const fallback = cache.nearest(target);
            if (fallback && fallback.index !== lastPaintedIndex) {
              paint(fallback.bitmap, fallback.index);
            }
            requestNeighborhood(cache, target);
          }
        } else if (lastPaintedIndex !== target) {
          // Scroll is idle on this target — check whether the exact frame
          // has arrived since we last painted a nearest-frame stand-in.
          const exact = cache.get(target);
          if (exact) paint(exact, target);
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [width, height, cacheRef, frameIndexRef, totalFrames]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
