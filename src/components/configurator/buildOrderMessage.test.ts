import { describe, expect, it } from "vitest";
import { buildWhatsAppOrderMessage } from "@/components/configurator/buildOrderMessage";

describe("buildWhatsAppOrderMessage", () => {
  it("formats a message with type, color and dimensions", () => {
    const message = buildWhatsAppOrderMessage({
      typeId: "classic",
      colorId: "navy",
      width: "150",
      height: "220",
    });

    expect(message).toBe(
      [
        "היי, אני מעוניין/ת בהזמנה:",
        "סוג: וילון קלאסי",
        "צבע: כחול נייבי",
        'מידות: 150 ס"מ (רוחב) × 220 ס"מ (גובה)',
      ].join("\n"),
    );
  });

  it("falls back to empty labels when type or color is missing", () => {
    const message = buildWhatsAppOrderMessage({
      typeId: null,
      colorId: null,
      width: "",
      height: "",
    });

    expect(message).toContain("סוג: \nצבע: ");
    expect(message).toContain('מידות:  ס"מ (רוחב) ×  ס"מ (גובה)');
  });

  it("round-trips through URL encoding without losing Hebrew characters", () => {
    const message = buildWhatsAppOrderMessage({
      typeId: "zebra",
      colorId: "dustyrose",
      width: "100",
      height: "200",
    });

    const encoded = encodeURIComponent(message);
    expect(decodeURIComponent(encoded)).toBe(message);
    expect(encoded).not.toContain("\n");
  });
});
