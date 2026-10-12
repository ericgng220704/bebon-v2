import type { Content } from "@/content/types";
import { FadeIn } from "@/components/motion/FadeIn";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { DashButton } from "@/components/ui/DashButton";

export function HowToOrder({ howToOrder, dmUrl }: { howToOrder: Content["howToOrder"]; dmUrl: string }) {
  return (
    <section id="order" data-nav="light" className="px-gutter pt-[12vh] pb-[16vh] md:pt-[16vh] md:pb-[22vh]">
      <div className="grid grid-cols-12 gap-x-[2rem] gap-y-12">
        <SplitReveal lines={howToOrder.title} lineClassNames={["", "pl-[0.9em]"]} className="col-span-12 text-display-l md:col-span-5" />

        <ol className="col-span-12 md:col-span-6 md:col-start-7 md:pt-[1.2vw]">
          {howToOrder.steps.map((step, i) => (
            <FadeIn key={step.title} as="li" delay={i * 0.08} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-t border-oxblood/15 py-6 md:grid-cols-[5rem_1fr] md:py-8">
              <span className="font-mono text-small opacity-60">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-display-s">{step.title}</h3>
                <p className="mt-2 max-w-[28em] text-body opacity-80">{step.body}</p>
              </div>
            </FadeIn>
          ))}
        </ol>
      </div>

      <FadeIn className="mt-[10vh] grid grid-cols-2 gap-x-[2rem] gap-y-8 border-y border-oxblood/15 py-8 md:grid-cols-4">
        {howToOrder.details.map((detail) => (
          <div key={detail.label}>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] opacity-60">{detail.label}</p>
            <p className="mt-2 font-display text-[clamp(1.6rem,2.4vw,2.3rem)] leading-none">{detail.value}</p>
          </div>
        ))}
      </FadeIn>

      <FadeIn className="mt-12 flex justify-start md:justify-end">
        <DashButton first={howToOrder.cta.first} second={howToOrder.cta.second} href={dmUrl} variant="oxblood" />
      </FadeIn>
    </section>
  );
}
