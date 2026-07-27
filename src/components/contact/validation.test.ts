import { describe, expect, it } from "vitest";
import {
  validateContactForm,
  validateName,
  validatePhone,
  validateProductType,
} from "@/components/contact/validation";

describe("validateName", () => {
  it("rejects an empty name", () => {
    expect(validateName("")).toBeDefined();
    expect(validateName("   ")).toBeDefined();
  });

  it("accepts a non-empty name", () => {
    expect(validateName("יעקב")).toBeUndefined();
  });
});

describe("validatePhone", () => {
  it("rejects an empty phone", () => {
    expect(validatePhone("")).toBeDefined();
  });

  it("rejects a phone without a leading 0", () => {
    expect(validatePhone("526286837")).toBeDefined();
  });

  it("rejects a too-short phone", () => {
    expect(validatePhone("0521234")).toBeDefined();
  });

  it("accepts a valid Israeli mobile number", () => {
    expect(validatePhone("0526286837")).toBeUndefined();
  });

  it("accepts a valid number with dashes/spaces", () => {
    expect(validatePhone("052-628-6837")).toBeUndefined();
    expect(validatePhone("052 628 6837")).toBeUndefined();
  });
});

describe("validateProductType", () => {
  it("rejects an empty selection", () => {
    expect(validateProductType("")).toBeDefined();
  });

  it("accepts a chosen product type", () => {
    expect(validateProductType("curtains")).toBeUndefined();
  });
});

describe("validateContactForm", () => {
  it("returns no errors for fully valid values", () => {
    expect(
      validateContactForm({ name: "יעקב", phone: "0526286837", productType: "curtains" }),
    ).toEqual({});
  });

  it("returns an error per invalid field", () => {
    const errors = validateContactForm({ name: "", phone: "", productType: "" });
    expect(errors.name).toBeDefined();
    expect(errors.phone).toBeDefined();
    expect(errors.productType).toBeDefined();
  });
});
