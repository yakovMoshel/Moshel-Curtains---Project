"use client";

import { introOpacity } from "@/components/intro-overlay/introOpacity";
import { useFrameStore } from "@/components/scroll-sequence/useFrameStore";
import type { IntroSection } from "@/lib/manifest.types";

interface IntroOverlayProps {
  section: IntroSection;
}

export function IntroOverlay({ section }: IntroOverlayProps) {
  const opacity = useFrameStore((state) => introOpacity(state.currentFrameIndex, section));

  // Below this threshold the welcome text is effectively invisible — hide it from
  // screen readers so it isn't announced when it can't be seen.
  const isActive = opacity > 0.5;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-8 text-center"
      style={{ opacity }}
      aria-hidden={!isActive}
    >
      <h2 className="max-w-2xl text-3xl leading-relaxed font-semibold tracking-tight text-stone-50 drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-5xl">
        {section.label}
      </h2>
    </div>
  );
}
