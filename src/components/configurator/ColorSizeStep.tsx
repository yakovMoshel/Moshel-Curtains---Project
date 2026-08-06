import { useEffect, useRef } from "react";
import gsap from "gsap";
import { curtainColors } from "@/lib/data/curtain-products";
import type { CurtainColorId } from "@/lib/data/curtain-products";
import type { SizeErrors } from "@/components/configurator/validation";

interface ColorSizeStepProps {
  selectedColorId: CurtainColorId | null;
  onSelectColor: (colorId: CurtainColorId) => void;
  width: string;
  height: string;
  errors: SizeErrors;
  onWidthChange: (width: string) => void;
  onHeightChange: (height: string) => void;
}

export function ColorSizeStep({
  selectedColorId,
  onSelectColor,
  width,
  height,
  errors,
  onWidthChange,
  onHeightChange,
}: ColorSizeStepProps) {
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
    <div>
      <p className="mb-2 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
        שלב שני
      </p>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight text-curtain-espresso sm:text-4xl">
        בחרו צבע ומידות
      </h2>

      <div ref={swatchesRef} className="flex flex-wrap gap-6">
        {curtainColors.map((color) => {
          const isSelected = color.id === selectedColorId;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelectColor(color.id)}
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

      <p className="mt-10 mb-4 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
        מידות מדויקות
      </p>
      <div className="flex max-w-md flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="width" className="text-sm font-medium text-curtain-espresso">
            רוחב (ס&quot;מ)
          </label>
          <input
            id="width"
            type="number"
            value={width}
            onChange={(e) => onWidthChange(e.target.value)}
            className="rounded-sm border border-curtain-tan bg-curtain-cream px-4 py-2 text-curtain-espresso"
          />
          {errors.width && (
            <p role="alert" className="text-sm text-red-700">
              {errors.width}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="height" className="text-sm font-medium text-curtain-espresso">
            גובה (ס&quot;מ)
          </label>
          <input
            id="height"
            type="number"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            className="rounded-sm border border-curtain-tan bg-curtain-cream px-4 py-2 text-curtain-espresso"
          />
          {errors.height && (
            <p role="alert" className="text-sm text-red-700">
              {errors.height}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
