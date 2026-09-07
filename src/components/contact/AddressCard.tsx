import { BUSINESS_ADDRESS, buildMapsEmbedUrl } from "@/components/contact/address";

export function AddressCard() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight text-stone-900">הכתובת שלנו</h2>
      <p className="text-lg text-stone-700">{BUSINESS_ADDRESS}</p>
      <div className="h-64 w-full overflow-hidden rounded-sm sm:h-80">
        <iframe
          src={buildMapsEmbedUrl(BUSINESS_ADDRESS)}
          title={`מפה — ${BUSINESS_ADDRESS}`}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
