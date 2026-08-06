import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { TableclothStylesTeaser } from "@/components/tablecloths-teaser";

export const metadata: Metadata = {
  title: "מפות | מושל הוילונות",
};

export default function Tablecloths() {
  return (
    <CategoryPage category="tablecloths">
      <TableclothStylesTeaser />
    </CategoryPage>
  );
}
