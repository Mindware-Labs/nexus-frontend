'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type NexusTheme = 'light' | 'dark'

interface ThemeCtx { theme: NexusTheme; toggle: () => void }

const Ctx = createContext<ThemeCtx>({ theme: 'light', toggle: () => {} })
export const useNexusTheme = () => useContext(Ctx)

export function NexusThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<NexusTheme>('light')

  useEffect(() => {
    try {
      const s = localStorage.getItem('nx-panel-theme') as NexusTheme | null
      if (s === 'light' || s === 'dark') setTheme(s)
    } catch {}
  }, [])

  function toggle() {
    setTheme(t => {
      const next: NexusTheme = t === 'light' ? 'dark' : 'light'
      try { localStorage.setItem('nx-panel-theme', next) } catch {}
      return next
    })
  }

  return (
    <Ctx.Provider value={{ theme, toggle }}>
      <div data-nexus-theme={theme} className="flex min-h-screen flex-col">
        {children}
      </div>
    </Ctx.Provider>
  )
}
