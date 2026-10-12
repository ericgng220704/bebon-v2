"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { origin } from "@/content/site";
import { FadeIn } from "@/components/motion/FadeIn";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { DashButton } from "@/components/ui/DashButton";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/useMediaQuery";

const tiltSpring = { stiffness: 110, damping: 16, mass: 0.7 };

/** Savor's "Inspired by / Earth's blueprints": a staggered headline wrapped around a floating cookie. */
export function Origin() {
  const root = useRef<HTMLElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const tiltX = useSpring(useMotionValue(0), tiltSpring);
  const tiltY = useSpring(useMotionValue(0), tiltSpring);

  // The cookie leans toward the cursor, as if it were a real object on the page.
  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (reduced !== false || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    tiltY.set(((event.clientX - box.left) / box.width - 0.5) * 30);
    tiltX.set(-((event.clientY - box.top) / box.height - 0.5) * 22);
  };

  const untilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Spins in once, then floats and turns slowly with the scroll.
        gsap.from("[data-cookie-enter]", {
          autoAlpha: 0,
          scale: 0.6,
          rotation: -70,
          duration: 2,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-cookie-enter]", start: "top 88%", once: true },
        });

        const float = gsap.to("[data-cookie-float]", { y: -16, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? float.play() : float.pause()),
        });

        gsap.fromTo(
          "[data-cookie-spin]",
          { rotation: -30, yPercent: 12 },
          { rotation: 30, yPercent: -12, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav="light"
      onPointerMove={tilt}
      onPointerLeave={untilt}
      className="relative px-gutter pt-[14vh] pb-[18vh] md:pt-[24vh] md:pb-[26vh]"
    >
      <div className="grid grid-cols-12 gap-x-[2rem]">
        <div className="relative col-span-12 mx-auto w-[60vw] max-w-[21rem] perspective-[900px] md:col-span-3 md:col-start-5 md:row-start-1 md:w-[94%] md:max-w-none md:self-end">
          <motion.div style={{ rotateX: tiltX, rotateY: tiltY }}>
            <div data-cookie-enter="">
              {/* The shadow sits on a layer that never rotates, so the light stays put while the cookie turns. */}
              <div data-cookie-float="" className="drop-shadow-[0_34px_38px_rgb(55_8_8/0.22)]">
                <div data-cookie-spin="" className="relative aspect-square">
                  <Image
                    src={origin.image.src}
                    alt={origin.image.alt}
                    fill
                    sizes="(min-width: 768px) 24vw, 60vw"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <FadeIn className="col-span-12 mt-8 flex flex-col items-start gap-6 md:col-span-3 md:col-start-9 md:row-start-1 md:mt-0 md:self-end md:pb-[0.4em]">
          <p className="max-w-[24em] text-body">{origin.body}</p>
          <DashButton first={origin.cta.first} second={origin.cta.second} href={origin.cta.href} />
        </FadeIn>

        <SplitReveal
          lines={origin.title}
          lineClassNames={["", "pl-[12vw] md:pl-[24vw]"]}
          className="relative col-span-12 row-start-2 mt-10 text-display-l md:row-start-2 md:-mt-[0.95em]"
        />
      </div>
    </section>
  );
}
