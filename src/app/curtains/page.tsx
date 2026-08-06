import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "וילונות | מושל הוילונות",
};

export default function Curtains() {
  return (
    <>
      <CategoryPage category="curtains" />
      <div className="mx-auto max-w-3xl px-8 pb-16 sm:px-16">
        <Link
          href="/curtains/configure"
          className="inline-block rounded-sm bg-stone-900 px-6 py-3 text-sm font-medium text-stone-50"
        >
          בחר את הוילון שלך
        </Link>
      </div>
    </>
  );
}
