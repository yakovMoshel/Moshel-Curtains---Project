import { blindColors } from "@/lib/data/blind-products";
import type { BlindColorId } from "@/lib/data/blind-products";
import type { SizeErrors } from "@/components/configurator/validation";
import { ColorSwatches } from "@/components/configurator/ColorSwatches";
import { SizeFields } from "@/components/configurator/SizeFields";

interface BlindColorSizeStepProps {
  selectedColorId: BlindColorId | null;
  onSelectColor: (colorId: BlindColorId) => void;
  width: string;
  height: string;
  errors: SizeErrors;
  onWidthChange: (width: string) => void;
  onHeightChange: (height: string) => void;
}

export function BlindColorSizeStep({
  selectedColorId,
  onSelectColor,
  width,
  height,
  errors,
  onWidthChange,
  onHeightChange,
}: BlindColorSizeStepProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
        שלב שני
      </p>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight text-curtain-espresso sm:text-4xl">
        בחרו צבע ומידות
      </h2>

      <ColorSwatches colors={blindColors} selectedId={selectedColorId} onSelect={onSelectColor} />

      <SizeFields
        fields={[
          {
            name: "width",
            label: 'רוחב (ס"מ)',
            value: width,
            error: errors.width,
            onChange: onWidthChange,
          },
          {
            name: "height",
            label: 'גובה (ס"מ)',
            value: height,
            error: errors.height,
            onChange: onHeightChange,
          },
        ]}
      />
    </div>
  );
}
