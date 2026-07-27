export const PRODUCT_OPTIONS = [
  { value: "curtains", label: "וילונות" },
  { value: "blinds", label: "תריסים" },
  { value: "upholstery", label: "ריפוד" },
  { value: "tablecloths", label: "מפות" },
  { value: "other", label: "אחר" },
] as const;

export type ProductOption = (typeof PRODUCT_OPTIONS)[number]["value"];

export interface ContactFormValues {
  name: string;
  phone: string;
  productType: string;
}

export interface ContactFormErrors {
  name?: string;
  phone?: string;
  productType?: string;
}

const ISRAELI_PHONE_RE = /^0\d{8,9}$/;

export function validateName(name: string): string | undefined {
  if (name.trim().length === 0) return "נא להזין שם";
  return undefined;
}

export function validatePhone(phone: string): string | undefined {
  const digitsOnly = phone.replace(/[\s-]/g, "");
  if (digitsOnly.length === 0) return "נא להזין מספר טלפון";
  if (!ISRAELI_PHONE_RE.test(digitsOnly)) return "מספר טלפון לא תקין";
  return undefined;
}

export function validateProductType(productType: string): string | undefined {
  if (productType.trim().length === 0) return "נא לבחור סוג מוצר";
  return undefined;
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const nameError = validateName(values.name);
  const phoneError = validatePhone(values.phone);
  const productTypeError = validateProductType(values.productType);
  if (nameError) errors.name = nameError;
  if (phoneError) errors.phone = phoneError;
  if (productTypeError) errors.productType = productTypeError;
  return errors;
}
