import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PieceOption {
  id: string;
  label: string;
}

interface PieceGridProps<T extends PieceOption> {
  pieces: readonly T[];
  selectedId: T["id"] | null;
  onSelect: (id: T["id"]) => void;
}

export function PieceGrid<T extends PieceOption>({
  pieces,
  selectedId,
  onSelect,
}: PieceGridProps<T>) {
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
    <>
      <p className="mt-10 mb-4 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
        פריט הריפוד
      </p>
      <div ref={cardsRef} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {pieces.map((piece) => {
          const isSelected = piece.id === selectedId;
          return (
            <button
              key={piece.id}
              type="button"
              onClick={() => onSelect(piece.id)}
              aria-pressed={isSelected}
              className={`curtain-weave flex items-center justify-center rounded-sm border bg-linear-to-br from-curtain-cream to-curtain-beige p-6 text-center transition-[transform,border-color] duration-300 hover:scale-[1.02] ${
                isSelected ? "border-2 border-curtain-espresso" : "border-curtain-tan"
              }`}
            >
              <span className="text-lg font-medium text-curtain-espresso">{piece.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
