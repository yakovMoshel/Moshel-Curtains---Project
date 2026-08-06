/**
 * PLACEHOLDER catalog data for the tablecloths configurator.
 * These types, colors, shapes, labels and descriptions are provisional and
 * must be replaced with real client-approved data before launch.
 */

export const tableclothTypes = [
  { id: "pure-linen", label: "פשתן טהור", description: "מרקם טבעי ומאוורר, מראה יוקרתי." },
  { id: "cotton-linen", label: "כותנה-פשתן (50/50)", description: "שילוב איזון בין רכות לעמידות." },
  { id: "faux-linen", label: "דמוי פשתן", description: "מראה פשתן קלאסי בתחזוקה קלה." },
  { id: "satin", label: "סאטן", description: "ברק עדין המתאים לאירועים חגיגיים." },
  { id: "jacquard", label: "ג'אקארד", description: "דוגמאות ארוגות ברקע הבד עצמו." },
] as const;

export const tableclothColors = [
  { id: "cream", label: "שמנת קלאסי", hex: "#F5F0E8" },
  { id: "gold", label: "בז' זהב", hex: "#C9A227" },
  { id: "gray-gold", label: "אפור עם זהב", hex: "#A9A9A0" },
] as const;

export const tableShapes = [
  { id: "round", label: "עגול" },
  { id: "rectangular", label: "מלבני/מרובע" },
] as const;

export type TableclothType = (typeof tableclothTypes)[number];
export type TableclothColor = (typeof tableclothColors)[number];
export type TableShape = (typeof tableShapes)[number];
export type TableclothTypeId = TableclothType["id"];
export type TableclothColorId = TableclothColor["id"];
export type TableShapeId = TableShape["id"];
