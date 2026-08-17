import { buildWhatsAppUrl, WHATSAPP_PHONE_LOCAL } from "@/components/whatsapp/whatsappLink";
import { buildUpholsteryWhatsAppOrderMessage } from "@/components/configurator/buildUpholsteryOrderMessage";
import { AiVisualizationPanel } from "@/components/configurator/ai-visualization";
import type { VisualizationSelectionSummary } from "@/components/configurator/ai-visualization";
import { furniturePieces, upholsteryColors, upholsteryTypes } from "@/lib/data/upholstery-products";
import type { UpholsteryConfiguratorSelections } from "@/components/configurator/useUpholsteryConfiguratorState";

interface UpholsterySummaryStepProps {
  selections: UpholsteryConfiguratorSelections;
}

export function UpholsterySummaryStep({ selections }: UpholsterySummaryStepProps) {
  const type = upholsteryTypes.find((t) => t.id === selections.typeId);
  const color = upholsteryColors.find((c) => c.id === selections.colorId);
  const piece = furniturePieces.find((p) => p.id === selections.furniturePieceId);

  const message = buildUpholsteryWhatsAppOrderMessage(selections);
  const whatsAppHref = buildWhatsAppUrl(WHATSAPP_PHONE_LOCAL, message);

  const visualizationSelection: VisualizationSelectionSummary = {
    category: "upholstery",
    typeLabel: type?.label ?? "",
    colorLabel: color?.label ?? "",
    extraLabel: piece?.label,
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
          <span className="text-sm text-curtain-taupe">פריט</span>
          <span className="font-medium text-curtain-espresso">{piece?.label}</span>
        </div>
      </div>

      <div className="mt-8 flex max-w-md flex-col gap-3">
        <a
          href={whatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm bg-curtain-espresso px-6 py-4 text-center text-sm font-medium text-curtain-cream transition-transform duration-300 hover:scale-[1.02]"
        >
          שלח הזמנה בוואטסאפ
        </a>
        <AiVisualizationPanel selection={visualizationSelection} whatsAppOrderMessage={message} />
      </div>
    </div>
  );
}
