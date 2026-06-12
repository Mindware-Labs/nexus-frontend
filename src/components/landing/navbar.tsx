"use client";

import {
  AnimatePresence,
  m,
  useScroll,
  useSpring,
} from "motion/react";
import { Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#casos-de-uso", label: "Casos de uso" },
  { href: "#demo", label: "Demo" },
  { href: "#precios", label: "Precios" },
];

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => scrollY.on("change", (y) => setScrolled(y > 24)), [scrollY]);

  /* Scroll-spy: resalta el enlace de la sección que cruza el centro
     del viewport; en el hero (ninguna visible) no se resalta nada. */
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const href = `#${entry.target.id}`;
          if (entry.isIntersecting) visible.add(href);
          else visible.delete(href);
        }
        const current = [...links]
          .reverse()
          .find((l) => visible.has(l.href));
        setActive(current ? current.href : null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        /* Entrada en CSS puro: visible desde el primer pintado */
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 motion-safe:animate-enter-down",
        scrolled
          ? "bg-[#3D1A4E]/50 shadow-lg shadow-nexus-deep/30 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      {/* Progreso de lectura */}
      <m.span
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-nexus-purple via-nexus-lavender to-nexus-mint"
      />
      {/* Hairline degradado inferior, solo con el glass activo */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-nexus-lavender/35 to-transparent transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="#" className="group flex items-center gap-2.5">
          <span className="relative grid size-8 place-items-center rounded-xl bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-lg shadow-nexus-lavender/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Sparkles className="size-4 text-white" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white drop-shadow-md">
            Mindware <span className="text-nexus-lavender drop-shadow-sm">Nexus</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender",
                  isActive
                    ? "text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                {isActive && (
                  <m.span
                    layoutId="nav-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }}
                    className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/15"
                  />
                )}
                <span className="relative">{l.label}</span>
              </a>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#contacto"
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-nexus-deep shadow-lg shadow-black/10 transition-[transform,background-color] duration-200 ease-out hover:scale-[1.04] hover:bg-nexus-lilac active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender"
          >
            Solicitar acceso
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-full text-white transition-transform duration-150 ease-out active:scale-90 md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
            }}
            transition={{ type: "spring", stiffness: 220, damping: 30 }}
            className="overflow-hidden border-t border-white/10 bg-nexus-deep/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    active === l.href
                      ? "bg-white/8 text-white"
                      : "text-white/80 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-white px-4 py-3 text-center text-sm font-medium text-nexus-deep"
              >
                Solicitar acceso
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
