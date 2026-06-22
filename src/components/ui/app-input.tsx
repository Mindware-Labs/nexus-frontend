"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  endIcon?: React.ReactNode;
}

export function AppInput({ label, error, endIcon, className, id, ...rest }: AppInputProps) {
  const [mouseX, setMouseX] = useState(0);
  const [hovering, setHovering] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect) setMouseX(e.clientX - rect.left);
  }

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-white/60"
          style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}
        >
          {label}
        </label>
      )}

      <div
        ref={wrapRef}
        className="relative w-full"
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <input
          id={id}
          className={cn(
            "peer relative z-10 h-12 w-full rounded-lg border-2 bg-white/[0.04] px-4 text-sm text-white outline-none",
            "placeholder:font-medium placeholder:text-white/25 transition-all duration-200",
            "focus:bg-white/[0.07]",
            "disabled:cursor-not-allowed disabled:opacity-40",
            error
              ? "border-nexus-coral/60 focus:border-nexus-coral/80"
              : "border-white/10 focus:border-nexus-lavender/50",
            endIcon && "pr-11",
            className,
          )}
          style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}
          {...rest}
        />

        {/* Mouse-tracked border glow */}
        {hovering && !error && (
          <>
            <div
              className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-[2px] overflow-hidden rounded-t-lg"
              style={{
                background: `radial-gradient(30px circle at ${mouseX}px 0px, #AD74C3 0%, transparent 70%)`,
              }}
            />
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[2px] overflow-hidden rounded-b-lg"
              style={{
                background: `radial-gradient(30px circle at ${mouseX}px 2px, #AD74C3 0%, transparent 70%)`,
              }}
            />
          </>
        )}

        {endIcon && (
          <div className="absolute right-3 top-1/2 z-20 -translate-y-1/2">
            {endIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-nexus-coral">{error}</p>
      )}
    </div>
  );
}
