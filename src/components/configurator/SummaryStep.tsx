import { buildWhatsAppUrl, WHATSAPP_PHONE_LOCAL } from "@/components/whatsapp/whatsappLink";
import { buildWhatsAppOrderMessage } from "@/components/configurator/buildOrderMessage";
import { AiVisualizationPanel } from "@/components/configurator/ai-visualization";
import type { VisualizationSelectionSummary } from "@/components/configurator/ai-visualization";
import { curtainColors, curtainTypes } from "@/lib/data/curtain-products";
import type { ConfiguratorSelections } from "@/components/configurator/useConfiguratorState";

interface SummaryStepProps {
  selections: ConfiguratorSelections;
}

export function SummaryStep({ selections }: SummaryStepProps) {
  const type = curtainTypes.find((t) => t.id === selections.typeId);
  const color = curtainColors.find((c) => c.id === selections.colorId);

  const message = buildWhatsAppOrderMessage(selections);
  const whatsAppHref = buildWhatsAppUrl(WHATSAPP_PHONE_LOCAL, message);

  const visualizationSelection: VisualizationSelectionSummary = {
    category: "curtains",
    typeLabel: type?.label ?? "",
    colorLabel: color?.label ?? "",
  };

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
          <span className="font-medium text-curtain-espresso">
            {selections.width} ס&quot;מ (רוחב) × {selections.height} ס&quot;מ (גובה)
          </span>
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
