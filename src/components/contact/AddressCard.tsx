import { BUSINESS_ADDRESS, buildMapsEmbedUrl } from "@/components/contact/address";

export function AddressCard() {
  return (
    <div className="curtain-weave flex flex-col gap-5 rounded-sm border border-curtain-tan bg-linear-to-br from-curtain-cream to-curtain-beige p-6 sm:p-8">
      <div>
        <p className="mb-2 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
          הכתובת שלנו
        </p>
        <p className="text-lg font-medium text-curtain-espresso">{BUSINESS_ADDRESS}</p>
      </div>

      {/* "Fabric swatch" frame — a cream mat + thin gold border, echoing the
          configurator's own swatch cards, applied here to the map instead. */}
      <div className="rounded-sm border border-curtain-gold/60 bg-curtain-cream p-2 shadow-sm">
        <div className="h-56 w-full overflow-hidden rounded-sm sm:h-72">
          <iframe
            src={buildMapsEmbedUrl(BUSINESS_ADDRESS)}
            title={`מפה — ${BUSINESS_ADDRESS}`}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
