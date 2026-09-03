"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { categoryOpacity } from "@/components/category-overlay/categoryOpacity";
import { CATEGORY_CONTENT } from "@/components/category-overlay/categoryContent";
import { frameStore } from "@/components/scroll-sequence/frameStore";
import type { CategorySection } from "@/lib/manifest.types";

// Below this threshold the section is effectively invisible — remove it from the
// accessibility tree and tab order so keyboard/screen-reader users don't land on
// "phantom" content they can't see.
const ACTIVE_THRESHOLD = 0.5;

interface CategoryOverlayProps {
  section: CategorySection;
}

export function CategoryOverlay({ section }: CategoryOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const initialActive =
    categoryOpacity(frameStore.getState().currentFrameIndex, section) > ACTIVE_THRESHOLD;
  const [isActive, setIsActive] = useState(initialActive);
  const isActiveRef = useRef(initialActive);
  const content = CATEGORY_CONTENT[section.category];

  // Opacity changes on essentially every scroll tick during a transition. Writing it
  // straight to the DOM here — instead of through React state — skips a re-render of
  // this whole subtree on every tick, which matters because it's competing for the
  // same frame budget as the canvas's own paint loop and in-flight image decoding.
  useEffect(() => {
    function applyOpacity(): void {
      const opacity = categoryOpacity(frameStore.getState().currentFrameIndex, section);
      const el = rootRef.current;
      if (el) {
        el.style.opacity = String(opacity);
        el.style.pointerEvents = opacity > ACTIVE_THRESHOLD ? "auto" : "none";
      }
      const active = opacity > ACTIVE_THRESHOLD;
      if (active !== isActiveRef.current) {
        isActiveRef.current = active;
        setIsActive(active);
      }
    }

    applyOpacity();
    return frameStore.subscribe(applyOpacity);
  }, [section]);

  if (!content) return null;

  return (
    <div
      ref={rootRef}
      className="absolute inset-x-0 bottom-0 flex justify-start p-8 sm:p-16"
      style={{
        opacity: categoryOpacity(frameStore.getState().currentFrameIndex, section),
        pointerEvents: isActive ? "auto" : "none",
      }}
      aria-hidden={!isActive}
    >
      <div className="max-w-md space-y-4 text-stone-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
        <p className="text-sm font-medium tracking-[0.2em] text-stone-200 uppercase">
          {content.tagline}
        </p>
        <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">{content.heading}</h2>
        <p className="max-w-sm text-base text-stone-100 sm:text-lg">{content.copy}</p>
        <Link
          href={content.href}
          tabIndex={isActive ? 0 : -1}
          className="inline-block border-b border-stone-50/60 pb-1 text-sm font-medium tracking-wide transition-colors hover:border-stone-50"
        >
          {content.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
