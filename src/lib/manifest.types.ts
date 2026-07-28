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

export interface IntroSegment {
  id: string;
  kind: "intro";
  label: string;
  startFrame: number;
  endFrame: number;
}

export type Segment = CategorySegment | BridgeSegment | IntroSegment;

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

export interface IntroSection {
  label: string;
  sectionStartFrame: number;
  sectionEndFrame: number;
  textFadeInRange: [number, number];
  textFadeOutRange: [number, number];
}

export interface SequenceManifest {
  version: number;
  generatedAt: string;
  fps: number;
  totalFrames: number;
  framePattern: string;
  variants: Record<VariantName, FrameVariant>;
  segments: Segment[];
  introSection: IntroSection;
  categorySections: CategorySection[];
}
