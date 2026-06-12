"use client";

import { m, type Variants } from "motion/react";
import type { ReactNode } from "react";

/* Spring estándar de revelación: rápido y bien amortiguado (~0.45s de
   asentamiento). Un stiffness bajo se siente "flotante" y hace parecer
   que la página va con lag aunque corra a 120fps. */
export const revealSpring = {
  type: "spring",
  stiffness: 130,
  damping: 22,
  mass: 0.9,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...revealSpring, delay },
  }),
};

export function Reveal({
  children,
  delay = 0,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <m.div
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
    >
      {children}
    </m.div>
  );
}

export function RevealStagger({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: revealSpring },
      }}
    >
      {children}
    </m.div>
  );
}
