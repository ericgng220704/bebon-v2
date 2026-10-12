"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { IntroProvider } from "./Intro";
import { SmoothScroll } from "./SmoothScroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
      <SmoothScroll>
        <IntroProvider>{children}</IntroProvider>
      </SmoothScroll>
    </MotionConfig>
  );
}
