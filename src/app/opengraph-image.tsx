import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "מושל הוילונות — וילונות, תריסים, ריפוד ומפות בהתאמה אישית";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "מושל הוילונות";
const TAGLINE = "וילונות · תריסים · ריפוד · מפות";

/**
 * Fetches only the glyphs `text` actually needs from Google Fonts, as raw
 * font bytes Satori (next/og's renderer) can use — its default font has no
 * Hebrew glyphs, so without this the brand name would render as empty boxes.
 */
async function loadGoogleFont(family: string, text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(cssUrl)).text();
  const fontUrl = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!fontUrl) throw new Error(`Could not resolve a font file for ${family}`);
  return await (await fetch(fontUrl)).arrayBuffer();
}

/**
 * Satori (next/og's renderer) doesn't implement the Unicode bidi algorithm —
 * it draws characters left-to-right in string order regardless of `direction`,
 * so RTL text like Hebrew renders reversed unless the source string itself is
 * reversed first.
 */
function toSatoriRtl(text: string): string {
  return [...text].reverse().join("");
}

// This is an interim brand card built from existing product photography —
// see the comment in src/components/seo/LocalBusinessJsonLd.tsx — swap for
// the real logo once it's uploaded.
//
// The background is a pre-generated JPEG (public/images/og/brand-card-bg.jpg,
// cropped 1200x630 from curtains-wide.webp), not the original .webp — Satori
// (next/og's renderer) can only decode PNG/JPEG, not WebP.
export default async function Image() {
  const [imageData, rubikBold, rubikRegular] = await Promise.all([
    readFile(join(process.cwd(), "public/images/og/brand-card-bg.jpg")),
    loadGoogleFont("Rubik:wght@600", BRAND),
    loadGoogleFont("Rubik:wght@500", TAGLINE),
  ]);
  const backgroundSrc = `data:image/jpeg;base64,${imageData.toString("base64")}`;

  return new ImageResponse(
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- next/og requires a plain <img>, not next/image */}
      <img
        src={backgroundSrc}
        alt=""
        width={size.width}
        height={size.height}
        style={{ objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(58,46,34,0.8), rgba(58,46,34,0.15))",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 64,
          right: 64,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: 68, color: "#f7f0e3", fontFamily: "Rubik-Bold" }}>
          {toSatoriRtl(BRAND)}
        </div>
        <div style={{ fontSize: 30, color: "#ede0c8", marginTop: 16, fontFamily: "Rubik" }}>
          {toSatoriRtl(TAGLINE)}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Rubik-Bold", data: rubikBold, style: "normal", weight: 600 },
        { name: "Rubik", data: rubikRegular, style: "normal", weight: 500 },
      ],
    },
  );
}
