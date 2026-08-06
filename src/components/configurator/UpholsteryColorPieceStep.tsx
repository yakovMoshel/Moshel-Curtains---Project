import { upholsteryColors, furniturePieces } from "@/lib/data/upholstery-products";
import type { FurniturePieceId, UpholsteryColorId } from "@/lib/data/upholstery-products";
import { ColorSwatches } from "@/components/configurator/ColorSwatches";
import { PieceGrid } from "@/components/configurator/PieceGrid";

interface UpholsteryColorPieceStepProps {
  selectedColorId: UpholsteryColorId | null;
  onSelectColor: (colorId: UpholsteryColorId) => void;
  selectedPieceId: FurniturePieceId | null;
  onSelectPiece: (pieceId: FurniturePieceId) => void;
}

export function UpholsteryColorPieceStep({
  selectedColorId,
  onSelectColor,
  selectedPieceId,
  onSelectPiece,
}: UpholsteryColorPieceStepProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
        שלב שני
      </p>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight text-curtain-espresso sm:text-4xl">
        בחרו צבע ופריט
      </h2>

      <ColorSwatches
        colors={upholsteryColors}
        selectedId={selectedColorId}
        onSelect={onSelectColor}
      />

      <PieceGrid pieces={furniturePieces} selectedId={selectedPieceId} onSelect={onSelectPiece} />
    </div>
  );
}
