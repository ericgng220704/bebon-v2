"use client";

import Lenis from "lenis";
import { useCallback, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// The single Lenis instance lives outside React; components subscribe to it.
let current: Lenis | null = null;
const listeners = new Set<() => void>();

const setCurrent = (lenis: Lenis | null) => {
  current = lenis;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function SmoothScroll({ children }: { children: ReactNode }) {
  // Web fonts change text heights, which moves every trigger below them.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, autoRaf: false });
    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setCurrent(lenis);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setCurrent(null);
    };
  }, []);

  return children;
}

export const useLenis = () =>
  useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );

/** Scrolls to an in-page anchor, smoothly when Lenis is running. */
export function useScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (href: string) => {
      const target = href.startsWith("#") ? document.querySelector<HTMLElement>(href) : null;
      if (!target) return false;
      if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), force: true });
      else target.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", href);
      return true;
    },
    [lenis],
  );
}
