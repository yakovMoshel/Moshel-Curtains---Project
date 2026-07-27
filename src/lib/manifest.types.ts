export type VariantName = "desktop" | "mobile";

export interface FrameVariant {
  width: number;
  height: number;
  basePath: string;
}

export interface CategorySegment {
  id: string;
  kind: "category";
  category: string;
  label: string;
  startFrame: number;
  endFrame: number;
}

export interface BridgeSegment {
  id: string;
  kind: "bridge";
  from: string;
  to: string;
  startFrame: number;
  endFrame: number;
}

export type Segment = CategorySegment | BridgeSegment;

export interface CategorySection {
  category: string;
  label: string;
  contentStartFrame: number;
  contentEndFrame: number;
  fadeInRange: [number, number];
  fadeOutRange: [number, number];
  sectionStartFrame: number;
  sectionEndFrame: number;
}

export interface SequenceManifest {
  version: number;
  generatedAt: string;
  fps: number;
  totalFrames: number;
  framePattern: string;
  variants: Record<VariantName, FrameVariant>;
  segments: Segment[];
  categorySections: CategorySection[];
}
