import Image from "next/image";
import Link from "next/link";
import { CATEGORY_CONTENT } from "@/components/category-overlay/categoryContent";

interface CategoryPageProps {
  category: string;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const content = CATEGORY_CONTENT[category];
  if (!content) return null;

  return (
    <main>
      <div className="relative h-[70vh] min-h-[420px] w-full">
        <Image
          src={content.heroImage}
          alt={content.heading}
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.05))" }}
        />
        <div className="absolute inset-x-0 bottom-0 p-8 text-stone-50 sm:p-16">
          <p className="text-sm font-medium tracking-[0.2em] text-stone-200 uppercase">
            {content.tagline}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{content.heading}</h1>
        </div>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-8 py-16 sm:px-16">
        <p className="max-w-xl text-lg text-stone-700">{content.copy}</p>
        <div className="relative h-64 w-full overflow-hidden rounded-sm sm:h-96">
          <Image
            src={content.detailImage}
            alt={`${content.heading} — תקריב`}
            fill
            className="object-cover"
          />
        </div>
        <Link href="/" className="text-sm font-medium text-stone-600 underline">
          חזרה לדף הבית
        </Link>
      </div>
    </main>
  );
}
