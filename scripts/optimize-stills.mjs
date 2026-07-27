import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runFfmpeg } from "./lib/ffmpeg.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.resolve(__dirname, "../../תמונות רקעים");
const OUTPUT_DIR = path.resolve(__dirname, "../public/images/stills");

const STILLS = [
  { src: "Luxury_villa_living_room_interior_202607261441.jpeg", slug: "curtains-wide" },
  { src: "Luxury_villa_living_room_interior_202607261443.jpeg", slug: "curtains-detail" },
  { src: "Luxury_villa_living_room_interior_202607261456.jpeg", slug: "blinds-wide" },
  { src: "Luxury_villa_living_room_interior_202607261456 (1).jpeg", slug: "blinds-detail" },
  { src: "Luxury_villa_living_room_interior_202607261452.jpeg", slug: "upholstery-wide" },
  { src: "Luxury_villa_living_room_interior_202607261452 (1).jpeg", slug: "upholstery-detail" },
  { src: "Luxury_villa_living_room_interior_202607261455.jpeg", slug: "tablecloths-wide" },
  { src: "Luxury_villa_living_room_interior_202607261455 (1).jpeg", slug: "tablecloths-detail" },
];

const WIDTH = 1600;
const QUALITY = 82;

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const still of STILLS) {
    const srcPath = path.join(SOURCE_DIR, still.src);
    const outPath = path.join(OUTPUT_DIR, `${still.slug}.webp`);
    await runFfmpeg([
      "-y",
      "-i",
      srcPath,
      "-vf",
      `scale=${WIDTH}:-2:flags=lanczos`,
      "-c:v",
      "libwebp",
      "-quality",
      String(QUALITY),
      outPath,
    ]);
    const stat = await fs.stat(outPath);
    console.log(`${still.slug}.webp — ${(stat.size / 1024).toFixed(0)}KB`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
