import { describe, expect, it } from "vitest";
import { buildTableclothWhatsAppOrderMessage } from "@/components/configurator/buildTableclothOrderMessage";

describe("buildTableclothWhatsAppOrderMessage", () => {
  it("formats a round tablecloth with a diameter line", () => {
    const message = buildTableclothWhatsAppOrderMessage({
      typeId: "pure-linen",
      colorId: "cream",
      shapeId: "round",
      diameter: "140",
      length: "",
      width: "",
    });

    expect(message).toBe(
      [
        "היי, אני מעוניין/ת בהזמנה:",
        "סוג: פשתן טהור",
        "צבע: שמנת קלאסי",
        'מידות: קוטר 140 ס"מ',
      ].join("\n"),
    );
  });

  it("formats a rectangular tablecloth with a length/width line", () => {
    const message = buildTableclothWhatsAppOrderMessage({
      typeId: "satin",
      colorId: "gold",
      shapeId: "rectangular",
      diameter: "",
      length: "200",
      width: "120",
    });

    expect(message).toBe(
      [
        "היי, אני מעוניין/ת בהזמנה:",
        "סוג: סאטן",
        "צבע: בז' זהב",
        'מידות: 200 ס"מ (אורך) × 120 ס"מ (רוחב)',
      ].join("\n"),
    );
  });
});
