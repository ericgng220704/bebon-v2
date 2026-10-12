"use client";

import { useRef, type MouseEvent } from "react";
import { nav, type instagramLinks } from "@/content/site";
import type { Content } from "@/content/types";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { DashButton } from "@/components/ui/DashButton";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

const WORDMARK = "bebon";

type Props = { footer: Content["footer"]; instagram: ReturnType<typeof instagramLinks> };

export function Footer({ footer, instagram }: Props) {
  const root = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // The giant wordmark climbs out of the floor letter by letter as the footer comes into view.
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-letter]",
          { yPercent: 105 },
          {
            yPercent: 0,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: "[data-wordmark]", start: "top bottom", end: "bottom bottom", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const go = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (scrollTo(href)) event.preventDefault();
  };

  return (
    <footer ref={root} data-nav="light" className="flex flex-col bg-oat px-gutter pt-[8vh] pb-5 text-oxblood md:pt-[12vh]">
      <div className="order-2 grid grid-cols-12 gap-x-[2rem] gap-y-12 md:order-1">
        <nav aria-label="Footer" className="col-span-6 md:col-span-2">
          <ul className="text-small">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={(event) => go(event, item.href)} className="inline-block py-1 hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="col-span-6 text-small md:col-span-2">
          <li>
            <a href={instagram.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:underline">
              Instagram
            </a>
          </li>
          <li>
            <a href={instagram.dmUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:underline">
              Send a DM
            </a>
          </li>
        </ul>

        <div className="col-span-12 row-start-1 flex flex-col items-start gap-7 md:col-span-5 md:col-start-7 md:row-start-auto">
          <p className="max-w-[19em] text-lead">{footer.pitch}</p>
          <DashButton first={footer.cta.first} second={footer.cta.second} href={instagram.dmUrl} variant="oxblood" />
        </div>
      </div>

      <div data-wordmark="" aria-hidden className="order-1 -mx-[0.5vw] mb-8 overflow-hidden pt-[2vw] pb-[1vw] md:order-2 md:mt-[10vh] md:mb-0">
        <p className="flex justify-center font-logo text-[33vw] leading-[0.78] tracking-[-0.03em] select-none">
          {WORDMARK.split("").map((letter, i) => (
            <span key={i} data-letter="" className="inline-block">
              {letter}
            </span>
          ))}
        </p>
      </div>

      <div className="order-3 mt-10 flex flex-col gap-2 text-small md:mt-6 md:flex-row md:items-center md:justify-between">
        <p>{footer.smallprint.join(" · ")}</p>
        <a href={instagram.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:underline">
          @{instagram.handle}
        </a>
        <p>©Bebon {footer.year}.</p>
      </div>
    </footer>
  );
}
