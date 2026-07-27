import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "וילונות | מושל הוילונות",
};

export default function Curtains() {
  return <CategoryPage category="curtains" />;
}
