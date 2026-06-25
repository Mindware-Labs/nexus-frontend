'use client'

import { useRef, useState, useEffect, useTransition } from 'react'
import { Globe, Moon, Sun, Bell, LogOut, Settings, User, ChevronDown } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useNexusTheme } from '@/components/nexus-theme-provider'
import { logoutAction } from '@/app/actions/auth'

const SANS = "var(--font-hanken, 'Hanken Grotesk', system-ui, sans-serif)"
const MONO = "var(--font-geist-mono, ui-monospace, monospace)"

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('')
}

function IconBtn({ children, label, onClick }: {
  children: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-xl transition-colors"
      style={{ color: 'var(--nx-text-2)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--nx-surface-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  )
}

function UserDropdown({ userName, userEmail }: { userName: string; userEmail?: string }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)
  const ini = initials(userName)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors"
        style={{ fontFamily: SANS }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--nx-surface-2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Avatar */}
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #522566, #3D1A4E)' }}
        >
          {ini}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-[13px] font-semibold leading-tight" style={{ color: 'var(--nx-text)' }}>
            {userName}
          </p>
        </div>
        <ChevronDown
          className="size-3.5 transition-transform"
          style={{
            color: 'var(--nx-text-3)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-2xl border shadow-lg overflow-hidden z-50"
          style={{
            background: 'var(--nx-surface)',
            borderColor: 'var(--nx-border)',
            boxShadow: '0 8px 32px rgba(82,37,102,.12)',
          }}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--nx-border)' }}>
            <div className="flex items-center gap-3">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #522566, #3D1A4E)' }}
              >
                {ini}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--nx-text)' }}>
                  {userName}
                </p>
                {userEmail && (
                  <p className="text-[11px] truncate" style={{ color: 'var(--nx-text-3)', fontFamily: MONO }}>
                    {userEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            <DropdownItem icon={<User className="size-4" />} label="Mi perfil" onClick={() => setOpen(false)} />
            <DropdownItem icon={<Settings className="size-4" />} label="Configuración" onClick={() => setOpen(false)} />
            <div className="my-1 h-px" style={{ background: 'var(--nx-border)' }} />
            <button
              disabled={isPending}
              onClick={() => { startTransition(() => logoutAction()); setOpen(false) }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors disabled:opacity-50"
              style={{ color: '#FB7185', fontFamily: SANS }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FFE4E8')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut className="size-4" />
              {isPending ? 'Cerrando...' : 'Cerrar sesión'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DropdownItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors"
      style={{ color: 'var(--nx-text-2)', fontFamily: SANS }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--nx-surface-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {icon}
      {label}
    </button>
  )
}

export function NexusPanelHeader({ userName, userEmail }: { userName: string; userEmail?: string }) {
  const { theme, toggle } = useNexusTheme()

  return (
    <header
      className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b px-4"
      style={{
        fontFamily: SANS,
        background: 'var(--nx-surface)',
        borderColor: 'var(--nx-border)',
        boxShadow: 'var(--nx-shadow)',
      }}
    >
      <SidebarTrigger
        aria-label="Toggle sidebar"
        className="size-9 rounded-xl transition-colors"
        style={{ color: 'var(--nx-text-2)' }}
      />

      <span className="h-5 w-px" style={{ background: 'var(--nx-border)' }} />

      {/* Page title / breadcrumb area */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-0.5">
        <IconBtn label="Idioma"><Globe className="size-4" /></IconBtn>

        <IconBtn
          label={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
          onClick={toggle}
        >
          {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </IconBtn>

        {/* Bell with dot */}
        <div className="relative">
          <IconBtn label="Notificaciones"><Bell className="size-4" /></IconBtn>
          <span
            className="absolute right-2 top-2 size-1.5 rounded-full"
            style={{ background: '#34D399' }}
          />
        </div>

        <span className="mx-1 h-5 w-px" style={{ background: 'var(--nx-border)' }} />

        <UserDropdown userName={userName} userEmail={userEmail} />
      </div>
    </header>
  )
}
