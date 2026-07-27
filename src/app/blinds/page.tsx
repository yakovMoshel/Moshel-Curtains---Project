import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "תריסים | מושל הוילונות",
};

export default function Blinds() {
  return <CategoryPage category="blinds" />;
}
