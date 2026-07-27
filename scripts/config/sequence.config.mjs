import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Source clips live outside the repo, one level above the project root, per the
// confirmed decision not to copy ~90MB of raw video into version control.
export const SOURCE_DIR = path.resolve(__dirname, "../../../סירטוני התחלה וסוף לכל קטגוריה");

export const OUTPUT_ROOT = path.resolve(__dirname, "../../public/frames");

export const CLIPS = [
  {
    id: "curtains",
    file: "curtains.mp4",
    kind: "category",
    category: "curtains",
    label: "Curtains",
  },
  {
    id: "curtains-to-blinds",
    file: "bridge-curtains-to-blinds.mp4",
    kind: "bridge",
    from: "curtains",
    to: "blinds",
  },
  { id: "blinds", file: "blinds.mp4", kind: "category", category: "blinds", label: "Blinds" },
  {
    id: "blinds-to-upholstery",
    file: "bridge-blinds-to-upholstery.mp4",
    kind: "bridge",
    from: "blinds",
    to: "upholstery",
  },
  {
    id: "upholstery",
    file: "upholstery.mp4",
    kind: "category",
    category: "upholstery",
    label: "Upholstery",
  },
  {
    id: "upholstery-to-tablecloth",
    file: "bridge-upholstery-to-tablecloth.mp4",
    kind: "bridge",
    from: "upholstery",
    to: "tablecloths",
  },
  {
    id: "tablecloth",
    file: "tablecloth.mp4",
    kind: "category",
    category: "tablecloths",
    label: "Tablecloths",
  },
];

export const FPS = 12;
export const FORMAT = "webp";
export const QUALITY = 75;

export const VARIANTS = [
  { name: "desktop", width: 1280 },
  { name: "mobile", width: 720 },
];

// Payload sanity-check thresholds (see extract-frames.mjs's printed report).
export const DESKTOP_TOTAL_WARN_MB = 50;
export const FRAME_SIZE_WARN_KB = 90;
