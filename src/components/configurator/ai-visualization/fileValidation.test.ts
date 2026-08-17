import { describe, expect, it } from "vitest";
import {
  MAX_IMAGE_BYTES,
  validateImageFile,
} from "@/components/configurator/ai-visualization/fileValidation";

describe("validateImageFile", () => {
  it.each(["image/jpeg", "image/png", "image/webp"])("accepts %s within the size limit", (type) => {
    const result = validateImageFile({ type, size: 1024 });
    expect(result.ok).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it.each(["image/gif", "application/pdf", "image/svg+xml", "IMAGE/JPEG"])(
    "rejects unsupported type %s",
    (type) => {
      const result = validateImageFile({ type, size: 1024 });
      expect(result.ok).toBe(false);
      expect(result.error?.code).toBe("invalid_file");
    },
  );

  it("accepts a file exactly at the size limit", () => {
    const result = validateImageFile({ type: "image/png", size: MAX_IMAGE_BYTES });
    expect(result.ok).toBe(true);
  });

  it("rejects a file one byte over the size limit", () => {
    const result = validateImageFile({ type: "image/png", size: MAX_IMAGE_BYTES + 1 });
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("too_large");
  });

  it("rejects an empty file", () => {
    const result = validateImageFile({ type: "image/png", size: 0 });
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("invalid_file");
  });
});
