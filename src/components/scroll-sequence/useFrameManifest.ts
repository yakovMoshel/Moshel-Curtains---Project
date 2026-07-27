"use client";

import { useEffect, useState } from "react";
import type { SequenceManifest } from "@/lib/manifest.types";
import { frameStore } from "@/components/scroll-sequence/frameStore";

export function useFrameManifest(): SequenceManifest | null {
  const [manifest, setManifest] = useState<SequenceManifest | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/frames/manifest.json")
      .then((res) => res.json() as Promise<SequenceManifest>)
      .then((data) => {
        if (cancelled) return;
        setManifest(data);
        frameStore.setManifest(data);
      })
      .catch((err) => {
        console.error("Failed to load frame sequence manifest", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return manifest;
}
