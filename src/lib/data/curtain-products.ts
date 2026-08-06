/**
 * PLACEHOLDER catalog data for the curtains configurator.
 * These types, colors, labels and descriptions are provisional and must be
 * replaced with real client-approved data before launch.
 */

export const curtainTypes = [
  {
    id: "classic",
    label: "וילון קלאסי",
    description: "בד נופל בקפלים רכים, מתאים לכל סגנון עיצוב.",
  },
  { id: "roller", label: "וילון גלילה", description: "פתרון נקי ומינימליסטי שנגלל כלפי מעלה." },
  { id: "roman", label: "וילון רומאי", description: "מתקפל אופקית בשכבות אחידות, מראה מהודר." },
  { id: "zebra", label: "וילון זברה", description: "שילוב פסי בד שקופים ואטומים לשליטה בתאורה." },
  { id: "sheer", label: "וילון שקוף (וואל)", description: "בד עדין ומרחף המאפשר מעבר אור רך." },
  { id: "blackout", label: "וילון בלאקאאוט", description: "חוסם אור מלא, אידיאלי לחדרי שינה." },
] as const;

export const curtainColors = [
  { id: "cream", label: "לבן שמנת", hex: "#F5F0E8" },
  { id: "sand", label: "בז' חול", hex: "#D8C7A8" },
  { id: "stone", label: "אפור אבן", hex: "#A9A9A0" },
  { id: "taupe", label: "טאופ", hex: "#8B7D6B" },
  { id: "olive", label: "ירוק זית", hex: "#6B7A4F" },
  { id: "navy", label: "כחול נייבי", hex: "#1B2A4A" },
  { id: "dustyrose", label: "פודרה אבק ורד", hex: "#D4A5A5" },
  { id: "mustard", label: "חרדל זהוב", hex: "#C9A227" },
] as const;

export type CurtainType = (typeof curtainTypes)[number];
export type CurtainColor = (typeof curtainColors)[number];
export type CurtainTypeId = CurtainType["id"];
export type CurtainColorId = CurtainColor["id"];
