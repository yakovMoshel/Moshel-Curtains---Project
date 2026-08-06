"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { blindTypes } from "@/lib/data/blind-products";

const PREVIEW_COUNT = 4;

export function BlindStylesTeaser() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.children;
    if (!cards) return;
    gsap.fromTo(
      Array.from(cards),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "sine.inOut", stagger: 0.06 },
    );
  }, []);

  return (
    <div className="bg-curtain-cream">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-8 py-16 sm:px-16">
        <div>
          <p className="mb-2 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
            לפני שמתחילים
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-curtain-espresso sm:text-4xl">
            הכירו את הסגנונות שלנו
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {blindTypes.slice(0, PREVIEW_COUNT).map((type) => (
            <div
              key={type.id}
              className="curtain-weave flex flex-col gap-1 rounded-sm border border-curtain-tan bg-linear-to-br from-curtain-cream to-curtain-beige p-4"
            >
              <span className="font-medium text-curtain-espresso">{type.label}</span>
              <span className="text-sm text-curtain-taupe">{type.description}</span>
            </div>
          ))}
        </div>

        <Link
          href="/blinds/configure"
          className="inline-block w-fit rounded-sm bg-curtain-espresso px-6 py-3 text-sm font-medium text-curtain-cream transition-transform duration-300 hover:scale-[1.02]"
        >
          בחר את התריס שלך
        </Link>
      </div>
    </div>
  );
}
