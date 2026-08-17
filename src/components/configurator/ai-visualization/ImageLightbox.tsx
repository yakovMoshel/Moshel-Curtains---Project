"use client";

import { useEffect, useRef } from "react";

interface ImageLightboxProps {
  src: string | null;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (src && !dialog.open) dialog.showModal();
    if (!src && dialog.open) dialog.close();
  }, [src]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="max-h-[90vh] max-w-[90vw] rounded-sm bg-transparent p-0 backdrop:bg-black/70"
    >
      {src && <img src={src} alt={alt} className="max-h-[90vh] max-w-[90vw] object-contain" />}
    </dialog>
  );
}
