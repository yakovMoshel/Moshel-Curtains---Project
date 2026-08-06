import { describe, expect, it } from "vitest";
import { validateDimension, validateSize } from "@/components/configurator/validation";

describe("validateDimension", () => {
  it("requires a value", () => {
    expect(validateDimension("")).toBe("נא להזין מידה");
  });

  it("rejects non-numeric values", () => {
    expect(validateDimension("abc")).toBe("נא להזין מספר תקין");
  });

  it("rejects values below the minimum", () => {
    expect(validateDimension("10")).toContain("30");
  });

  it("rejects values above the maximum", () => {
    expect(validateDimension("600")).toContain("500");
  });

  it("accepts values within range", () => {
    expect(validateDimension("150")).toBeUndefined();
  });
});

describe("validateSize", () => {
  it("returns errors for both fields when both are invalid", () => {
    const errors = validateSize("", "700");
    expect(errors.width).toBeDefined();
    expect(errors.height).toBeDefined();
  });

  it("returns no errors when both fields are valid", () => {
    expect(validateSize("100", "200")).toEqual({});
  });
});
