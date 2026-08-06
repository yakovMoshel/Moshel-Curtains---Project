import { tableclothColors, tableclothTypes } from "@/lib/data/tablecloth-products";
import type { TableclothConfiguratorSelections } from "@/components/configurator/useTableclothConfiguratorState";

export function buildTableclothWhatsAppOrderMessage(
  selections: TableclothConfiguratorSelections,
): string {
  const type = tableclothTypes.find((t) => t.id === selections.typeId);
  const color = tableclothColors.find((c) => c.id === selections.colorId);

  const typeLabel = type?.label ?? "";
  const colorLabel = color?.label ?? "";

  const dimensionsLine =
    selections.shapeId === "rectangular"
      ? `מידות: ${selections.length} ס"מ (אורך) × ${selections.width} ס"מ (רוחב)`
      : `מידות: קוטר ${selections.diameter} ס"מ`;

  return [
    "היי, אני מעוניין/ת בהזמנה:",
    `סוג: ${typeLabel}`,
    `צבע: ${colorLabel}`,
    dimensionsLine,
  ].join("\n");
}
