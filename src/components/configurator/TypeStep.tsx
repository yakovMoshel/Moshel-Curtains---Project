import { useEffect, useRef } from "react";
import gsap from "gsap";
import { curtainTypes } from "@/lib/data/curtain-products";
import type { CurtainTypeId } from "@/lib/data/curtain-products";

interface TypeStepProps {
  selectedTypeId: CurtainTypeId | null;
  onSelect: (typeId: CurtainTypeId) => void;
}

export function TypeStep({ selectedTypeId, onSelect }: TypeStepProps) {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.children;
    if (!cards) return;
    gsap.fromTo(
      Array.from(cards),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "sine.inOut", stagger: 0.05 },
    );
  }, []);

  return (
    <div>
      <p className="mb-2 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
        שלב ראשון
      </p>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight text-curtain-espresso sm:text-4xl">
        בחרו את הסגנון שלכם
      </h2>
      <div ref={cardsRef} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {curtainTypes.map((type) => {
          const isSelected = type.id === selectedTypeId;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelect(type.id)}
              aria-pressed={isSelected}
              className={`curtain-weave flex flex-col gap-2 rounded-sm border bg-linear-to-br from-curtain-cream to-curtain-beige p-6 text-right transition-[transform,border-color] duration-300 hover:scale-[1.02] ${
                isSelected ? "border-2 border-curtain-espresso" : "border-curtain-tan"
              }`}
            >
              <span className="text-lg font-medium text-curtain-espresso">{type.label}</span>
              <span className="text-sm text-curtain-taupe">{type.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
