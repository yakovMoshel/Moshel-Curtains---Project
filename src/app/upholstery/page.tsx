import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "ריפוד | מושל הוילונות",
};

export default function Upholstery() {
  return <CategoryPage category="upholstery" />;
}
