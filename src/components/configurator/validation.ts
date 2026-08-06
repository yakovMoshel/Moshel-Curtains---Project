const MIN_SIZE_CM = 30;
const MAX_SIZE_CM = 500;

export function validateDimension(value: string): string | undefined {
  if (value.trim().length === 0) return "נא להזין מידה";

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "נא להזין מספר תקין";
  if (parsed < MIN_SIZE_CM || parsed > MAX_SIZE_CM) {
    return `המידה חייבת להיות בין ${MIN_SIZE_CM} ל-${MAX_SIZE_CM} ס"מ`;
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
