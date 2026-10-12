"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useIntro } from "@/components/providers/Intro";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Wait for the loader instead of the viewport (used in the hero). */
  afterIntro?: boolean;
  as?: "div" | "li";
};

const hidden = { opacity: 0, y: 28 };
const shown = { opacity: 1, y: 0 };

/** Soft rise-and-fade used for copy and buttons around the big headlines. */
export function FadeIn({ children, className, delay = 0, afterIntro = false, as = "div" }: Props) {
  const { done } = useIntro();
  const Tag = as === "li" ? motion.li : motion.div;

  if (afterIntro) {
    return (
      <Tag className={className} initial={hidden} animate={done ? shown : hidden} transition={{ duration: 1.2, delay }}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, delay }}
    >
      {children}
    </Tag>
  );
}
