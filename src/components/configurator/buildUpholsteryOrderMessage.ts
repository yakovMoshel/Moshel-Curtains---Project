import { furniturePieces, upholsteryColors, upholsteryTypes } from "@/lib/data/upholstery-products";
import type { UpholsteryConfiguratorSelections } from "@/components/configurator/useUpholsteryConfiguratorState";

export function buildUpholsteryWhatsAppOrderMessage(
  selections: UpholsteryConfiguratorSelections,
): string {
  const type = upholsteryTypes.find((t) => t.id === selections.typeId);
  const color = upholsteryColors.find((c) => c.id === selections.colorId);
  const piece = furniturePieces.find((p) => p.id === selections.furniturePieceId);

  const typeLabel = type?.label ?? "";
  const colorLabel = color?.label ?? "";
  const pieceLabel = piece?.label ?? "";

  return [
    "היי, אני מעוניין/ת בהזמנה:",
    `סוג: ${typeLabel}`,
    `צבע: ${colorLabel}`,
    `פריט: ${pieceLabel}`,
  ].join("\n");
}
