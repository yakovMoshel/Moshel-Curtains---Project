import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { CurtainStylesTeaser } from "@/components/curtains-teaser";

export const metadata: Metadata = {
  title: "וילונות | מושל הוילונות",
  description: "וילונות בהתאמה אישית שמעצבים את האור והצל בבית שלכם.",
  alternates: { canonical: "/curtains" },
};

export default function Curtains() {
  return (
    <CategoryPage category="curtains">
      <CurtainStylesTeaser />
    </CategoryPage>
  );
}
