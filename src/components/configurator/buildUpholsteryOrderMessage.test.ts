import { describe, expect, it } from "vitest";
import { buildUpholsteryWhatsAppOrderMessage } from "@/components/configurator/buildUpholsteryOrderMessage";

describe("buildUpholsteryWhatsAppOrderMessage", () => {
  it("formats a message with type, color and furniture piece, and no dimensions line", () => {
    const message = buildUpholsteryWhatsAppOrderMessage({
      typeId: "velvet",
      colorId: "olive",
      furniturePieceId: "armchair",
    });

    expect(message).toBe(
      ["היי, אני מעוניין/ת בהזמנה:", "סוג: קטיפה", "צבע: ירוק זית", "פריט: כורסא"].join("\n"),
    );
    expect(message).not.toContain("מידות");
  });

  it("falls back to empty labels when selections are missing", () => {
    const message = buildUpholsteryWhatsAppOrderMessage({
      typeId: null,
      colorId: null,
      furniturePieceId: null,
    });

    expect(message).toContain("סוג: \nצבע: \nפריט: ");
  });
});
