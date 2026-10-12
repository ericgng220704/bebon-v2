"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useState, type PointerEvent } from "react";
import { categories, formatPrice } from "@/content/cookies";
import type { Box, Content, Cookie, CookieCategory } from "@/content/types";
import { FadeIn } from "@/components/motion/FadeIn";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { DashButton } from "@/components/ui/DashButton";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";

const spring = { stiffness: 260, damping: 28, mass: 0.6 };

type Props = { menu: Content["menu"]; cookies: Cookie[]; boxes: Box[]; dmUrl: string };

export function Menu({ menu: menuIntro, cookies, boxes, dmUrl }: Props) {
  const [filter, setFilter] = useState<CookieCategory | "all">("all");
  const [hovered, setHovered] = useState<Cookie | null>(null);
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  const visible = filter === "all" ? cookies : cookies.filter((cookie) => cookie.category === filter);

  const follow = (event: PointerEvent) => {
    x.set(event.clientX);
    y.set(event.clientY);
  };

  // Start the preview under the cursor instead of springing in from the corner.
  const enter = (event: PointerEvent) => {
    x.jump(event.clientX);
    y.jump(event.clientY);
  };

  return (
    <section id="menu" data-nav="light" className="relative px-gutter py-[14vh] md:py-[20vh]">
      <header className="grid grid-cols-12 items-end gap-x-[2rem] gap-y-8">
        <SplitReveal lines={[menuIntro.title]} className="col-span-12 text-display-l md:col-span-7" />
        <FadeIn className="col-span-12 md:col-span-4 md:col-start-9 md:pb-[0.5em]">
          <p className="max-w-[26em] text-body">{menuIntro.body}</p>
        </FadeIn>
      </header>

      <FadeIn className="mt-[8vh] flex flex-wrap gap-2" delay={0.1}>
        <div role="group" aria-label="Filter cookies" className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = filter === category.value;
            return (
              <button
                key={category.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(category.value)}
                className={cn(
                  "relative rounded-full border border-oxblood/25 px-4 py-2 text-small transition-colors duration-300",
                  active ? "text-cream" : "hover:border-oxblood/60",
                )}
              >
                {active && <motion.span layoutId="menu-filter" className="absolute inset-0 rounded-full bg-oxblood" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                <span className="relative">{category.label}</span>
              </button>
            );
          })}
        </div>
      </FadeIn>

      <ul className="mt-8 border-t border-oxblood/15" onPointerEnter={enter} onPointerMove={follow} onPointerLeave={() => setHovered(null)}>
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((cookie, i) => (
            <motion.li
              key={cookie._id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
              transition={{ duration: 0.7, delay: i * 0.03 }}
              onPointerEnter={() => setHovered(cookie)}
              className="group border-b border-oxblood/15"
            >
              <CookieRow cookie={cookie} index={cookies.indexOf(cookie)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Cursor-following preview, only where there is a real cursor */}
      <motion.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-30 hidden md:pointer-fine:block" style={{ x, y }}>
        <AnimatePresence>
          {hovered?.image && (
            <motion.div
              key={hovered._id}
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
              transition={{ duration: 0.6 }}
              className="absolute -top-[9rem] left-6 h-[18rem] w-[14.5rem] overflow-hidden rounded-[4px] bg-oat shadow-[0_30px_60px_-30px_rgb(55_8_8/0.5)]"
            >
              <Photo picture={hovered.image} alt="" sizes="232px" blur={false} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-[14vh] grid grid-cols-12 gap-x-[2rem] gap-y-10">
        <SplitReveal lines={[menuIntro.boxesTitle]} className="col-span-12 text-display-m md:col-span-4" />
        <ul className="col-span-12 grid gap-3 sm:grid-cols-3 md:col-span-8">
          {boxes.map((box, i) => (
            <FadeIn
              key={box._id}
              as="li"
              delay={i * 0.08}
              className="flex h-full flex-col justify-between gap-10 rounded-[4px] bg-oat p-6 md:min-h-[17rem]"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-[clamp(4rem,7vw,6.5rem)] leading-[0.8]">{box.count}</span>
                <span className="font-mono text-small">{formatPrice(box.price)}</span>
              </div>
              <div>
                <p className="font-display text-[1.75rem] leading-none">{box.name}</p>
                <p className="mt-2 text-small opacity-70">{box.note}</p>
              </div>
            </FadeIn>
          ))}
        </ul>
      </div>

      <FadeIn className="mt-[10vh] flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[28em] text-note">{menuIntro.ctaLead}</p>
        <DashButton first={menuIntro.cta.first} second={menuIntro.cta.second} href={dmUrl} variant="oxblood" />
      </FadeIn>
    </section>
  );
}

function CookieRow({ cookie, index }: { cookie: Cookie; index: number }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-4 py-5 transition-[padding] duration-700 ease-out-expo md:grid-cols-12 md:gap-x-[2rem] md:py-7 pointer-fine:md:group-hover:pl-4",
      )}
    >
      <div className={cn("relative aspect-square overflow-hidden rounded-[3px] bg-oat md:hidden", cookie.soldOut && "opacity-60 grayscale")}>
        {cookie.image && <Photo picture={cookie.image} alt="" sizes="72px" blur={false} />}
      </div>
      <span className="hidden font-mono text-small opacity-60 md:col-span-1 md:block">{String(index + 1).padStart(2, "0")}</span>

      <div className="min-w-0 md:col-span-5">
        <h3 className="font-display text-display-s">
          <span className={cn(cookie.soldOut && "line-through decoration-1 opacity-60")}>{cookie.name}</span>
        </h3>
        <p className="mt-1.5 text-small opacity-70 md:hidden">{cookie.notes.join(" · ")}</p>
      </div>

      <div className="hidden md:col-span-4 md:block">
        <p className="text-small opacity-70">{cookie.notes.join(" · ")}</p>
        <p className="mt-1 max-w-[30em] text-small">{cookie.description}</p>
      </div>

      <div className="flex flex-col items-end gap-1 md:col-span-2">
        <span className="font-mono text-small">{formatPrice(cookie.price)}</span>
        {cookie.soldOut && <span className="rounded-full bg-butter px-2 py-0.5 text-[0.6875rem] whitespace-nowrap">Sold out</span>}
        {!cookie.soldOut && cookie.category === "seasonal" && <span className="text-[0.6875rem] uppercase tracking-[0.12em] opacity-60">Seasonal</span>}
      </div>
    </div>
  );
}
