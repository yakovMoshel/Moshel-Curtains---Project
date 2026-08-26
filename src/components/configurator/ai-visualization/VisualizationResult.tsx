"use client";

import { useState } from "react";
import { buildWhatsAppUrl, WHATSAPP_PHONE_LOCAL } from "@/components/whatsapp/whatsappLink";
import { ImageLightbox } from "@/components/configurator/ai-visualization/ImageLightbox";

const ATTACH_INSTRUCTION = "📎 מצרף/ת תמונת הדמיה של הבחירה שלי בבית - נא לצרף אותה להודעה";

interface VisualizationResultProps {
  originalPreviewUrl: string;
  resultImageDataUrl: string;
  whatsAppOrderMessage: string;
  onReset: () => void;
}

export function VisualizationResult({
  originalPreviewUrl,
  resultImageDataUrl,
  whatsAppOrderMessage,
  onReset,
}: VisualizationResultProps) {
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);

  const messageWithAttachInstruction = `${whatsAppOrderMessage}\n\n${ATTACH_INSTRUCTION}`;
  const whatsAppHref = buildWhatsAppUrl(WHATSAPP_PHONE_LOCAL, messageWithAttachInstruction);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <figure className="flex flex-col gap-2">
          <figcaption className="text-xs font-medium text-curtain-taupe">לפני</figcaption>
          <button
            type="button"
            onClick={() =>
              setExpandedImage({ src: originalPreviewUrl, alt: "התמונה המקורית שהועלתה" })
            }
            className="cursor-zoom-in"
          >
            <img
              src={originalPreviewUrl}
              alt="התמונה המקורית שהועלתה"
              className="aspect-square w-full rounded-sm border border-curtain-tan object-cover"
            />
          </button>
        </figure>
        <figure className="flex flex-col gap-2">
          <figcaption className="text-xs font-medium text-curtain-taupe">אחרי</figcaption>
          <button
            type="button"
            onClick={() =>
              setExpandedImage({ src: resultImageDataUrl, alt: "הדמיית ה-AI עם הבחירה שלך" })
            }
            className="cursor-zoom-in"
          >
            <img
              src={resultImageDataUrl}
              alt="הדמיית ה-AI עם הבחירה שלך"
              className="aspect-square w-full rounded-sm border border-curtain-tan object-cover"
            />
          </button>
        </figure>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={resultImageDataUrl}
          download="moshel-visualization.png"
          className="rounded-sm border border-curtain-espresso px-6 py-4 text-center text-sm font-medium text-curtain-espresso transition-transform duration-300 hover:scale-[1.02]"
        >
          הורד תמונה
        </a>
        <p className="text-center text-xs text-curtain-taupe">
          כדאי לשמור את התמונה ולשתף עם מי שרלוונטי
        </p>

        <a
          href={whatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm bg-curtain-espresso px-6 py-4 text-center text-sm font-medium text-curtain-cream transition-transform duration-300 hover:scale-[1.02]"
        >
          שלח הזמנה בוואטסאפ
        </a>
        <p className="text-center text-xs text-curtain-taupe">
          אם לא הצלחתם לצרף את התמונה, אפשר לשלוח אותה ידנית
        </p>

        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-curtain-taupe underline"
        >
          נסו תמונה אחרת
        </button>
      </div>

      <ImageLightbox
        src={expandedImage?.src ?? null}
        alt={expandedImage?.alt ?? ""}
        onClose={() => setExpandedImage(null)}
      />
    </div>
  );
}
