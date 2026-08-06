import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SelectableType {
  id: string;
  label: string;
  description?: string;
}

interface TypeStepProps<T extends SelectableType> {
  items: readonly T[];
  selectedId: T["id"] | null;
  onSelect: (id: T["id"]) => void;
  stepLabel?: string;
  heading?: string;
}

export function TypeStep<T extends SelectableType>({
  items,
  selectedId,
  onSelect,
  stepLabel = "שלב ראשון",
  heading = "בחרו את הסגנון שלכם",
}: TypeStepProps<T>) {
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
        {stepLabel}
      </p>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight text-curtain-espresso sm:text-4xl">
        {heading}
      </h2>
      <div ref={cardsRef} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-pressed={isSelected}
              className={`curtain-weave flex flex-col gap-2 rounded-sm border bg-linear-to-br from-curtain-cream to-curtain-beige p-6 text-right transition-[transform,border-color] duration-300 hover:scale-[1.02] ${
                isSelected ? "border-2 border-curtain-espresso" : "border-curtain-tan"
              }`}
            >
              <span className="text-lg font-medium text-curtain-espresso">{item.label}</span>
              {item.description && (
                <span className="text-sm text-curtain-taupe">{item.description}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
