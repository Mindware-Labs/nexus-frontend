"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/* Carga diferida del motor de animación (domMax: incluye layout/layoutId).
   Los componentes usan `m.` en vez de `motion.`, así el chunk inicial solo
   lleva el render estático; el motor llega en un chunk aparte tras hidratar.
   Las entradas above-the-fold son CSS puro, así que nada parpadea. */
const loadFeatures = () =>
  import("./motion-features").then((mod) => mod.default);

/* Desactiva las animaciones de transform (mantiene opacity) cuando el
   usuario tiene activado prefers-reduced-motion. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
