import { tableclothColors, tableShapes } from "@/lib/data/tablecloth-products";
import type { TableclothColorId, TableShapeId } from "@/lib/data/tablecloth-products";
import type { DimensionErrors } from "@/components/configurator/validation";
import { ColorSwatches } from "@/components/configurator/ColorSwatches";
import { SizeFields } from "@/components/configurator/SizeFields";

interface TableclothDetailStepProps {
  selectedColorId: TableclothColorId | null;
  onSelectColor: (colorId: TableclothColorId) => void;
  selectedShapeId: TableShapeId | null;
  onSelectShape: (shapeId: TableShapeId) => void;
  diameter: string;
  length: string;
  width: string;
  errors: DimensionErrors;
  onDiameterChange: (value: string) => void;
  onLengthChange: (value: string) => void;
  onWidthChange: (value: string) => void;
}

export function TableclothDetailStep({
  selectedColorId,
  onSelectColor,
  selectedShapeId,
  onSelectShape,
  diameter,
  length,
  width,
  errors,
  onDiameterChange,
  onLengthChange,
  onWidthChange,
}: TableclothDetailStepProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
        שלב שני
      </p>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight text-curtain-espresso sm:text-4xl">
        בחרו צבע ומידות
      </h2>

      <ColorSwatches
        colors={tableclothColors}
        selectedId={selectedColorId}
        onSelect={onSelectColor}
      />

      <p className="mt-10 mb-4 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
        צורת השולחן
      </p>
      <div className="flex gap-4">
        {tableShapes.map((shape) => {
          const isSelected = shape.id === selectedShapeId;
          return (
            <button
              key={shape.id}
              type="button"
              onClick={() => onSelectShape(shape.id)}
              aria-pressed={isSelected}
              className={`rounded-sm border px-6 py-3 text-sm font-medium text-curtain-espresso transition-[transform,border-color] duration-300 hover:scale-[1.02] ${
                isSelected ? "border-2 border-curtain-espresso" : "border-curtain-tan"
              }`}
            >
              {shape.label}
            </button>
          );
        })}
      </div>

      {selectedShapeId === "round" && (
        <SizeFields
          fields={[
            {
              name: "diameter",
              label: 'קוטר (ס"מ)',
              value: diameter,
              error: errors.diameter,
              onChange: onDiameterChange,
            },
          ]}
        />
      )}

      {selectedShapeId === "rectangular" && (
        <SizeFields
          fields={[
            {
              name: "length",
              label: 'אורך (ס"מ)',
              value: length,
              error: errors.length,
              onChange: onLengthChange,
            },
            {
              name: "width",
              label: 'רוחב (ס"מ)',
              value: width,
              error: errors.width,
              onChange: onWidthChange,
            },
          ]}
        />
      )}
    </div>
  );
}
