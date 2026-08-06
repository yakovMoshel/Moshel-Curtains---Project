import { blindColors, blindTypes } from "@/lib/data/blind-products";
import type { BlindConfiguratorSelections } from "@/components/configurator/useBlindConfiguratorState";

export function buildBlindWhatsAppOrderMessage(selections: BlindConfiguratorSelections): string {
  const type = blindTypes.find((t) => t.id === selections.typeId);
  const color = blindColors.find((c) => c.id === selections.colorId);

  const typeLabel = type?.label ?? "";
  const colorLabel = color?.label ?? "";

  return [
    "היי, אני מעוניין/ת בהזמנה:",
    `סוג: ${typeLabel}`,
    `צבע: ${colorLabel}`,
    `מידות: ${selections.width} ס"מ (רוחב) × ${selections.height} ס"מ (גובה)`,
  ].join("\n");
}
