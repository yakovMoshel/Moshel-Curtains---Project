"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CATEGORY_CONTENT } from "@/components/category-overlay/categoryContent";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CategoryPageProps {
  category: string;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const detailImageRef = useRef<HTMLDivElement>(null);

  const content = CATEGORY_CONTENT[category];

  useEffect(() => {
    if (!content) return undefined;

    const heroText = heroTextRef.current;
    if (heroText) {
      gsap.fromTo(
        heroText,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "sine.inOut" },
      );
    }

    const detailImage = detailImageRef.current;
    let trigger: ScrollTrigger | undefined;
    if (detailImage) {
      gsap.set(detailImage, { clipPath: "inset(0 42% 0 42%)" });
      trigger = ScrollTrigger.create({
        trigger: detailImage,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(detailImage, {
            clipPath: "inset(0 0% 0 0%)",
            duration: 1,
            ease: "sine.inOut",
          });
        },
      });
    }

    return () => {
      trigger?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  if (!content) return null;

  return (
    <main className="bg-white">
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
        <div ref={heroTextRef} className="absolute inset-x-0 bottom-0 p-8 text-stone-50 sm:p-16">
          <p className="text-sm font-medium tracking-[0.2em] text-stone-200 uppercase">
            {content.tagline}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{content.heading}</h1>
        </div>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-8 py-16 sm:px-16">
        <p className="max-w-xl text-lg text-stone-700">{content.copy}</p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {content.highlights.map((highlight, index) => (
            <div key={highlight} className="flex items-center gap-6">
              {index > 0 && (
                <span className="hidden h-4 w-px bg-stone-200 sm:block" aria-hidden="true" />
              )}
              <span className="text-sm tracking-wide text-stone-600">{highlight}</span>
            </div>
          ))}
        </div>

        <div
          ref={detailImageRef}
          className="relative h-64 w-full overflow-hidden rounded-sm sm:h-96"
        >
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
