import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

interface ColorSwatchesProps<T extends ColorOption> {
  colors: readonly T[];
  selectedId: T["id"] | null;
  onSelect: (colorId: T["id"]) => void;
}

export function ColorSwatches<T extends ColorOption>({
  colors,
  selectedId,
  onSelect,
}: ColorSwatchesProps<T>) {
  const swatchesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const swatches = swatchesRef.current?.children;
    if (!swatches) return;
    gsap.fromTo(
      Array.from(swatches),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "sine.inOut", stagger: 0.04 },
    );
  }, []);

  return (
    <div ref={swatchesRef} className="flex flex-wrap gap-6">
      {colors.map((color) => {
        const isSelected = color.id === selectedId;
        return (
          <button
            key={color.id}
            type="button"
            onClick={() => onSelect(color.id)}
            aria-pressed={isSelected}
            aria-label={color.label}
            className="flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-105"
          >
            <span
              style={{ backgroundColor: color.hex }}
              className={`flex h-12 w-12 items-center justify-center rounded-full border border-curtain-tan ${
                isSelected
                  ? "ring-2 ring-curtain-espresso ring-offset-2 ring-offset-curtain-cream"
                  : ""
              }`}
            >
              {isSelected && (
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="mix-blend-difference h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10l4 4 8-8"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="text-sm text-curtain-taupe">{color.label}</span>
          </button>
        );
      })}
    </div>
  );
}
