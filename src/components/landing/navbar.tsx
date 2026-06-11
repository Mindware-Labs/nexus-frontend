"use client";

import {
  AnimatePresence,
  motion,
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
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => scrollY.on("change", (y) => setScrolled(y > 24)), [scrollY]);

  return (
    <header
      className={cn(
        /* Entrada en CSS puro: visible desde el primer pintado */
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 motion-safe:animate-enter-down",
        scrolled
          ? "border-b border-[#AD74C3]/10 bg-[#3D1A4E]/50 shadow-lg shadow-nexus-deep/30 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {/* Progreso de lectura */}
      <motion.span
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-nexus-purple via-nexus-lavender to-nexus-mint"
      />
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="#" className="group flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-lg shadow-nexus-lavender/30 transition-transform duration-300 group-hover:scale-110">
            <Sparkles className="size-4 text-white" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white drop-shadow-md">
            Mindware <span className="text-nexus-lavender drop-shadow-sm">Nexus</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors duration-200 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender"
            >
              {l.label}
            </a>
          ))}
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
          <motion.div
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
                  className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
