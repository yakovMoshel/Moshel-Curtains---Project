export interface CategoryContent {
  heading: string;
  tagline: string;
  copy: string;
  ctaLabel: string;
  href: string;
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  curtains: {
    heading: "וילונות",
    tagline: "יוקרה שמרחפת עם האור",
    copy: "וילונות בהתאמה אישית שמעצבים את האור והצל בבית שלכם.",
    ctaLabel: "לצפייה בוילונות",
    href: "/curtains",
  },
  blinds: {
    heading: "תריסים",
    tagline: "דיוק וצניעות בכל קו",
    copy: "פתרונות הצללה מדויקים — עץ, אלומיניום ובד, לכל חלון ובית.",
    ctaLabel: "לצפייה בתריסים",
    href: "/blinds",
  },
  upholstery: {
    heading: "ריפוד",
    tagline: "מרקם שהופך רהיט לחוויה",
    copy: "בדים ומרקמים איכותיים המעניקים לרהיטים שלכם חיים חדשים.",
    ctaLabel: "לצפייה בריפוד",
    href: "/upholstery",
  },
  tablecloths: {
    heading: "מפות",
    tagline: "הפרט האחרון שמשלים את הבית",
    copy: "מפות בד איכותיות שמשלימות כל שולחן וכל אירוע.",
    ctaLabel: "לצפייה במפות",
    href: "/tablecloths",
  },
};
