export interface CategoryContent {
  heading: string;
  tagline: string;
  copy: string;
  ctaLabel: string;
  href: string;
  heroImage: string;
  detailImage: string;
  /** PLACEHOLDER copy pending client confirmation — 2–3 short, specific differentiators. */
  highlights: string[];
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  curtains: {
    heading: "וילונות",
    tagline: "יוקרה שמרחפת עם האור",
    copy: "וילונות בהתאמה אישית שמעצבים את האור והצל בבית שלכם.",
    ctaLabel: "לצפייה בוילונות",
    href: "/curtains",
    heroImage: "/images/stills/curtains-wide.webp",
    detailImage: "/images/stills/curtains-detail.webp",
    highlights: ["תפירה לפי מידות מדויקות שלכם", "מגוון בדים ודוגמאות", "ייעוץ אישי בבית שלכם"],
  },
  blinds: {
    heading: "תריסים",
    tagline: "דיוק וצניעות בכל קו",
    copy: "פתרונות הצללה מדויקים — עץ, אלומיניום ובד, לכל חלון ובית.",
    ctaLabel: "לצפייה בתריסים",
    href: "/blinds",
    heroImage: "/images/stills/blinds-wide.webp",
    detailImage: "/images/stills/blinds-detail.webp",
    highlights: ["התאמה מדויקת לכל חלון", "עץ, אלומיניום ובד", "התקנה מקצועית עד הבית"],
  },
  upholstery: {
    heading: "ריפוד",
    tagline: "מרקם שהופך רהיט לחוויה",
    copy: "בדים ומרקמים איכותיים המעניקים לרהיטים שלכם חיים חדשים.",
    ctaLabel: "לצפייה בריפוד",
    href: "/upholstery",
    heroImage: "/images/stills/upholstery-wide.webp",
    detailImage: "/images/stills/upholstery-detail.webp",
    highlights: ["ריפוד מחדש לרהיטים קיימים", "מבחר בדים עמידים", "עבודת יד מוקפדת"],
  },
  tablecloths: {
    heading: "מפות",
    tagline: "הפרט האחרון שמשלים את הבית",
    copy: "מפות בד איכותיות שמשלימות כל שולחן וכל אירוע.",
    ctaLabel: "לצפייה במפות",
    href: "/tablecloths",
    heroImage: "/images/stills/tablecloths-wide.webp",
    detailImage: "/images/stills/tablecloths-detail.webp",
    highlights: [
      "מידות מותאמות לכל שולחן",
      "בדים איכותיים וקלים לתחזוקה",
      "עיצוב לכל אירוע ולכל יום",
    ],
  },
};
