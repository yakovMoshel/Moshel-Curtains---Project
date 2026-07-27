import type { SequenceManifest } from "@/lib/manifest.types";

export interface FrameStoreState {
  currentFrameIndex: number;
  manifest: SequenceManifest | null;
}

type Listener = () => void;

function createFrameStore() {
  let state: FrameStoreState = { currentFrameIndex: 1, manifest: null };
  const listeners = new Set<Listener>();

  function getState(): FrameStoreState {
    return state;
  }

  function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function setFrameIndex(currentFrameIndex: number): void {
    if (currentFrameIndex === state.currentFrameIndex) return;
    state = { ...state, currentFrameIndex };
    listeners.forEach((listener) => listener());
  }

  function setManifest(manifest: SequenceManifest): void {
    state = { ...state, manifest };
    listeners.forEach((listener) => listener());
  }

  return { getState, subscribe, setFrameIndex, setManifest };
}

export const frameStore = createFrameStore();
export type FrameStore = ReturnType<typeof createFrameStore>;
