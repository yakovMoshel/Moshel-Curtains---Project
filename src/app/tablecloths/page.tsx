import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "מפות | מושל הוילונות",
};

export default function Tablecloths() {
  return <CategoryPage category="tablecloths" />;
}
