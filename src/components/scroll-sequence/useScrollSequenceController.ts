"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { progressToFrameIndex } from "@/components/scroll-sequence/frame-index";
import { frameStore } from "@/components/scroll-sequence/frameStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Scroll distance (px) allotted per frame of the sequence. */
export const PX_PER_FRAME = 12;

interface UseScrollSequenceControllerOptions {
  trackRef: RefObject<HTMLElement | null>;
  totalFrames: number;
}

export function useScrollSequenceController({
  trackRef,
  totalFrames,
}: UseScrollSequenceControllerOptions): { frameIndexRef: RefObject<number> } {
  const frameIndexRef = useRef(1);

  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl || totalFrames <= 0) return undefined;

    const trigger = ScrollTrigger.create({
      trigger: trackEl,
      start: "top top",
      end: () => `+=${totalFrames * PX_PER_FRAME}`,
      pin: true,
      scrub: 0.35,
      onUpdate: (self) => {
        const index = progressToFrameIndex(self.progress, totalFrames);
        frameIndexRef.current = index;
        frameStore.setFrameIndex(index);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [trackRef, totalFrames]);

  return { frameIndexRef };
}
