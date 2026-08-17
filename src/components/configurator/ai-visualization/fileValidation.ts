import type { VisualizationErrorInfo } from "@/components/configurator/ai-visualization/types";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type AcceptedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number];

export interface FileValidationResult {
  ok: boolean;
  error?: VisualizationErrorInfo;
}

interface FileLike {
  type: string;
  size: number;
}

export function validateImageFile(file: FileLike): FileValidationResult {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as AcceptedImageType)) {
    return {
      ok: false,
      error: {
        code: "invalid_file",
        message: "סוג הקובץ אינו נתמך. נא להעלות תמונה בפורמט JPG, PNG או WEBP",
      },
    };
  }

  if (file.size === 0) {
    return {
      ok: false,
      error: {
        code: "invalid_file",
        message: "הקובץ ריק או פגום. נא לבחור תמונה אחרת",
      },
    };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      error: {
        code: "too_large",
        message: "התמונה גדולה מדי. הגודל המרבי הוא 10MB",
      },
    };
  }

  return { ok: true };
}
