import { occasions } from "@/content/site";
import { FadeIn } from "@/components/motion/FadeIn";
import { SplitReveal } from "@/components/motion/SplitReveal";

// Savor lines up press logos here; each occasion gets its own type treatment so the grid reads the same way.
const treatments = [
  "font-display italic text-[clamp(2rem,3vw,2.9rem)]",
  "font-mono uppercase tracking-[0.22em] text-[0.95rem] font-medium",
  "font-logo text-[clamp(1.7rem,2.4vw,2.3rem)] tracking-[-0.02em]",
  "font-sans font-semibold tracking-[-0.04em] text-[clamp(1.45rem,2vw,1.9rem)]",
  "font-display text-[clamp(2rem,3vw,2.9rem)] lowercase",
  "font-sans font-black uppercase tracking-[-0.03em] text-[clamp(1.3rem,1.8vw,1.7rem)]",
  "font-mono text-[1.05rem] tracking-[-0.02em]",
  "font-display italic text-[clamp(2rem,3vw,2.9rem)]",
];

export function Occasions() {
  return (
    <section data-nav="light" className="px-gutter py-[14vh] text-center md:py-[18vh]">
      <SplitReveal lines={[occasions.title]} className="mx-auto text-display-m" />
      <ul className="mx-auto mt-[9vh] grid max-w-[78rem] grid-cols-2 items-center gap-y-[6vh] md:grid-cols-4 md:gap-y-[9vh]">
        {occasions.items.map((item, i) => (
          <FadeIn key={item} as="li" delay={(i % 4) * 0.07} className={`px-2 leading-none ${treatments[i % treatments.length]}`}>
            {item}
          </FadeIn>
        ))}
      </ul>
    </section>
  );
}
