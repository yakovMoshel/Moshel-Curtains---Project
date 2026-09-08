import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, toInternationalIsraeliPhone } from "@/components/whatsapp/whatsappLink";

describe("toInternationalIsraeliPhone", () => {
  it("converts a local Israeli number to international digits", () => {
    expect(toInternationalIsraeliPhone("0526286837")).toBe("972526286837");
  });

  it("strips non-digit characters before converting", () => {
    expect(toInternationalIsraeliPhone("052-628-6837")).toBe("972526286837");
  });
});

describe("buildWhatsAppUrl", () => {
  it("converts a local Israeli number to international wa.me format", () => {
    expect(buildWhatsAppUrl("0526286837")).toBe("https://wa.me/972526286837");
  });

  it("strips non-digit characters before converting", () => {
    expect(buildWhatsAppUrl("052-628-6837")).toBe("https://wa.me/972526286837");
  });

  it("appends an encoded prefilled message when provided", () => {
    expect(buildWhatsAppUrl("0526286837", "שלום")).toBe(
      `https://wa.me/972526286837?text=${encodeURIComponent("שלום")}`,
    );
  });
});
