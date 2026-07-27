"use client";

import { CategoryOverlay } from "@/components/category-overlay/CategoryOverlay";
import type { CategorySection } from "@/lib/manifest.types";

interface CategoryOverlaysProps {
  sections: CategorySection[];
}

export function CategoryOverlays({ sections }: CategoryOverlaysProps) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))" }}
      />
      {sections.map((section) => (
        <CategoryOverlay key={section.category} section={section} />
      ))}
    </>
  );
}
