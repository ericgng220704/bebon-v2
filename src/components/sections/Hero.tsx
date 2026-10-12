"use client";

import { useRef, useState } from "react";
import { heroVideo } from "@/content/site";
import type { Content } from "@/content/types";
import { FadeIn } from "@/components/motion/FadeIn";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { DashButton } from "@/components/ui/DashButton";
import { Photo } from "@/components/ui/Photo";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/useMediaQuery";

const DESKTOP = "(min-width: 768px)";
const CUT_EVERY = 1.5;

export function Hero({ hero, dmUrl }: { hero: Content["hero"]; dmUrl: string }) {
  const root = useRef<HTMLElement>(null);
  const desktop = useMediaQuery(DESKTOP);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Phones get the portrait clip, wider screens the photo montage, reduced motion a single still.
  // Until the screen is known, only the first frame renders so phones don't fetch the whole reel.
  const layout = desktop === undefined ? "pending" : reduced ? "still" : desktop ? "montage" : "video";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        if (layout !== "montage") return;
        const frames = gsap.utils.toArray<HTMLElement>("[data-frame]");
        if (frames.length < 2) return;

        // Hard cuts with a slow push-in on each frame, like Savor's edited hero film.
        gsap.set(frames, { autoAlpha: 0 });
        const reel = gsap.timeline({ repeat: -1 });
        frames.forEach((frame, i) => {
          const at = i * CUT_EVERY;
          reel
            .set(frames, { autoAlpha: 0 }, at)
            .set(frame, { autoAlpha: 1 }, at)
            .fromTo(frame, { scale: 1.12 }, { scale: 1, duration: CUT_EVERY + 0.3, ease: "power1.out" }, at);
        });
      });

      mm.add(MOTION_OK, () => {
        gsap.to("[data-hero-media]", {
          yPercent: 22,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [layout], revertOnUpdate: true },
  );

  const frames = layout === "montage" ? hero.frames : hero.frames.slice(0, 1);

  return (
    <section id="top" ref={root} data-nav="dark" className="relative h-svh min-h-[34rem] overflow-hidden bg-oxblood text-cream">
      <div data-hero-media className="absolute inset-0 will-change-transform">
        {frames.map((frame, i) => (
          <div key={i} data-frame="" data-hero-first={i === 0 ? "" : undefined} className="absolute inset-0">
            <Photo picture={frame} alt={i === 0 ? frame.alt : ""} sizes="100vw" preload={i === 0} />
          </div>
        ))}

        {layout === "video" && <HeroVideo />}
      </div>

      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(20_6_4/0.62),rgb(20_6_4/0.08)_55%,rgb(20_6_4/0.28))]" />

      <div className="relative z-10 grid h-full grid-cols-12 content-end gap-x-[2rem] px-gutter pb-[clamp(1.75rem,5vh,3.5rem)]">
        <SplitReveal as="h1" mode="intro" lines={hero.title} stagger={0.028} delay={0.15} className="col-span-12 text-display-xl md:col-span-8" />

        <FadeIn afterIntro delay={0.7} className="col-span-12 mt-7 flex flex-col items-start gap-6 md:col-span-4 md:col-start-9 md:mt-0 md:pb-[0.4em]">
          <p className="max-w-[15em] text-note text-balance">{hero.intro}</p>
          <DashButton first={hero.cta.first} second={hero.cta.second} href={dmUrl} variant="oat" />
        </FadeIn>
      </div>
    </section>
  );
}

function HeroVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <video
      className="absolute inset-0 size-full object-cover transition-opacity duration-700"
      style={{ opacity: playing ? 1 : 0 }}
      src={heroVideo.src}
      poster={heroVideo.poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onPlaying={() => setPlaying(true)}
      aria-hidden
    />
  );
}
