"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { site } from "@/content/site";
import { useLenis, useScrollTo } from "@/components/providers/SmoothScroll";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { DashButton } from "./DashButton";

type Theme = "light" | "dark";

export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const scrollTo = useScrollTo();

  useGSAP(() => {
    // Each section declares data-nav="light" | "dark"; the bar takes the colour of whatever sits under it.
    gsap.utils.toArray<HTMLElement>("[data-nav]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 48px",
        end: "bottom 48px",
        refreshPriority: -1,
        onToggle: (self) => self.isActive && setTheme(section.dataset.nav as Theme),
      });
    });

    ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -1,
      onUpdate: (self) => setHidden(self.direction === 1 && self.scroll() > 160),
    });
  });

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [lenis, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    // Restart Lenis before scrolling: starting it afterwards would cancel the scroll.
    lenis?.start();
    setOpen(false);
    if (scrollTo(href)) event.preventDefault();
  };

  const tone = open ? "text-oxblood" : theme === "dark" ? "text-cream" : "text-oxblood";

  return (
    <>
      <motion.header
        ref={ref}
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn("fixed inset-x-0 top-0 z-50 transition-colors duration-500", tone)}
      >
        <nav aria-label="Main" className="flex items-start justify-between px-gutter pt-[clamp(0.9rem,1.6vw,1.6rem)]">
          <a
            href="#top"
            onClick={(event) => go(event, "#top")}
            className="font-logo text-[clamp(2.25rem,4.6vw,4.4rem)] leading-[0.8] tracking-[-0.03em]"
            aria-label="Bebon, back to top"
          >
            bebon
          </a>

          <ul className="hidden items-center gap-[1.6em] pt-1 text-small md:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={(event) => go(event, item.href)} className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-out-expo hover:after:origin-left hover:after:scale-x-100">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={site.instagram.dmUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-current px-3.5 py-1.5 transition-colors duration-300 hover:bg-current/10">
                Order
                <span className="sr-only"> on Instagram (opens in a new tab)</span>
              </a>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="pt-1 text-small md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: [0.87, 0, 0.13, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-oat px-gutter pt-28 pb-10 text-oxblood md:hidden"
          >
            <ul className="space-y-1">
              {site.nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.a
                    href={item.href}
                    onClick={(event) => go(event, item.href)}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1, delay: 0.25 + i * 0.06 }}
                    className="block font-display text-[3.4rem] leading-[1.05]"
                  >
                    {item.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <DashButton first="Order" second="on Instagram" href={site.instagram.dmUrl} variant="oxblood" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
