"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { progressToFrameIndex } from "@/components/scroll-sequence/frame-index";
import {
  buildStops,
  frameToScrollY,
  resolveStopTransition,
} from "@/components/scroll-sequence/scrollStops";
import { frameStore } from "@/components/scroll-sequence/frameStore";
import type { SequenceManifest } from "@/lib/manifest.types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/** Scroll distance (px) allotted per frame — determines the pinned track's total height. */
export const PX_PER_FRAME = 12;
const TRANSITION_DURATION = 1.8;
/** Swallows trailing trackpad/mouse momentum after a transition so it doesn't chain into another. */
const POST_TRANSITION_COOLDOWN_MS = 400;
/** Minimum touch movement (px) needed to read a reliable drag direction. */
const TOUCH_DIRECTION_THRESHOLD = 5;

interface UseScrollSequenceControllerOptions {
  trackRef: RefObject<HTMLElement | null>;
  manifest: SequenceManifest | null;
}

export function useScrollSequenceController({
  trackRef,
  manifest,
}: UseScrollSequenceControllerOptions): { frameIndexRef: RefObject<number> } {
  const frameIndexRef = useRef(1);

  useEffect(() => {
    const trackEl = trackRef.current;
    const totalFrames = manifest?.totalFrames ?? 0;
    if (!trackEl || !manifest || totalFrames <= 0) return undefined;

    const stops = buildStops(manifest);
    let currentStopIndex = 0;
    let isAnimating = false;
    let cooldownUntil = 0;

    const trigger = ScrollTrigger.create({
      trigger: trackEl,
      start: "top top",
      end: () => `+=${totalFrames * PX_PER_FRAME}`,
      pin: true,
      onUpdate: (self) => {
        const index = progressToFrameIndex(self.progress, totalFrames);
        frameIndexRef.current = index;
        frameStore.setFrameIndex(index);
      },
      onEnterBack: (self) => {
        // Re-entering the pinned range from below (scrolled back up from Gallery) —
        // snap instantly to the last stop so wheel-jacking resumes from a known frame.
        currentStopIndex = stops.length - 1;
        const targetY = frameToScrollY(stops[currentStopIndex]!, totalFrames, self.start, self.end);
        window.scrollTo(0, targetY);
      },
    });

    function goToStop(direction: 1 | -1): boolean {
      const { nextIndex, shouldIntercept } = resolveStopTransition(
        currentStopIndex,
        direction,
        stops.length,
      );
      if (!shouldIntercept) return false;
      if (nextIndex === currentStopIndex) return true;

      isAnimating = true;
      currentStopIndex = nextIndex;
      const targetFrame = stops[nextIndex]!;
      const targetY = frameToScrollY(targetFrame, totalFrames, trigger.start, trigger.end);

      gsap.to(window, {
        scrollTo: targetY,
        duration: TRANSITION_DURATION,
        ease: "sine.inOut",
        onComplete: () => {
          isAnimating = false;
          cooldownUntil = Date.now() + POST_TRANSITION_COOLDOWN_MS;
        },
      });
      return true;
    }

    function handleWheel(event: WheelEvent): void {
      if (!trigger.isActive) return;
      if (isAnimating || Date.now() < cooldownUntil) {
        event.preventDefault();
        return;
      }
      const direction: 1 | -1 = event.deltaY > 0 ? 1 : -1;
      if (goToStop(direction)) event.preventDefault();
    }

    let touchStartY = 0;
    let touchGestureConsumed = false;

    function handleTouchStart(event: TouchEvent): void {
      touchStartY = event.touches[0]?.clientY ?? 0;
      touchGestureConsumed = false;
    }

    function handleTouchMove(event: TouchEvent): void {
      if (!trigger.isActive) return;
      if (isAnimating || Date.now() < cooldownUntil || touchGestureConsumed) {
        event.preventDefault();
        return;
      }
      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - currentY;
      if (Math.abs(delta) < TOUCH_DIRECTION_THRESHOLD) return;

      const direction: 1 | -1 = delta > 0 ? 1 : -1;
      if (goToStop(direction)) {
        touchGestureConsumed = true;
        event.preventDefault();
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      trigger.kill();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [trackRef, manifest]);

  return { frameIndexRef };
}
