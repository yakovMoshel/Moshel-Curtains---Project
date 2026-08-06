import { describe, expect, it } from "vitest";
import {
  validateDimension,
  validateDimensions,
  validateSize,
} from "@/components/configurator/validation";

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

  it("supports custom min/max bounds", () => {
    expect(validateDimension("70", 80, 200)).toContain("80");
    expect(validateDimension("250", 80, 200)).toContain("200");
    expect(validateDimension("120", 80, 200)).toBeUndefined();
  });
});

describe("validateDimensions", () => {
  it("validates the round tablecloth diameter range", () => {
    const errors = validateDimensions({ diameter: "70" }, { diameter: { min: 80, max: 200 } });
    expect(errors.diameter).toContain("80");
  });

  it("validates the rectangular tablecloth length/width ranges independently", () => {
    const errors = validateDimensions(
      { length: "310", width: "100" },
      { length: { min: 80, max: 300 }, width: { min: 60, max: 160 } },
    );
    expect(errors.length).toContain("300");
    expect(errors.width).toBeUndefined();
  });

  it("returns no errors when all fields are within their ranges", () => {
    const errors = validateDimensions(
      { length: "150", width: "100" },
      { length: { min: 80, max: 300 }, width: { min: 60, max: 160 } },
    );
    expect(errors).toEqual({});
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
