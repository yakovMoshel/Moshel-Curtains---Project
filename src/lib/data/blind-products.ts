/**
 * PLACEHOLDER catalog data for the blinds configurator.
 * These types, colors, labels and descriptions are provisional and must be
 * replaced with real client-approved data before launch.
 */

export const blindTypes = [
  {
    id: "roller-electric",
    label: "תריס גלילה חשמלי",
    description: "פתיחה וסגירה בלחיצת כפתור, נוחות מרבית.",
  },
  { id: "roller-manual", label: "תריס גלילה ידני", description: "פתרון קלאסי ואמין בהפעלה ידנית." },
  {
    id: "venetian-wood",
    label: "תריס רפפה/ונציאני (עץ)",
    description: "רפפות עץ המאפשרות שליטה מדויקת באור.",
  },
  {
    id: "aluminum-extruded",
    label: "תריס אלומיניום משוך",
    description: "עמיד וקל, מתאים לשימוש יומיומי אינטנסיבי.",
  },
  { id: "aluminum-foam", label: "תריס אלומיניום מוקצף", description: "בידוד תרמי ואקוסטי משופר." },
  { id: "sliding", label: "תריס הזזה", description: "פתרון נקי לפתחים רחבים." },
  { id: "security", label: "תריס ביטחון", description: "הגנה מוגברת לצד הצללה יעילה." },
] as const;

export const blindColors = [
  { id: "white", label: "לבן", hex: "#F5F5F0" },
  { id: "basalt", label: "אפור בזלת", hex: "#5C5F61" },
  { id: "anthracite", label: "אנתרציט", hex: "#2B2B2B" },
  { id: "walnut", label: "חום אגוז", hex: "#5A3E2B" },
  { id: "sand", label: "בז' חול", hex: "#D8C7A8" },
  { id: "cream", label: "שמנת", hex: "#F5F0E8" },
] as const;

export type BlindType = (typeof blindTypes)[number];
export type BlindColor = (typeof blindColors)[number];
export type BlindTypeId = BlindType["id"];
export type BlindColorId = BlindColor["id"];
