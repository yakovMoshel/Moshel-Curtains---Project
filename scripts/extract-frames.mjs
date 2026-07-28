import fs from "node:fs/promises";
import path from "node:path";
import {
  CLIPS,
  DESKTOP_TOTAL_WARN_MB,
  FORMAT,
  FPS,
  FRAME_SIZE_WARN_KB,
  OUTPUT_ROOT,
  QUALITY,
  SOURCE_DIR,
  VARIANTS,
} from "./config/sequence.config.mjs";
import { probeClip, runFfmpeg } from "./lib/ffmpeg.mjs";

const FRAME_NAME_RE = /^frame_(\d{5})\.webp$/;

function variantDirName(variantName) {
  return variantName === "desktop" ? "sequence" : `sequence-${variantName}`;
}

async function extractVariant(variant) {
  const outDir = path.join(OUTPUT_ROOT, variantDirName(variant.name));
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  let runningTotal = 0;
  const segments = [];

  for (const clip of CLIPS) {
    const srcPath = path.join(SOURCE_DIR, clip.file);
    const probe = await probeClip(srcPath);
    const durationSec = Number(probe.duration);

    const startNumber = runningTotal + 1;
    await runFfmpeg([
      "-y",
      "-i",
      srcPath,
      "-vf",
      `fps=${FPS},scale=${variant.width}:-2:flags=lanczos`,
      "-start_number",
      String(startNumber),
      "-c:v",
      "libwebp",
      "-quality",
      String(QUALITY),
      "-compression_level",
      "4",
      path.join(outDir, "frame_%05d.webp"),
    ]);

    // Don't trust duration*fps estimates — count what ffmpeg actually wrote,
    // since frame-boundary rounding can drift by +/-1 frame per clip.
    const entries = await fs.readdir(outDir);
    const clipFrameNumbers = entries
      .map((name) => FRAME_NAME_RE.exec(name))
      .filter((match) => match !== null)
      .map((match) => Number(match[1]))
      .filter((n) => n >= startNumber)
      .sort((a, b) => a - b);

    const actualCount = clipFrameNumbers.length;
    const endFrame = runningTotal + actualCount;

    segments.push({
      id: clip.id,
      kind: clip.kind,
      ...(clip.kind === "category"
        ? { category: clip.category, label: clip.label }
        : clip.kind === "bridge"
          ? { from: clip.from, to: clip.to }
          : { label: clip.label }),
      startFrame: startNumber,
      endFrame,
    });

    console.log(
      `  ${clip.file}: duration=${durationSec.toFixed(2)}s -> ${actualCount} frames (${startNumber}-${endFrame})`,
    );

    runningTotal = endFrame;
  }

  return { outDir, totalFrames: runningTotal, segments };
}

function buildCategorySections(segments, introSection) {
  const categorySegments = segments.filter((s) => s.kind === "category");
  const bridgeByFrom = new Map(segments.filter((s) => s.kind === "bridge").map((s) => [s.from, s]));
  const bridgeByTo = new Map(segments.filter((s) => s.kind === "bridge").map((s) => [s.to, s]));

  return categorySegments.map((seg, index) => {
    const contentStartFrame = seg.startFrame;
    const contentEndFrame = seg.endFrame;

    const precedingBridge = bridgeByTo.get(seg.category);
    const followingBridge = bridgeByFrom.get(seg.category);
    const precededByIntro =
      index === 0 && introSection && introSection.sectionEndFrame + 1 === contentStartFrame;

    let fadeInRange;
    if (precedingBridge) {
      const mid = Math.round((precedingBridge.startFrame + precedingBridge.endFrame) / 2);
      fadeInRange = [mid, precedingBridge.endFrame];
    } else if (precededByIntro) {
      // No bridge clip between the intro and the first category — instead, fade
      // this category's overlay in as the intro's own welcome text fades out,
      // over the same frame range (mirrors how bridges cross-fade categories).
      fadeInRange = introSection.textFadeOutRange;
    } else {
      fadeInRange = [contentStartFrame, contentStartFrame];
    }

    let fadeOutRange;
    if (followingBridge) {
      const mid = Math.round((followingBridge.startFrame + followingBridge.endFrame) / 2);
      fadeOutRange = [followingBridge.startFrame, mid];
    } else {
      fadeOutRange = [contentEndFrame, contentEndFrame];
    }

    return {
      category: seg.category,
      label: seg.label,
      contentStartFrame,
      contentEndFrame,
      fadeInRange,
      fadeOutRange,
      sectionStartFrame: fadeInRange[0],
      sectionEndFrame: fadeOutRange[1],
    };
  });
}

function buildIntroSection(segments) {
  const introSeg = segments.find((s) => s.kind === "intro");
  if (!introSeg) return null;

  const frameCount = introSeg.endFrame - introSeg.startFrame + 1;
  const fadeInEnd = introSeg.startFrame + Math.round(frameCount * 0.25) - 1;
  const fadeOutStart = introSeg.startFrame + Math.round(frameCount * 0.65) - 1;

  return {
    label: introSeg.label,
    sectionStartFrame: introSeg.startFrame,
    sectionEndFrame: introSeg.endFrame,
    textFadeInRange: [introSeg.startFrame, fadeInEnd],
    textFadeOutRange: [fadeOutStart, introSeg.endFrame],
  };
}

async function getFrameDimensions(outDir) {
  const entries = (await fs.readdir(outDir)).filter((name) => FRAME_NAME_RE.test(name)).sort();
  const firstFrame = path.join(outDir, entries[0]);
  const probe = await probeClip(firstFrame);
  return { width: probe.width, height: probe.height };
}

async function printSanityReport(desktopResult, desktopOutDir) {
  const rows = [];
  let totalBytes = 0;
  let maxFrameBytes = 0;

  for (const seg of desktopResult.segments) {
    let bytes = 0;
    for (let i = seg.startFrame; i <= seg.endFrame; i++) {
      const filePath = path.join(desktopOutDir, `frame_${String(i).padStart(5, "0")}.webp`);
      const stat = await fs.stat(filePath);
      bytes += stat.size;
      if (stat.size > maxFrameBytes) maxFrameBytes = stat.size;
    }
    const frameCount = seg.endFrame - seg.startFrame + 1;
    rows.push({
      label: seg.kind === "bridge" ? `(bridge: ${seg.id})` : seg.label,
      frameCount,
      bytes,
    });
    totalBytes += bytes;
  }

  console.log("\nSanity check (desktop variant):");
  console.log("Category/Segment       Frames   Size(MB)   Avg KB/frame");
  for (const row of rows) {
    const mb = (row.bytes / 1024 / 1024).toFixed(1);
    const avgKb = (row.bytes / 1024 / row.frameCount).toFixed(1);
    console.log(
      `${row.label.padEnd(22)} ${String(row.frameCount).padEnd(8)} ${mb.padEnd(10)} ${avgKb}`,
    );
  }
  const totalMb = totalBytes / 1024 / 1024;
  console.log("-".repeat(50));
  console.log(`TOTAL                  ${desktopResult.totalFrames}      ${totalMb.toFixed(1)} MB`);

  if (totalMb > DESKTOP_TOTAL_WARN_MB) {
    console.warn(
      `\n⚠ WARNING: desktop total ${totalMb.toFixed(1)}MB exceeds ${DESKTOP_TOTAL_WARN_MB}MB. Consider lowering fps, width, or webp quality.`,
    );
  }
  if (maxFrameBytes / 1024 > FRAME_SIZE_WARN_KB) {
    console.warn(
      `⚠ WARNING: largest frame is ${(maxFrameBytes / 1024).toFixed(1)}KB, exceeding ${FRAME_SIZE_WARN_KB}KB. Consider lowering quality.`,
    );
  }
}

async function main() {
  const variantResults = {};

  for (const variant of VARIANTS) {
    console.log(`\nExtracting variant "${variant.name}" (width=${variant.width})...`);
    variantResults[variant.name] = await extractVariant(variant);
  }

  const desktop = variantResults.desktop;
  for (const [name, result] of Object.entries(variantResults)) {
    if (result.totalFrames !== desktop.totalFrames) {
      console.warn(
        `⚠ WARNING: variant "${name}" produced ${result.totalFrames} frames, desktop produced ${desktop.totalFrames}. Manifest frame indices assume all variants are frame-aligned.`,
      );
    }
  }

  const introSection = buildIntroSection(desktop.segments);
  const categorySections = buildCategorySections(desktop.segments, introSection);

  if (introSection && introSection.sectionEndFrame + 1 !== categorySections[0]?.contentStartFrame) {
    console.warn(
      `⚠ WARNING: intro section ends at frame ${introSection.sectionEndFrame}, but the first category starts at ${categorySections[0]?.contentStartFrame} — expected them to be adjacent (no bridge).`,
    );
  }
  const lastCategory = categorySections[categorySections.length - 1];
  if (lastCategory && lastCategory.sectionEndFrame !== desktop.totalFrames) {
    console.warn(
      `⚠ WARNING: last category's sectionEndFrame (${lastCategory.sectionEndFrame}) does not equal totalFrames (${desktop.totalFrames}).`,
    );
  }

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    fps: FPS,
    totalFrames: desktop.totalFrames,
    framePattern: "frame_%05d.webp",
    variants: {},
    segments: desktop.segments,
    introSection,
    categorySections,
  };

  for (const variant of VARIANTS) {
    const result = variantResults[variant.name];
    const dims = await getFrameDimensions(result.outDir);
    manifest.variants[variant.name] = {
      width: dims.width,
      height: dims.height,
      basePath: `/frames/${variantDirName(variant.name)}`,
    };
  }

  await fs.writeFile(path.join(OUTPUT_ROOT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nWrote manifest.json (${desktop.totalFrames} total frames, format=${FORMAT}).`);

  await printSanityReport(desktop, desktop.outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
