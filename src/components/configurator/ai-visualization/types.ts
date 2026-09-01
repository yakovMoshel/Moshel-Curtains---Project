export type ProductCategory = "curtains" | "blinds" | "upholstery" | "tablecloths";

export interface VisualizationSelectionSummary {
  category: ProductCategory;
  typeLabel: string;
  colorLabel: string;
  extraLabel?: string;
}

export type VisualizationStatus =
  "idle" | "validating" | "uploading" | "processing" | "success" | "error";

export type VisualizationErrorCode =
  "invalid_file" | "too_large" | "rate_limited" | "server_error" | "network_error" | "timeout";

export interface VisualizationErrorInfo {
  message: string;
  code: VisualizationErrorCode;
}
