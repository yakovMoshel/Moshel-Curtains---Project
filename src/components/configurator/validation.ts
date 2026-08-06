export const DEFAULT_MIN_SIZE_CM = 30;
export const DEFAULT_MAX_SIZE_CM = 500;

export function validateDimension(
  value: string,
  min: number = DEFAULT_MIN_SIZE_CM,
  max: number = DEFAULT_MAX_SIZE_CM,
): string | undefined {
  if (value.trim().length === 0) return "נא להזין מידה";

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "נא להזין מספר תקין";
  if (parsed < min || parsed > max) {
    return `המידה חייבת להיות בין ${min} ל-${max} ס"מ`;
  }

  return undefined;
}

export interface SizeErrors {
  width?: string;
  height?: string;
}

export function validateSize(width: string, height: string): SizeErrors {
  const errors: SizeErrors = {};
  const widthError = validateDimension(width);
  const heightError = validateDimension(height);
  if (widthError) errors.width = widthError;
  if (heightError) errors.height = heightError;
  return errors;
}

export type DimensionErrors = Record<string, string | undefined>;

export function validateDimensions(
  values: Record<string, string>,
  ranges: Record<string, { min: number; max: number }>,
): DimensionErrors {
  const errors: DimensionErrors = {};
  for (const [field, range] of Object.entries(ranges)) {
    const error = validateDimension(values[field] ?? "", range.min, range.max);
    if (error) errors[field] = error;
  }
  return errors;
}
