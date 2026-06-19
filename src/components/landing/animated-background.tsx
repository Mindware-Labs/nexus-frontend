"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse position for parallax
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    setMounted(true);

    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [mouseX, mouseY]);

  // Parallax transforms for 3 depth layers
  const x1 = useTransform(smoothX, [-1, 1], [-15, 15]);
  const y1 = useTransform(smoothY, [-1, 1], [-15, 15]);

  const x2 = useTransform(smoothX, [-1, 1], [-35, 35]);
  const y2 = useTransform(smoothY, [-1, 1], [-35, 35]);

  const x3 = useTransform(smoothX, [-1, 1], [-60, 60]);
  const y3 = useTransform(smoothY, [-1, 1], [-60, 60]);

  interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    layer: number;
    color: string;
    duration: number;
    baseOpacity: number;
    delay: number;
  }

  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate more stars because they are now spread across a 200% x 200% container
    const generatedStars = Array.from({ length: 700 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1, // 1 to 3px
      layer: Math.floor(Math.random() * 3) + 1, // Layers 1, 2, 3
      color:
        Math.random() > 0.85
          ? "#ad74c3"
          : Math.random() > 0.85
            ? "#34d399"
            : "#ffffff",
      duration: Math.random() * 3 + 2,
      baseOpacity: Math.random() * 0.4 + 0.1,
      delay: Math.random() * 2,
    }));
    setStars(generatedStars);
  }, []);

  if (!mounted)
    return <div className="absolute inset-0 overflow-hidden bg-[#020005]" />;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#020005]">
      {/* Nebulas / Galaxies (Animated with both slow drift and mouse parallax) */}
      <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] animate-[drift-1_24s_ease-in-out_infinite_alternate]">
        <motion.div
          style={{ x: x1, y: y1 }}
          className="w-full h-full rounded-full bg-nexus-deep/60 blur-[120px] mix-blend-screen"
        />
      </div>

      <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] animate-[drift-2_30s_ease-in-out_infinite_alternate]">
        <motion.div
          style={{ x: x2, y: y2 }}
          className="w-full h-full rounded-full bg-nexus-lavender/20 blur-[100px] mix-blend-screen"
        />
      </div>

      <div className="absolute -bottom-[30%] left-[20%] w-[80%] h-[80%] animate-[drift-3_20s_ease-in-out_infinite_alternate]">
        <motion.div
          style={{ x: x3, y: y3 }}
          className="w-full h-full rounded-full bg-nexus-purple/30 blur-[150px] mix-blend-screen"
        />
      </div>

      {/* Stars/Particles Layers */}
      {[1, 2, 3].map((layer) => {
        const xTransform = layer === 1 ? x1 : layer === 2 ? x2 : x3;
        const yTransform = layer === 1 ? y1 : layer === 2 ? y2 : y3;

        // Different rotation speed and direction for each layer to create deep galactic movement
        const rotationDuration = layer === 1 ? 500 : layer === 2 ? 350 : 250;
        const rotationDirection = layer === 2 ? -360 : 360;

        return (
          <motion.div
            key={`layer-${layer}`}
            style={{ x: xTransform, y: yTransform }}
            className="absolute inset-0"
          >
            <motion.div
              animate={{ rotate: rotationDirection }}
              transition={{
                duration: rotationDuration,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-[-50%] h-[200%] w-[200%]"
            >
              {stars
                .filter((s) => s.layer === layer)
                .map((star) => (
                  <motion.div
                    key={star.id}
                    initial={{ opacity: star.baseOpacity }}
                    animate={{
                      opacity: [
                        star.baseOpacity,
                        star.baseOpacity + 0.6,
                        star.baseOpacity,
                      ],
                    }}
                    transition={{
                      duration: star.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: star.delay,
                    }}
                    style={{
                      position: "absolute",
                      left: `${star.x}%`,
                      top: `${star.y}%`,
                      width: star.size,
                      height: star.size,
                      backgroundColor: star.color,
                      borderRadius: "50%",
                    }}
                  />
                ))}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
