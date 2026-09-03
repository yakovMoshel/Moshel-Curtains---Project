"use client";

import { useEffect, useRef, useState } from "react";
import type { VariantName } from "@/lib/manifest.types";
import { useFrameManifest } from "@/components/scroll-sequence/useFrameManifest";
import { useFrameLoader } from "@/components/scroll-sequence/useFrameLoader";
import { useScrollSequenceController } from "@/components/scroll-sequence/useScrollSequenceController";
import { ScrollSequenceCanvas } from "@/components/scroll-sequence/ScrollSequenceCanvas";
import { CategoryOverlays } from "@/components/category-overlay/CategoryOverlays";
import { IntroOverlay } from "@/components/intro-overlay/IntroOverlay";
import { buildStops } from "@/components/scroll-sequence/scrollStops";
import type { SequenceManifest } from "@/lib/manifest.types";

// Extra headroom (in frames) above the largest single stop-to-stop distance,
// so a direction change mid-transition (or the adjacent-stop predictive
// prefetch in useScrollSequenceController holding both neighbors at once)
// doesn't evict frames the in-flight transition still needs. Smaller on
// mobile, where decoded bitmaps use proportionally more of a tighter
// memory budget.
const DESKTOP_CACHE_CAP_MARGIN = 40;
const MOBILE_CACHE_CAP_MARGIN = 20;
const FALLBACK_DESKTOP_CACHE_CAP = 150;
const FALLBACK_MOBILE_CACHE_CAP = 100;
const MOBILE_BREAKPOINT = 768;

/** Largest gap (in frames) between any two consecutive stops in the sequence. */
function maxStopDistance(manifest: SequenceManifest): number {
  const stops = buildStops(manifest);
  let max = 0;
  for (let i = 1; i < stops.length; i++) {
    max = Math.max(max, stops[i]! - stops[i - 1]!);
  }
  return max;
}

export function ScrollSequenceProvider() {
  const manifest = useFrameManifest();
  const trackRef = useRef<HTMLDivElement>(null);
  const [variantName, setVariantName] = useState<VariantName>("desktop");

  useEffect(() => {
    function updateVariant(): void {
      setVariantName(window.innerWidth < MOBILE_BREAKPOINT ? "mobile" : "desktop");
    }
    updateVariant();
    window.addEventListener("resize", updateVariant);
    return () => window.removeEventListener("resize", updateVariant);
  }, []);

  const totalFrames = manifest?.totalFrames ?? 0;
  const variant = manifest?.variants[variantName] ?? null;
  // The predictive prefetch in useScrollSequenceController can hold both the
  // previous and next stop's ranges around the current one at once (up to
  // ~2x the largest single stop-to-stop distance), on top of whichever range
  // is actively in flight during a transition — size the cap for that.
  const isMobile = variantName === "mobile";
  const cacheCap = manifest
    ? maxStopDistance(manifest) * 2 +
      (isMobile ? MOBILE_CACHE_CAP_MARGIN : DESKTOP_CACHE_CAP_MARGIN)
    : isMobile
      ? FALLBACK_MOBILE_CACHE_CAP
      : FALLBACK_DESKTOP_CACHE_CAP;

  const { cacheRef } = useFrameLoader({
    variant,
    framePattern: manifest?.framePattern ?? "",
    totalFrames,
    cacheCap,
  });

  const { frameIndexRef } = useScrollSequenceController({ trackRef, manifest, cacheRef });

  return (
    <div ref={trackRef} data-testid="scroll-sequence-track" className="scroll-sequence-track">
      {manifest && variant ? (
        <>
          <ScrollSequenceCanvas
            frameIndexRef={frameIndexRef}
            cacheRef={cacheRef}
            width={variant.width}
            height={variant.height}
            totalFrames={totalFrames}
          />
          <IntroOverlay section={manifest.introSection} />
          <CategoryOverlays sections={manifest.categorySections} />
        </>
      ) : null}
    </div>
  );
}
