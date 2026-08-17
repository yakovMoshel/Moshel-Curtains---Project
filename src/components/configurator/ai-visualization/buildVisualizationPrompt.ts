import type {
  ProductCategory,
  VisualizationSelectionSummary,
} from "@/components/configurator/ai-visualization/types";

const BASE_INSTRUCTION =
  "Edit this photo realistically, preserving the room's lighting, perspective, camera angle, furniture, and every other element exactly as in the original photo. Do not add watermarks or text.";

const CATEGORY_CLAUSE: Record<ProductCategory, (s: VisualizationSelectionSummary) => string> = {
  curtains: (s) =>
    `Add curtains of type '${s.typeLabel}' in color '${s.colorLabel}' hanging naturally on the visible window(s), with realistic fabric folds and shadow.`,
  blinds: (s) =>
    `Add window blinds of type '${s.typeLabel}' in color '${s.colorLabel}' fitted naturally to the visible window(s).`,
  upholstery: (s) =>
    `Reupholster the ${s.extraLabel ?? "furniture piece"} visible in the photo with fabric of type '${s.typeLabel}' in color '${s.colorLabel}', keeping its shape and position unchanged.`,
  tablecloths: (s) =>
    `Add a tablecloth of type '${s.typeLabel}' in color '${s.colorLabel}' draped naturally over the table visible in the photo.`,
};

export function buildVisualizationPrompt(selection: VisualizationSelectionSummary): string {
  return `${BASE_INSTRUCTION} ${CATEGORY_CLAUSE[selection.category](selection)}`;
}
