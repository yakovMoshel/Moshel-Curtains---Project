import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryPage } from "@/components/category-page/CategoryPage";
import { CATEGORY_CONTENT } from "@/components/category-overlay/categoryContent";

describe("CategoryPage", () => {
  it.each(Object.keys(CATEGORY_CONTENT))(
    "renders the heading and hero image for %s",
    (category) => {
      const content = CATEGORY_CONTENT[category]!;
      render(<CategoryPage category={category} />);

      expect(screen.getByRole("heading", { name: content.heading })).toBeInTheDocument();
      expect(screen.getByAltText(content.heading)).toBeInTheDocument();
    },
  );

  it("returns null for an unknown category", () => {
    const { container } = render(<CategoryPage category="not-a-real-category" />);
    expect(container).toBeEmptyDOMElement();
  });
});
