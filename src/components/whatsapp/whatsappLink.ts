/** The business's WhatsApp contact number, in local Israeli format (leading 0). */
export const WHATSAPP_PHONE_LOCAL = "0526286837";

/** Builds a wa.me link from a local Israeli phone number (e.g. "0526286837" -> "https://wa.me/972526286837"). */
export function buildWhatsAppUrl(localPhone: string, message?: string): string {
  const digitsOnly = localPhone.replace(/\D/g, "");
  const international = digitsOnly.startsWith("0") ? `972${digitsOnly.slice(1)}` : digitsOnly;
  const base = `https://wa.me/${international}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
