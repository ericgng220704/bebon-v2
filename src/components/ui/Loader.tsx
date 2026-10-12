"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_REDUCED, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/components/providers/Intro";
import { useLenis } from "@/components/providers/SmoothScroll";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function imageReady(img: HTMLImageElement | null) {
  if (!img || img.complete) return Promise.resolve();
  return new Promise<void>((resolve) => {
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

/** Savor's butter-yellow curtain: it waits for fonts and the first hero frame, then lifts. */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const { done, finish } = useIntro();
  const lenis = useLenis();

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (done) lenis.start();
    else lenis.stop();
  }, [lenis, done]);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia(MOTION_REDUCED).matches;
    let cancelled = false;

    const ready = Promise.all([
      wait(reduced ? 0 : 700),
      document.fonts?.ready,
      imageReady(document.querySelector<HTMLImageElement>("[data-hero-first] img")),
    ]);

    Promise.race([ready, wait(3500)]).then(() => {
      if (cancelled) return;
      const release = () => {
        document.documentElement.classList.remove("is-loading");
        finish();
      };

      if (reduced) {
        release();
        gsap.to(el, { autoAlpha: 0, duration: 0.4, ease: "none", onComplete: () => setGone(true) });
        return;
      }

      gsap
        .timeline({ onComplete: () => setGone(true) })
        .to(el, { yPercent: -100, duration: 1.3, ease: "expo.inOut" })
        .call(release, [], 0.55);
    });

    return () => {
      cancelled = true;
    };
  });

  if (gone) return null;

  return <div ref={ref} aria-hidden className="fixed inset-0 z-[100] bg-butter" />;
}
