"use client";

import { introOpacity } from "@/components/intro-overlay/introOpacity";
import { useFrameStore } from "@/components/scroll-sequence/useFrameStore";
import type { IntroSection } from "@/lib/manifest.types";

interface IntroOverlayProps {
  section: IntroSection;
}

const WORD_STAGGER_MS = 90;

export function IntroOverlay({ section }: IntroOverlayProps) {
  const opacity = useFrameStore((state) => introOpacity(state.currentFrameIndex, section));

  // Below this threshold the welcome text is effectively invisible — hide it from
  // screen readers so it isn't announced when it can't be seen.
  const isActive = opacity > 0.5;

  const words = section.label.split(" ");
  const subtitleDelay = words.length * WORD_STAGGER_MS;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
      style={{ opacity }}
      aria-hidden={!isActive}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 80%)",
        }}
      />

      <h2 className="relative max-w-2xl font-serif text-3xl leading-relaxed font-normal tracking-[0.04em] text-stone-50 drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-5xl">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="animate-fade-in-up inline-block"
            style={{ animationDelay: `${index * WORD_STAGGER_MS}ms` }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </h2>

      <p
        className="animate-fade-in-up relative mt-4 text-sm font-medium tracking-[0.2em] text-stone-200 uppercase"
        style={{ animationDelay: `${subtitleDelay}ms` }}
      >
        וילונות · תריסים · ריפוד · מפות
      </p>

      <div
        className="animate-scroll-indicator absolute inset-x-0 bottom-8 flex justify-center"
        aria-hidden="true"
      >
        <svg
          width="18"
          height="28"
          viewBox="0 0 18 28"
          fill="none"
          className="text-stone-100 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]"
        >
          <line x1="9" y1="0" x2="9" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M2 14L9 21L16 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
