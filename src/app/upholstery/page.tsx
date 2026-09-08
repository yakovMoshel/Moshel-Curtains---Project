import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { UpholsteryStylesTeaser } from "@/components/upholstery-teaser";

export const metadata: Metadata = {
  title: "ריפוד | מושל הוילונות",
  description: "בדים ומרקמים איכותיים המעניקים לרהיטים שלכם חיים חדשים.",
  alternates: { canonical: "/upholstery" },
};

export default function Upholstery() {
  return (
    <CategoryPage category="upholstery">
      <UpholsteryStylesTeaser />
    </CategoryPage>
  );
}
