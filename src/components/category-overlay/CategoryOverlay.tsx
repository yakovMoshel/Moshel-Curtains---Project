"use client";

import Link from "next/link";
import { categoryOpacity } from "@/components/category-overlay/categoryOpacity";
import { CATEGORY_CONTENT } from "@/components/category-overlay/categoryContent";
import { useFrameStore } from "@/components/scroll-sequence/useFrameStore";
import type { CategorySection } from "@/lib/manifest.types";

interface CategoryOverlayProps {
  section: CategorySection;
}

export function CategoryOverlay({ section }: CategoryOverlayProps) {
  const opacity = useFrameStore((state) => categoryOpacity(state.currentFrameIndex, section));
  const content = CATEGORY_CONTENT[section.category];
  if (!content) return null;

  return (
    <div
      className="absolute inset-x-0 bottom-0 flex justify-start p-8 sm:p-16"
      style={{ opacity, pointerEvents: opacity > 0.5 ? "auto" : "none" }}
    >
      <div className="max-w-md space-y-4 text-stone-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
        <p className="text-sm font-medium tracking-[0.2em] text-stone-200 uppercase">
          {content.tagline}
        </p>
        <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">{content.heading}</h2>
        <p className="max-w-sm text-base text-stone-100 sm:text-lg">{content.copy}</p>
        <Link
          href={content.href}
          className="inline-block border-b border-stone-50/60 pb-1 text-sm font-medium tracking-wide transition-colors hover:border-stone-50"
        >
          {content.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
