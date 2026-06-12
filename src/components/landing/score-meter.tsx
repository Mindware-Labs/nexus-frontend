"use client";

import { animate, m, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Barra de Score NEX para superficies oscuras. El relleno y el número
 * suben con la misma física spring; solo anima scaleX (transform) y
 * texto — cero reflow. Si `score` cambia, la barra re-interpola.
 */
export function ScoreMeter({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const progress = useMotionValue(0);
  const scaleX = useTransform(progress, [0, 100], [0, 1]);
  const rounded = useTransform(progress, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(progress, score, {
      type: "spring",
      stiffness: 90,
      damping: 20,
      mass: 1,
    });
    return () => controls.stop();
  }, [score, progress]);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <m.div
          style={{ scaleX, originX: 0 }}
          className="h-full w-full rounded-full bg-gradient-to-r from-[#AD74C3] to-[#34D399]"
        />
      </div>
      <span className="shrink-0 text-sm font-bold tabular-nums text-white">
        <m.span>{rounded}</m.span>
        <span className="text-[11px] font-normal text-white/45">/100</span>
      </span>
    </div>
  );
}
