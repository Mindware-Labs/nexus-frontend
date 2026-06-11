import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("mx-auto max-w-3xl text-center", className)}>
      <span
        className={cn(
          "text-xs font-medium uppercase tracking-[0.2em]",
          dark ? "text-nexus-lavender" : "text-nexus-purple",
        )}
      >
        {eyebrow}
      </span>
      <h2
        className={cn(
          "mt-3 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl",
          dark ? "text-white" : "text-nexus-ink",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-balance text-lg leading-relaxed",
            dark ? "text-white/60" : "text-nexus-ink/60",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
