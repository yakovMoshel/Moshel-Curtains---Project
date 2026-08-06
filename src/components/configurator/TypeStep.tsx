import { curtainTypes } from "@/lib/data/curtain-products";
import type { CurtainTypeId } from "@/lib/data/curtain-products";

interface TypeStepProps {
  selectedTypeId: CurtainTypeId | null;
  onSelect: (typeId: CurtainTypeId) => void;
}

export function TypeStep({ selectedTypeId, onSelect }: TypeStepProps) {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-stone-900">בחרו סוג וילון</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {curtainTypes.map((type) => {
          const isSelected = type.id === selectedTypeId;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelect(type.id)}
              aria-pressed={isSelected}
              className={`flex flex-col gap-2 rounded-sm border p-4 text-right transition-colors ${
                isSelected ? "border-2 border-stone-900" : "border border-stone-200"
              }`}
            >
              <span className="font-medium text-stone-900">{type.label}</span>
              <span className="text-sm text-stone-600">{type.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
