'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface Props {
  title: string
  children: React.ReactNode
}

export default function DashboardShell({ title, children }: Props) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      <header className="h-16 px-5 md:px-7 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20">
        <h1 className="font-heading font-semibold text-slate-100 text-base md:text-lg tracking-tight">
          {title}
        </h1>
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-teal-400/20 border border-teal-400/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-medium text-teal-400 font-mono">EA</span>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-5 md:space-y-6">
        {children}
      </main>
    </>
  )
}
