'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react'

/* Carrusel horizontal con scroll-snap nativo (táctil/trackpad), arrastre con
   ratón y botones prev/next. Los hijos definen su propio ancho y deben llevar
   `snap-center shrink-0`. */
export function SnapCarousel({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    updateEdges()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [updateEdges])

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: 'smooth' })
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = trackRef.current
    if (!el) return
    drag.current = {
      active: true,
      startX: e.clientX,
      startLeft: el.scrollLeft,
      moved: false,
    }
    el.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    const el = trackRef.current
    if (!el) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.startLeft - dx
  }

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    drag.current.active = false
    trackRef.current?.releasePointerCapture(e.pointerId)
  }

  /* Evita que el "click" dispare enlaces tras un arrastre. */
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }

  return (
    <div className="relative" role="region" aria-label={label}>
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 py-2 [touch-action:pan-y] md:cursor-grab md:active:cursor-grabbing"
      >
        {children}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 px-6 md:justify-end">
        <CarouselButton
          dir="left"
          disabled={atStart}
          onClick={() => scrollByPage(-1)}
        />
        <CarouselButton
          dir="right"
          disabled={atEnd}
          onClick={() => scrollByPage(1)}
        />
      </div>
    </div>
  )
}

function CarouselButton({
  dir,
  disabled,
  onClick,
}: {
  dir: 'left' | 'right'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'left' ? 'Anterior' : 'Siguiente'}
      className="liquid-glass grid size-12 place-items-center rounded-full text-foreground transition-opacity duration-200 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
    >
      {dir === 'left' ? (
        <ArrowLeft className="size-5" />
      ) : (
        <ArrowRight className="size-5" />
      )}
    </button>
  )
}
