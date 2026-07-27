"use client";

import { useEffect, useRef, useState } from "react";
import type { VariantName } from "@/lib/manifest.types";
import { useFrameManifest } from "@/components/scroll-sequence/useFrameManifest";
import { useFrameLoader } from "@/components/scroll-sequence/useFrameLoader";
import { useScrollSequenceController } from "@/components/scroll-sequence/useScrollSequenceController";
import { ScrollSequenceCanvas } from "@/components/scroll-sequence/ScrollSequenceCanvas";

const DESKTOP_CACHE_CAP = 90;
const MOBILE_CACHE_CAP = 60;
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

  const { frameIndexRef } = useScrollSequenceController({ trackRef, totalFrames });

  return (
    <div ref={trackRef} data-testid="scroll-sequence-track" style={{ height: "100vh" }}>
      {manifest && variant ? (
        <ScrollSequenceCanvas
          frameIndexRef={frameIndexRef}
          cacheRef={cacheRef}
          width={variant.width}
          height={variant.height}
          totalFrames={totalFrames}
        />
      ) : null}
    </div>
  );
}
