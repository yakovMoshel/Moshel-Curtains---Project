import { describe, expect, it } from "vitest";
import { buildBlindWhatsAppOrderMessage } from "@/components/configurator/buildBlindOrderMessage";

describe("buildBlindWhatsAppOrderMessage", () => {
  it("formats a message with type, color and dimensions", () => {
    const message = buildBlindWhatsAppOrderMessage({
      typeId: "roller-electric",
      colorId: "anthracite",
      width: "150",
      height: "220",
    });

    expect(message).toBe(
      [
        "היי, אני מעוניין/ת בהזמנה:",
        "סוג: תריס גלילה חשמלי",
        "צבע: אנתרציט",
        'מידות: 150 ס"מ (רוחב) × 220 ס"מ (גובה)',
      ].join("\n"),
    );
  });

  it("falls back to empty labels when type or color is missing", () => {
    const message = buildBlindWhatsAppOrderMessage({
      typeId: null,
      colorId: null,
      width: "",
      height: "",
    });

    expect(message).toContain("סוג: \nצבע: ");
    expect(message).toContain('מידות:  ס"מ (רוחב) ×  ס"מ (גובה)');
  });
});
