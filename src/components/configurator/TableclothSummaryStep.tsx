import { buildWhatsAppUrl, WHATSAPP_PHONE_LOCAL } from "@/components/whatsapp/whatsappLink";
import { buildTableclothWhatsAppOrderMessage } from "@/components/configurator/buildTableclothOrderMessage";
import { AiVisualizationPanel } from "@/components/configurator/ai-visualization";
import type { VisualizationSelectionSummary } from "@/components/configurator/ai-visualization";
import { tableclothColors, tableclothTypes } from "@/lib/data/tablecloth-products";
import type { TableclothConfiguratorSelections } from "@/components/configurator/useTableclothConfiguratorState";

interface TableclothSummaryStepProps {
  selections: TableclothConfiguratorSelections;
}

export function TableclothSummaryStep({ selections }: TableclothSummaryStepProps) {
  const type = tableclothTypes.find((t) => t.id === selections.typeId);
  const color = tableclothColors.find((c) => c.id === selections.colorId);

  const message = buildTableclothWhatsAppOrderMessage(selections);
  const whatsAppHref = buildWhatsAppUrl(WHATSAPP_PHONE_LOCAL, message);

  const visualizationSelection: VisualizationSelectionSummary = {
    category: "tablecloths",
    typeLabel: type?.label ?? "",
    colorLabel: color?.label ?? "",
  };

  const dimensionsLabel =
    selections.shapeId === "rectangular"
      ? `${selections.length} ס"מ (אורך) × ${selections.width} ס"מ (רוחב)`
      : `קוטר ${selections.diameter} ס"מ`;

  return (
    <div>
      <p className="mb-2 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
        שלב שלישי
      </p>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight text-curtain-espresso sm:text-4xl">
        סיכום ההזמנה
      </h2>

      <div className="flex max-w-md flex-col gap-5 rounded-sm border border-curtain-tan bg-curtain-beige p-8">
        <div className="flex justify-between">
          <span className="text-sm text-curtain-taupe">סוג</span>
          <span className="font-medium text-curtain-espresso">{type?.label}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-curtain-taupe">צבע</span>
          <span className="flex items-center gap-2 font-medium text-curtain-espresso">
            {color?.label}
            {color && (
              <span
                style={{ backgroundColor: color.hex }}
                className="h-5 w-5 rounded-full border border-curtain-tan"
              />
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-curtain-taupe">מידות</span>
          <span className="font-medium text-curtain-espresso">{dimensionsLabel}</span>
        </div>
      </div>

      <AiVisualizationPanel
        selection={visualizationSelection}
        whatsAppOrderMessage={message}
        whatsAppHref={whatsAppHref}
      />
    </div>
  );
}
