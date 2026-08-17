"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { validateImageFile } from "@/components/configurator/ai-visualization/fileValidation";
import type {
  VisualizationErrorInfo,
  VisualizationSelectionSummary,
  VisualizationStatus,
} from "@/components/configurator/ai-visualization/types";

export interface UseVisualizationResult {
  status: VisualizationStatus;
  originalPreviewUrl: string | null;
  resultImageDataUrl: string | null;
  error: VisualizationErrorInfo | null;
  selectFile: (file: File) => void;
  reset: () => void;
}

const GENERIC_ERROR: VisualizationErrorInfo = {
  code: "server_error",
  message: "אירעה שגיאה ביצירת ההדמיה. נא לנסות שוב",
};

const NETWORK_ERROR: VisualizationErrorInfo = {
  code: "network_error",
  message: "בעיית תקשורת. נא לבדוק את החיבור לאינטרנט ולנסות שוב",
};

export function useVisualization(selection: VisualizationSelectionSummary): UseVisualizationResult {
  const [status, setStatus] = useState<VisualizationStatus>("idle");
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [resultImageDataUrl, setResultImageDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<VisualizationErrorInfo | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const revokePreview = useCallback(() => {
    setOriginalPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const reset = useCallback(() => {
    revokePreview();
    setResultImageDataUrl(null);
    setError(null);
    setStatus("idle");
  }, [revokePreview]);

  const selectFile = useCallback(
    (file: File) => {
      setStatus("validating");
      setError(null);

      const validation = validateImageFile({ type: file.type, size: file.size });
      if (!validation.ok) {
        setStatus("error");
        setError(validation.error!);
        return;
      }

      revokePreview();
      const previewUrl = URL.createObjectURL(file);
      setOriginalPreviewUrl(previewUrl);
      setStatus("uploading");

      const formData = new FormData();
      formData.set("image", file);
      formData.set("category", selection.category);
      formData.set("typeLabel", selection.typeLabel);
      formData.set("colorLabel", selection.colorLabel);
      if (selection.extraLabel) formData.set("extraLabel", selection.extraLabel);

      setStatus("processing");
      fetch("/api/visualize", { method: "POST", body: formData })
        .then(async (response) => {
          if (!isMountedRef.current) return;

          if (!response.ok) {
            const body = await response.json().catch(() => null);
            setStatus("error");
            setError({
              code: response.status === 429 ? "rate_limited" : "server_error",
              message: body?.error ?? GENERIC_ERROR.message,
            });
            return;
          }

          const body = (await response.json()) as { image: string; mimeType: string };
          setResultImageDataUrl(`data:${body.mimeType};base64,${body.image}`);
          setStatus("success");
        })
        .catch(() => {
          if (!isMountedRef.current) return;
          setStatus("error");
          setError(NETWORK_ERROR);
        });
    },
    [
      revokePreview,
      selection.category,
      selection.colorLabel,
      selection.extraLabel,
      selection.typeLabel,
    ],
  );

  useEffect(() => {
    return () => {
      setOriginalPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return prev;
      });
    };
  }, []);

  return { status, originalPreviewUrl, resultImageDataUrl, error, selectFile, reset };
}
