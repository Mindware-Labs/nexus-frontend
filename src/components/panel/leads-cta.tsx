'use client'

import Link from 'next/link'
import { ArrowRight, Users } from 'lucide-react'

const SANS = "var(--font-hanken, 'Hanken Grotesk', system-ui, sans-serif)"

export function LeadsCta() {
  return (
    <Link
      href="/panel/leads?status=nuevo"
      className="group relative overflow-hidden rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: 'linear-gradient(135deg, #522566 0%, #3D1A4E 100%)',
        boxShadow: '0 4px 20px rgba(82,37,102,.28), inset 0 1px 0 rgba(255,255,255,.12)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.transform = 'translateY(-1px)'
        el.style.boxShadow = '0 8px 28px rgba(82,37,102,.38), inset 0 1px 0 rgba(255,255,255,.15)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = '0 4px 20px rgba(82,37,102,.28), inset 0 1px 0 rgba(255,255,255,.12)'
      }}
    >
      <div className="-right-4 -top-4 absolute size-20 rounded-full opacity-20"
        style={{ background: '#AD74C3', filter: 'blur(16px)' }} />

      <div className="flex size-8 items-center justify-center rounded-xl bg-white/15">
        <Users className="size-4 text-white" />
      </div>

      <p className="text-[12px] leading-relaxed text-white/75" style={{ fontFamily: SANS }}>
        Revisa los leads nuevos y muévelos por el pipeline.
      </p>

      <span className="flex items-center gap-1 text-[12px] font-bold text-white" style={{ fontFamily: SANS }}>
        Ver leads nuevos
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
