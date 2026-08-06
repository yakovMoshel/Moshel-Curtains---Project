import { validateDimensions } from "@/components/configurator/validation";
import type { DimensionErrors } from "@/components/configurator/validation";
import type { TableclothConfiguratorSelections } from "@/components/configurator/useTableclothConfiguratorState";

export const DIAMETER_RANGE = { min: 80, max: 200 };
export const LENGTH_RANGE = { min: 80, max: 300 };
export const WIDTH_RANGE = { min: 60, max: 160 };

export function validateTableclothDimensions(
  selections: Pick<TableclothConfiguratorSelections, "shapeId" | "diameter" | "length" | "width">,
): DimensionErrors {
  if (selections.shapeId === "round") {
    return validateDimensions({ diameter: selections.diameter }, { diameter: DIAMETER_RANGE });
  }
  if (selections.shapeId === "rectangular") {
    return validateDimensions(
      { length: selections.length, width: selections.width },
      { length: LENGTH_RANGE, width: WIDTH_RANGE },
    );
  }
  return {};
}
