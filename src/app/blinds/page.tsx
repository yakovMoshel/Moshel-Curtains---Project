import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { BlindStylesTeaser } from "@/components/blinds-teaser";

export const metadata: Metadata = {
  title: "תריסים | מושל הוילונות",
  description: "פתרונות הצללה מדויקים — עץ, אלומיניום ובד, לכל חלון ובית.",
  alternates: { canonical: "/blinds" },
};

export default function Blinds() {
  return (
    <CategoryPage category="blinds">
      <BlindStylesTeaser />
    </CategoryPage>
  );
}
