/**
 * PLACEHOLDER catalog data for the upholstery configurator.
 * These types, colors, pieces, labels and descriptions are provisional and
 * must be replaced with real client-approved data before launch.
 */

export const upholsteryTypes = [
  { id: "velvet", label: "קטיפה", description: "מרקם רך ועשיר עם ברק עדין." },
  { id: "boucle", label: "בוקלה", description: "מרקם גרגירי חמים ונעים למגע." },
  { id: "linen", label: "פשתן ריפוד", description: "בד טבעי ונושם, מראה מינימליסטי." },
  { id: "corduroy", label: "קורדרוי", description: "פסים מרקמיים עמידים לשימוש יומיומי." },
  { id: "chenille", label: "שאניל", description: "רך במיוחד עם מראה קטיפתי עמיד." },
  { id: "faux-leather", label: "דמוי עור", description: "קל לניקוי ועמיד לאורך זמן." },
] as const;

export const upholsteryColors = [
  { id: "taupe", label: "טאופ", hex: "#8B7D6B" },
  { id: "sand", label: "בז' חול", hex: "#D8C7A8" },
  { id: "olive", label: "ירוק זית", hex: "#6B7A4F" },
  { id: "stone", label: "אפור אבן", hex: "#A9A9A0" },
  { id: "terracotta", label: "טרקוטה", hex: "#B5674D" },
] as const;

export const furniturePieces = [
  { id: "sofa-3", label: "ספה תלת-מושבית" },
  { id: "sofa-2", label: "ספה דו-מושבית" },
  { id: "sofa-corner", label: "ספה פינתית" },
  { id: "armchair", label: "כורסא" },
  { id: "dining-chair", label: "כיסא לפינת אוכל" },
  { id: "headboard", label: "ראש מיטה" },
] as const;

export type UpholsteryType = (typeof upholsteryTypes)[number];
export type UpholsteryColor = (typeof upholsteryColors)[number];
export type FurniturePiece = (typeof furniturePieces)[number];
export type UpholsteryTypeId = UpholsteryType["id"];
export type UpholsteryColorId = UpholsteryColor["id"];
export type FurniturePieceId = FurniturePiece["id"];
