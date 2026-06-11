"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/* Desactiva las animaciones de transform (mantiene opacity) cuando el
   usuario tiene activado prefers-reduced-motion. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
