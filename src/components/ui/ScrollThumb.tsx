"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

const THUMB = 56;
const PAD = 6;

/** Savor's slim custom scrollbar: a small pill on the right edge that you can also drag. */
export function ScrollThumb() {
  const thumb = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; startScroll: number } | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("has-scroll-thumb");
    return () => document.documentElement.classList.remove("has-scroll-thumb");
  }, []);

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (!thumb.current) return;
        const travel = window.innerHeight - THUMB - PAD * 2;
        thumb.current.style.transform = `translate3d(0, ${self.progress * travel}px, 0)`;
      },
    });
  });

  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startY: event.clientY, startScroll: window.scrollY };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const travel = window.innerHeight - THUMB - PAD * 2;
    const target = drag.current.startScroll + ((event.clientY - drag.current.startY) / travel) * maxScroll();
    if (lenis) lenis.scrollTo(target, { immediate: true });
    else window.scrollTo(0, target);
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <div aria-hidden className="pointer-events-none fixed top-0 right-0 z-40 hidden h-svh w-3 pointer-fine:block">
      <div
        ref={thumb}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="pointer-events-auto absolute right-[3px] w-[5px] cursor-grab touch-none rounded-full bg-[#8d7f76]/70 active:cursor-grabbing"
        style={{ top: PAD, height: THUMB }}
      />
    </div>
  );
}
