import { curtainColors, curtainTypes } from "@/lib/data/curtain-products";
import type { ConfiguratorSelections } from "@/components/configurator/useConfiguratorState";

export function buildWhatsAppOrderMessage(selections: ConfiguratorSelections): string {
  const type = curtainTypes.find((t) => t.id === selections.typeId);
  const color = curtainColors.find((c) => c.id === selections.colorId);

  const typeLabel = type?.label ?? "";
  const colorLabel = color?.label ?? "";

  return [
    "היי, אני מעוניין/ת בהזמנה:",
    `סוג: ${typeLabel}`,
    `צבע: ${colorLabel}`,
    `מידות: ${selections.width} ס"מ (רוחב) × ${selections.height} ס"מ (גובה)`,
  ].join("\n");
}
