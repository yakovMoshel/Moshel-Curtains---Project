import { describe, expect, it } from "vitest";
import { buildVisualizationPrompt } from "@/components/configurator/ai-visualization/buildVisualizationPrompt";

describe("buildVisualizationPrompt", () => {
  it("builds a curtains prompt with interpolated labels", () => {
    const prompt = buildVisualizationPrompt({
      category: "curtains",
      typeLabel: "וילון קלאסי",
      colorLabel: "כחול נייבי",
    });
    expect(prompt).toContain("curtains");
    expect(prompt).toContain("וילון קלאסי");
    expect(prompt).toContain("כחול נייבי");
  });

  it("builds a blinds prompt with interpolated labels", () => {
    const prompt = buildVisualizationPrompt({
      category: "blinds",
      typeLabel: "תריס ונציאני",
      colorLabel: "אפור",
    });
    expect(prompt).toContain("blinds");
    expect(prompt).toContain("תריס ונציאני");
    expect(prompt).toContain("אפור");
  });

  it("builds an upholstery prompt with interpolated labels including the furniture piece", () => {
    const prompt = buildVisualizationPrompt({
      category: "upholstery",
      typeLabel: "בד קטיפה",
      colorLabel: "ירוק בקבוק",
      extraLabel: "ספה תלת מושבית",
    });
    expect(prompt).toContain("Reupholster");
    expect(prompt).toContain("ספה תלת מושבית");
    expect(prompt).toContain("בד קטיפה");
    expect(prompt).toContain("ירוק בקבוק");
  });

  it("builds a tablecloths prompt with interpolated labels", () => {
    const prompt = buildVisualizationPrompt({
      category: "tablecloths",
      typeLabel: "מפת פשתן",
      colorLabel: "לבן שמנת",
    });
    expect(prompt).toContain("tablecloth");
    expect(prompt).toContain("מפת פשתן");
    expect(prompt).toContain("לבן שמנת");
  });

  it("does not break when labels contain quotes", () => {
    const prompt = buildVisualizationPrompt({
      category: "curtains",
      typeLabel: 'וילון "שקוף"',
      colorLabel: "לבן",
    });
    expect(prompt).toContain('וילון "שקוף"');
  });
});
