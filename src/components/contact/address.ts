/** The business's physical address, in local Israeli format. */
export const BUSINESS_ADDRESS = "מאה שערים 52, ירושלים";

/** Builds a no-API-key Google Maps embed URL for a free-text address. */
export function buildMapsEmbedUrl(address: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}
