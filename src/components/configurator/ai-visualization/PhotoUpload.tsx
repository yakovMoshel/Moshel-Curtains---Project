"use client";

import { useRef, useState, type DragEvent } from "react";
import { ACCEPTED_IMAGE_TYPES } from "@/components/configurator/ai-visualization/fileValidation";

interface PhotoUploadProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function PhotoUpload({ onFileSelected, disabled }: PhotoUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragActive(false);
    if (disabled) return;
    const file = event.dataTransfer.files[0];
    if (file) onFileSelected(file);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onFileSelected(file);
    event.target.value = "";
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={`flex cursor-pointer flex-col items-center gap-2 rounded-sm border-2 border-dashed p-8 text-center transition-colors ${
        isDragActive
          ? "border-curtain-espresso bg-curtain-tan/30"
          : "border-curtain-tan bg-curtain-beige"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />
      <p className="text-sm font-medium text-curtain-espresso">
        גררו תמונה לכאן או לחצו לבחירת קובץ
      </p>
      <p className="text-xs text-curtain-taupe">JPG, PNG או WEBP, עד 10MB</p>
    </div>
  );
}
