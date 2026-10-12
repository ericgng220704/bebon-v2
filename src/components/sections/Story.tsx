"use client";

import Image from "next/image";
import { useRef } from "react";
import { story } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * The bubble's edge, in 0–1 box units: feet `w` apart at height `e`, crest (or dip) at height `c`.
 * With the feet on the floor it is a rising dome; once the feet climb past the crest the edge turns
 * into a valley, leaving a drop of cream at the top that finally shrinks away — Savor's bubble scroll.
 */
type Shape = { w: number; e: number; c: number };

const K = 0.5523;
const n = (value: number) => value.toFixed(4);

function bubblePath({ w, e, c }: Shape) {
  const xl = 0.5 - w / 2;
  const xr = 0.5 + w / 2;
  const rx = w / 2;
  const ry = e - c;
  return [
    `M-0.02,1.02 L-0.02,${n(e)} L${n(xl)},${n(e)}`,
    `C${n(xl)},${n(e - ry * K)} ${n(0.5 - rx * K)},${n(c)} 0.5,${n(c)}`,
    `C${n(0.5 + rx * K)},${n(c)} ${n(xr)},${n(e - ry * K)} ${n(xr)},${n(e)}`,
    `L1.02,${n(e)} L1.02,1.02 Z`,
  ].join(" ");
}

// Keyframes along one 0–1 progress value: dome rises, swells past the edges, turns to a valley, closes.
const KEYS: [number, Shape][] = [
  [0, { w: 0.42, e: 1, c: 1.03 }],
  [0.55, { w: 1.3, e: 1, c: 0.3 }],
  [0.82, { w: 0.7, e: -0.16, c: 0.22 }],
  [1, { w: 0.3, e: -0.16, c: -0.2 }],
];
const EASES = ["power1.out", "power1.inOut", "none"].map((ease) => gsap.parseEase(ease));

function shapeAt(progress: number): Shape {
  const p = gsap.utils.clamp(0, 1, progress);
  const i = Math.max(0, KEYS.findIndex(([at]) => at >= p) - 1);
  const [fromAt, from] = KEYS[i];
  const [toAt, to] = KEYS[i + 1];
  const t = EASES[i]((p - fromAt) / (toAt - fromAt));
  return { w: from.w + (to.w - from.w) * t, e: from.e + (to.e - from.e) * t, c: from.c + (to.c - from.c) * t };
}

// The bubble grows over two scroll ranges: while the section rises into view, then while it is pinned.
const BEFORE_PIN = KEYS[2][0];

export function Story() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const bubble = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const bubbleProgress = { before: 0, pinned: 0 };
      const draw = () => {
        const { before, pinned } = bubbleProgress;
        const p = pinned > 0 ? BEFORE_PIN + (1 - BEFORE_PIN) * pinned : BEFORE_PIN * before;
        bubble.current?.setAttribute("d", bubblePath(shapeAt(p)));
      };
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (context) => {
        const { desktop } = context.conditions as { desktop: boolean };
        draw();

        // 1. While the section rises into view, the dome swells and climbs the edges.
        gsap.fromTo(
          bubbleProgress,
          { before: 0 },
          { before: 1, ease: "none", onUpdate: draw, scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true } },
        );

        // 2. Pinned: the last drop of cream vanishes, then three groups of notes play over the scenes.
        gsap.set(q("[data-note]"), { autoAlpha: 0, y: 26 });
        gsap.set(q("[data-scene]"), { autoAlpha: (i: number) => (i === 0 ? 1 : 0) });
        gsap.set(q("[data-line]"), { scaleX: desktop ? 0 : 1, scaleY: desktop ? 1 : 0 });
        gsap.set(q("[data-arc]"), { clipPath: "inset(0% 100% 100% 0%)" });
        gsap.set(q("[data-dashes]"), { clipPath: "inset(0% 0% 100% 0%)" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: stage.current, start: "top top", end: "+=640%", pin: true, scrub: true },
        });

        const show = (selector: string, at: number, stagger = 0) =>
          tl.to(q(selector), { autoAlpha: 1, y: 0, duration: 0.6, stagger, ease: "power2.out" }, at);
        const leave = (group: string, at: number) =>
          tl.to(q(`[data-group="${group}"]`), { autoAlpha: 0, y: "-22vh", duration: 0.9, ease: "power1.in" }, at);
        const scene = (i: number, at: number) =>
          tl
            .to(q("[data-scene]")[i], { autoAlpha: 1, duration: 0.8 }, at)
            .fromTo(q("[data-scene] img")[i], { scale: 1.14 }, { scale: 1, duration: 3, ease: "none" }, at);

        tl.fromTo(bubbleProgress, { pinned: 0 }, { pinned: 1, duration: 0.9, onUpdate: draw }, 0)
          .set(canvas.current, { clipPath: "inset(0% 0% 0% 0%)" }, 0.9)
          .fromTo(q("[data-scene] img")[0], { scale: 1.14 }, { scale: 1, duration: 3 }, 0);

        // From brown butter ——— to flaky sea salt
        show('[data-note="from"]', 0.5);
        tl.to(q("[data-line]"), { scaleX: 1, scaleY: 1, duration: 0.9, ease: "power2.inOut" }, 0.9);
        show('[data-note="to"]', 1.6);
        tl.to(q("[data-arc]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power1.inOut" }, 2.1);
        scene(1, 2.5);
        show('[data-note="craft"]', 3.0);
        leave("one", 4.1);

        // Without preservatives / premixes / ...
        scene(2, 4.4);
        show('[data-note="without"]', 4.7);
        show('[data-note="without-item"]', 4.9, 0.18);
        leave("two", 6.5);

        // We're baking toward a future where there's more...
        scene(3, 6.8);
        show('[data-note="future"]', 7.1);
        tl.to(q("[data-dashes]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power1.inOut" }, 7.5);
        show('[data-note="more"]', 8.3, 0.12);
        show('[data-note="more-copy"]', 8.9, 0.25);

        // 3. The canvas folds into a framed picture and the page carries on.
        tl.to(q('[data-group="three"]'), { autoAlpha: 0, duration: 0.6 }, 10.1)
          .to(canvas.current, { clipPath: desktop ? "inset(15% 25% 15% 25%)" : "inset(20% 9% 20% 9%)", duration: 1.3, ease: "power2.inOut" }, 10.2)
          .to(q("[data-scene] img")[3], { scale: 1.12, duration: 1.3 }, 10.2)
          .to({}, { duration: 0.3 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const { from, craft, without, future } = story;

  return (
    <section id="story" ref={root} data-nav="dark" className="relative bg-cream">
      <div ref={stage} className="relative h-lvh overflow-hidden">
        <div ref={canvas} className="absolute inset-0 bg-cocoa text-cream [text-shadow:0_1px_14px_rgb(20_6_4/0.55)]" style={{ clipPath: "url(#story-bubble)" }}>
          {story.scenes.map((scene, i) => (
            <div key={i} data-scene="" className="absolute inset-0 overflow-hidden">
              <Image
                src={scene.src}
                alt={scene.alt}
                fill
                sizes="100vw"
                placeholder="blur"
                className="object-cover"
                style={{ objectPosition: scene.position }}
              />
            </div>
          ))}
          <div aria-hidden className="absolute inset-0 bg-[rgb(28_9_6/0.3)]" />

          {/* Group one: From brown butter ——— to flaky sea salt, then an arc down to the next line */}
          <div data-group="one" className="absolute top-[17%] left-1/2 -translate-x-1/2 text-note md:top-[30%] md:left-[10.5%] md:translate-x-0">
            <div className="flex flex-col items-center md:flex-row">
              <p data-note="from" className="whitespace-nowrap">
                {from.start}
              </p>
              <span data-line="" aria-hidden className="my-3 h-[17vh] w-px origin-top bg-cream/80 md:mx-[1.3vw] md:my-0 md:h-px md:w-[10vw] md:origin-left" />
              <div className="relative">
                <p data-note="to" className="whitespace-nowrap">
                  {from.end}
                </p>
                <svg
                  data-arc=""
                  aria-hidden
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute top-[calc(100%+0.7em)] right-1/2 h-[13vh] w-[30vw] -scale-x-100 overflow-visible md:right-auto md:left-[0.25em] md:h-[26vh] md:w-[20vw] md:scale-x-100"
                >
                  <path d="M0.5,0 C0.5,55 30,99.5 100,99.5" fill="none" stroke="currentColor" strokeOpacity="0.8" vectorEffect="non-scaling-stroke" />
                </svg>
                <p
                  data-note="craft"
                  className="absolute top-[calc(100%+0.7em+13vh-0.6em)] left-[calc(50%-30vw)] w-max md:top-[calc(100%+0.7em+26vh-0.7em)] md:left-[calc(0.25em+20vw+1.2vw)]"
                >
                  {craft[0]}
                  <br />
                  {craft[1]}
                </p>
              </div>
            </div>
          </div>

          {/* Group two: Without / preservatives / premixes / ... */}
          <div data-group="two" className="absolute top-[34%] left-[14%] flex gap-[1.6em] text-note md:top-[33%] md:left-[26.5%]">
            <p data-note="without">{without.lead}</p>
            <ul>
              {without.items.map((item) => (
                <li key={item} data-note="without-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Group three: a dashed line falls from the sentence into a stack of "more" */}
          <div data-group="three" className="absolute top-[16%] right-[8%] left-[9%] text-note md:top-[29%] md:right-auto md:left-[47.5%]">
            <p data-note="future" className="pl-[1.95em] md:max-w-none md:whitespace-nowrap">
              {future.lead}
            </p>
            <svg
              data-dashes=""
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="mt-[0.8em] ml-[2.1em] h-[19vh] w-[52vw] overflow-visible md:h-[22vh] md:w-[16vw]"
            >
              <path
                d="M99,0 C99,30 70,40 50,50 C28,61 1,70 1,100"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.85"
                strokeDasharray="5 5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="mt-[0.9em] grid grid-cols-[0.85em_auto_1fr] gap-x-[1.1em]">
              {Array.from({ length: 5 }, (_, i) => (
                <p key={i} data-note="more" className="col-start-2">
                  {future.more}
                </p>
              ))}
              <p data-note="more-copy" className="col-start-3 row-start-5 max-w-[11em]">
                {future.first}
              </p>
              <p data-note="more" className="col-start-1 row-start-6">
                &amp;
              </p>
              <p data-note="more" className="col-start-2 row-start-6">
                {future.more}
              </p>
              <p data-note="more-copy" className="col-start-3 row-start-6 max-w-[11em]">
                {future.last}
              </p>
            </div>
          </div>
        </div>
      </div>

      <svg aria-hidden className="absolute size-0">
        <defs>
          <clipPath id="story-bubble" clipPathUnits="objectBoundingBox">
            <path ref={bubble} d={bubblePath(KEYS[0][1])} />
          </clipPath>
        </defs>
      </svg>
    </section>
  );
}
