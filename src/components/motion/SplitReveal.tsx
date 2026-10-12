"use client";

import { useEffect, useRef, type ElementType } from "react";
import { gsap, MOTION_OK, MOTION_REDUCED, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/components/providers/Intro";
import { cn } from "@/lib/cn";

type Props = {
  lines: string[];
  as?: ElementType;
  className?: string;
  /** Per-line classes, used for Savor's staggered indents. */
  lineClassNames?: (string | undefined)[];
  /** "scroll" reveals on entering the viewport, "intro" waits for the loader to lift. */
  mode?: "scroll" | "intro";
  stagger?: number;
  delay?: number;
  start?: string;
};

/** A headline whose characters rise out of masked lines, like Savor's display type. */
export function SplitReveal({
  lines,
  as: Tag = "h2",
  className,
  lineClassNames,
  mode = "scroll",
  stagger = 0.022,
  delay = 0,
  start = "top 88%",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const played = useRef(false);
  const { done } = useIntro();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCED, () => {
        el.classList.add("is-split");
      });

      mm.add(MOTION_OK, () => {
        let split: SplitText | undefined;

        const create = () => {
          split ??= SplitText.create(el, {
            type: "lines,words,chars",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit(self) {
              el.classList.add("is-split");
              trigger.current?.kill();

              const t = gsap.from(self.chars, { yPercent: 118, stagger, delay, duration: 1.35, ease: "expo.out", paused: true });
              tween.current = t;

              if (played.current) {
                t.progress(1);
              } else if (mode === "scroll") {
                trigger.current = ScrollTrigger.create({
                  trigger: el,
                  start,
                  once: true,
                  onEnter: () => {
                    played.current = true;
                    t.play();
                  },
                });
              }
              return t;
            },
          });
        };

        // Splitting every headline up front is costly layout work, so wait until one is a screen away.
        const lazy = mode === "intro" ? undefined : ScrollTrigger.create({ trigger: el, start: "top bottom+=100%", once: true, onEnter: create });
        if (!lazy) create();

        return () => {
          lazy?.kill();
          trigger.current?.kill();
          split?.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  useEffect(() => {
    if (mode !== "intro" || !done) return;
    played.current = true;
    tween.current?.play();
  }, [done, mode]);

  return (
    <Tag ref={ref} data-split="" className={cn("font-display", className)}>
      {lines.map((line, i) => (
        <span key={i} className={cn("block", lineClassNames?.[i])}>
          {line}
        </span>
      ))}
    </Tag>
  );
}
