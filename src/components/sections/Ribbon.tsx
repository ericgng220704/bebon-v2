"use client";

import { useRef, type CSSProperties } from "react";
import type { Content } from "@/content/types";
import { FadeIn } from "@/components/motion/FadeIn";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { DashButton } from "@/components/ui/DashButton";
import { Photo } from "@/components/ui/Photo";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Tile widths vary a little so the column reads as a hand-laid ribbon, not a grid.
const WIDTHS = [1, 0.84, 1.06, 0.78, 0.96, 1.1, 0.82, 0.92, 1.04, 0.8, 1, 0.88, 0.76, 0.98];

/**
 * Savor's snaking column of food photos: the tiles sit flush in one column, and each one slides
 * sideways along a sine wave depending on how high it sits in the viewport, so the column meanders as you scroll.
 */
export function Ribbon({ ribbon }: { ribbon: Content["ribbon"] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ desktop: "(min-width: 768px)", motion: MOTION_OK }, (context) => {
        const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;

        const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]");
        const setters = tiles.map((tile) => gsap.quickSetter(tile, "x", "px"));
        let centres: number[] = [];
        let visible = false;

        const measure = () => {
          const scrollY = window.scrollY;
          centres = tiles.map((tile) => {
            const box = tile.getBoundingClientRect();
            return box.top + scrollY + box.height / 2;
          });
        };

        // The ticker passes the time as the first argument, so only a literal `true` forces an update.
        const wave = (force?: unknown) => {
          if (!visible && force !== true) return;
          const vh = window.innerHeight;
          const amplitude = window.innerWidth * (desktop ? 0.085 : 0.17);
          const scrollY = window.scrollY;
          centres.forEach((centre, i) => {
            const y = (centre - scrollY) / vh;
            setters[i](Math.sin(y * Math.PI * 1.15 + 0.6) * amplitude);
          });
        };

        const refresh = () => {
          gsap.set(tiles, { x: 0 });
          measure();
          wave(true);
        };

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
          },
        });
        refresh();
        ScrollTrigger.addEventListener("refresh", refresh);
        gsap.ticker.add(wave);

        return () => {
          ScrollTrigger.removeEventListener("refresh", refresh);
          gsap.ticker.remove(wave);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="cookies" ref={root} data-nav="light" className="relative overflow-x-clip px-gutter pb-[16vh]">
      <div className="grid grid-cols-12 gap-x-[2rem]">
        <div className="col-span-12 flex flex-col items-center md:col-span-6">
          {ribbon.images.map((image, i) => (
            <figure
              key={i}
              data-tile=""
              className="relative aspect-[16/10] w-[calc(var(--w)*52vw)] overflow-hidden md:w-[calc(var(--w)*23vw)]"
              style={{ "--w": WIDTHS[i % WIDTHS.length] } as CSSProperties}
            >
              <Photo picture={image} sizes="(min-width: 768px) 24vw, 46vw" />
            </figure>
          ))}
        </div>

        <div className="col-span-12 mt-[12vh] md:col-span-6 md:mt-0 md:self-end md:pb-[18vh] md:pl-[4vw]">
          <SplitReveal lines={ribbon.title} lineClassNames={["whitespace-nowrap", "pl-[0.6em] whitespace-nowrap"]} className="text-display-l md:text-[6.6vw]" />
          <FadeIn className="mt-8 ml-auto flex max-w-[22em] flex-col items-start gap-6 md:mt-12 md:mr-[4%]">
            <p className="text-body">{ribbon.body}</p>
            <DashButton first={ribbon.cta.first} second={ribbon.cta.second} href={ribbon.cta.href} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
