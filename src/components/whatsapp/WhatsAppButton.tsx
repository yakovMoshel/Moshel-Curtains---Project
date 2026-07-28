import { buildWhatsAppUrl, WHATSAPP_PHONE_LOCAL } from "@/components/whatsapp/whatsappLink";

export function WhatsAppButton() {
  const href = buildWhatsAppUrl(WHATSAPP_PHONE_LOCAL, "היי, אשמח לקבל פרטים נוספים");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="פנייה בוואטסאפ"
      className="fixed right-6 bottom-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-stone-50 shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2Zm5.8 14.09c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.11.11-1.79-.11-.41-.13-.94-.31-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.28-.12.55.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.18-.28.36-.23.6-.14.24.09 1.55.73 1.81.86.26.14.44.21.5.32.07.12.07.66-.17 1.34Z" />
      </svg>
    </a>
  );
}
