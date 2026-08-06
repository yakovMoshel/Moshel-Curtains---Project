import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useStepTransition(step: number) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.fromTo(
        element,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "sine.inOut" },
      );
      return;
    }

    gsap.fromTo(
      element,
      { opacity: 0, x: 12 },
      { opacity: 1, x: 0, duration: 0.35, ease: "sine.inOut" },
    );
  }, [step]);

  return contentRef;
}
