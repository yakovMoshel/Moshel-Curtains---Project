import { BUSINESS_ADDRESS } from "@/components/contact/address";
import { toInternationalIsraeliPhone, WHATSAPP_PHONE_LOCAL } from "@/components/whatsapp";

const SITE_URL = "https://moshelhavilonot.co.il";

/** Splits "מאה שערים 52, ירושלים" into its street/city parts for schema.org's PostalAddress. */
function splitAddress(address: string): { streetAddress: string; addressLocality: string } {
  const [streetAddress, addressLocality] = address.split(",").map((part) => part.trim());
  return { streetAddress: streetAddress ?? address, addressLocality: addressLocality ?? "" };
}

/**
 * Renders the site's LocalBusiness structured data once, site-wide (in
 * layout.tsx) — helps Google associate branded/local searches like "מושל
 * הוילונות" with this business's name, address, and phone number directly
 * in search results, independent of on-page content ranking.
 */
export function LocalBusinessJsonLd() {
  const { streetAddress, addressLocality } = splitAddress(BUSINESS_ADDRESS);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    name: "מושל הוילונות",
    url: SITE_URL,
    // Interim image (see src/app/opengraph-image.tsx) until the business's
    // own logo file is uploaded — swap this to its path at that point.
    image: `${SITE_URL}/opengraph-image`,
    telephone: `+${toInternationalIsraeliPhone(WHATSAPP_PHONE_LOCAL)}`,
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressCountry: "IL",
    },
  };

  return (
    // JSON.stringify of a locally-constructed object, not user input — safe to inject.
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
