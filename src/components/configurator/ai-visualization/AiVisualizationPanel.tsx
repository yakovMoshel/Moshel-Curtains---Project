"use client";

import { useState } from "react";
import { PhotoUpload } from "@/components/configurator/ai-visualization/PhotoUpload";
import { VisualizationLoading } from "@/components/configurator/ai-visualization/VisualizationLoading";
import { VisualizationResult } from "@/components/configurator/ai-visualization/VisualizationResult";
import { useVisualization } from "@/components/configurator/ai-visualization/useVisualization";
import type { VisualizationSelectionSummary } from "@/components/configurator/ai-visualization/types";

interface AiVisualizationPanelProps {
  selection: VisualizationSelectionSummary;
  whatsAppOrderMessage: string;
  whatsAppHref: string;
}

export function AiVisualizationPanel({
  selection,
  whatsAppOrderMessage,
  whatsAppHref,
}: AiVisualizationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { status, originalPreviewUrl, resultImageDataUrl, error, selectFile, reset } =
    useVisualization(selection);

  const isBusy = status === "validating" || status === "uploading" || status === "processing";

  return (
    <div className="mt-8 flex max-w-md flex-col gap-3">
      {status !== "success" && (
        <a
          href={whatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm bg-curtain-espresso px-6 py-4 text-center text-sm font-medium text-curtain-cream transition-transform duration-300 hover:scale-[1.02]"
        >
          שלח הזמנה בוואטסאפ
        </a>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-sm border border-curtain-espresso px-6 py-4 text-center text-sm font-medium text-curtain-espresso transition-transform duration-300 hover:scale-[1.02]"
      >
        רוצה לראות איך זה ייראה אצלכם בבית?
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3">
          {status === "success" && resultImageDataUrl && originalPreviewUrl && (
            <VisualizationResult
              originalPreviewUrl={originalPreviewUrl}
              resultImageDataUrl={resultImageDataUrl}
              whatsAppOrderMessage={whatsAppOrderMessage}
              onReset={reset}
            />
          )}

          {isBusy && <VisualizationLoading />}

          {!isBusy && status !== "success" && (
            <PhotoUpload onFileSelected={selectFile} disabled={isBusy} />
          )}

          {status === "error" && error && (
            <p role="alert" className="text-sm text-red-700">
              {error.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
