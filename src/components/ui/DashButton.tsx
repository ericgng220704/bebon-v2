"use client";

import type { MouseEvent } from "react";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/cn";

type Props = {
  first: string;
  second: string;
  href: string;
  variant?: "oat" | "oxblood" | "cream";
  className?: string;
};

const variants = {
  oat: "bg-oat text-oxblood hover:bg-oat-deep",
  cream: "bg-cream text-oxblood hover:bg-oat",
  oxblood: "bg-oxblood text-cream hover:bg-cocoa",
};

/** Savor's two-word button: "Watch —— Episode". On hover the dash folds away and the words meet. */
export function DashButton({ first, second, href, variant = "oat", className }: Props) {
  const scrollTo = useScrollTo();
  const external = /^https?:/.test(href);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#") && scrollTo(href)) event.preventDefault();
  };

  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group inline-flex h-[3.6em] items-center justify-center rounded-[4px] px-[2.6em] text-[0.9375rem] leading-none whitespace-nowrap",
        "transition-colors duration-500 ease-out-expo",
        variants[variant],
        className,
      )}
    >
      <span>{first}</span>
      <span
        aria-hidden
        className="mx-[0.55em] h-px w-[2.4em] bg-current transition-[width,margin] duration-700 ease-out-expo group-hover:mx-[0.14em] group-hover:w-0 group-focus-visible:mx-[0.14em] group-focus-visible:w-0"
      />
      <span>{second}</span>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
