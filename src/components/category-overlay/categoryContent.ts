export interface CategoryContent {
  heading: string;
  tagline: string;
  copy: string;
  ctaLabel: string;
  href: string;
  heroImage: string;
  detailImage: string;
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
  },
  blinds: {
    heading: "תריסים",
    tagline: "דיוק וצניעות בכל קו",
    copy: "פתרונות הצללה מדויקים — עץ, אלומיניום ובד, לכל חלון ובית.",
    ctaLabel: "לצפייה בתריסים",
    href: "/blinds",
    heroImage: "/images/stills/blinds-wide.webp",
    detailImage: "/images/stills/blinds-detail.webp",
  },
  upholstery: {
    heading: "ריפוד",
    tagline: "מרקם שהופך רהיט לחוויה",
    copy: "בדים ומרקמים איכותיים המעניקים לרהיטים שלכם חיים חדשים.",
    ctaLabel: "לצפייה בריפוד",
    href: "/upholstery",
    heroImage: "/images/stills/upholstery-wide.webp",
    detailImage: "/images/stills/upholstery-detail.webp",
  },
  tablecloths: {
    heading: "מפות",
    tagline: "הפרט האחרון שמשלים את הבית",
    copy: "מפות בד איכותיות שמשלימות כל שולחן וכל אירוע.",
    ctaLabel: "לצפייה במפות",
    href: "/tablecloths",
    heroImage: "/images/stills/tablecloths-wide.webp",
    detailImage: "/images/stills/tablecloths-detail.webp",
  },
};
