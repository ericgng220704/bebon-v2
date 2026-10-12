"use client";

import { useRef } from "react";
import { Photo } from "@/components/ui/Photo";
import type { Content } from "@/content/types";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Savor's "The future tastes delicious": a full-bleed photo that drifts behind a big cream headline. */
export function Band({ band }: { band: Content["band"] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-band-media]",
          { yPercent: -12 },
          { yPercent: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-nav="dark" className="relative h-[95svh] min-h-[32rem] overflow-hidden bg-oxblood text-cream md:h-[110svh]">
      <div data-band-media="" className="absolute inset-x-0 -top-[12%] h-[124%]">
        <Photo picture={band.image} sizes="100vw" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(20_6_4/0.55),rgb(20_6_4/0.15)_60%,rgb(20_6_4/0.2))]" />
      <div className="absolute inset-x-0 bottom-[16%] px-gutter md:bottom-[24%] md:pl-[11%]">
        <SplitReveal lines={band.title} lineClassNames={["", "pl-[0.9em]"]} className="text-display-l" start="top 80%" />
      </div>
    </section>
  );
}
