import { describe, expect, it } from "vitest";
import { buildMapsEmbedUrl } from "@/components/contact/address";

describe("buildMapsEmbedUrl", () => {
  it("builds a no-API-key Google Maps embed URL from a free-text address", () => {
    expect(buildMapsEmbedUrl("מאה שערים 52, ירושלים")).toBe(
      `https://www.google.com/maps?q=${encodeURIComponent("מאה שערים 52, ירושלים")}&output=embed`,
    );
  });

  it("encodes special characters safely", () => {
    expect(buildMapsEmbedUrl("A & B, City")).toBe(
      "https://www.google.com/maps?q=A%20%26%20B%2C%20City&output=embed",
    );
  });
});
