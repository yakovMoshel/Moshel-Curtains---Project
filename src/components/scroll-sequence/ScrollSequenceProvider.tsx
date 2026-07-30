"use client";

import { useEffect, useRef, useState } from "react";
import type { VariantName } from "@/lib/manifest.types";
import { useFrameManifest } from "@/components/scroll-sequence/useFrameManifest";
import { useFrameLoader } from "@/components/scroll-sequence/useFrameLoader";
import { useScrollSequenceController } from "@/components/scroll-sequence/useScrollSequenceController";
import { ScrollSequenceCanvas } from "@/components/scroll-sequence/ScrollSequenceCanvas";
import { CategoryOverlays } from "@/components/category-overlay/CategoryOverlays";
import { IntroOverlay } from "@/components/intro-overlay/IntroOverlay";

// Sized to comfortably hold a single transition's full frame range (the
// largest jumps, e.g. Curtains->Blinds, span ~134 frames) so the whole-range
// prefetch kicked off at gesture start doesn't get evicted before it's used.
const DESKTOP_CACHE_CAP = 150;
const MOBILE_CACHE_CAP = 100;
const MOBILE_BREAKPOINT = 768;

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
  const cacheCap = variantName === "mobile" ? MOBILE_CACHE_CAP : DESKTOP_CACHE_CAP;

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
