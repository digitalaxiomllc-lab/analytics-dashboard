'use client'

import { Moon, Sun, HelpCircle } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import type { DateRange } from '@/lib/data'

interface TopBarProps {
  range: DateRange
  onRangeChange: (r: DateRange) => void
  onStartTour: () => void
}

const ranges: { label: string; value: DateRange }[] = [
  { label: 'Last 7 days',  value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
]

export default function TopBar({ range, onRangeChange, onStartTour }: TopBarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="
      h-16 px-5 md:px-7
      flex items-center justify-between
      border-b border-slate-800
      bg-slate-900/80 backdrop-blur-sm
      sticky top-0 z-20
    ">
      {/* Page title */}
      <h1 className="font-heading font-semibold text-slate-100 text-base md:text-lg tracking-tight">
        Overview
      </h1>

      <div className="flex items-center gap-3">
        {/* Date range selector */}
        <div
          data-tour="date-range"
          role="group"
          aria-label="Date range"
          className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 gap-0.5"
        >
          {ranges.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onRangeChange(value)}
              aria-pressed={range === value}
              className={`
                px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150
                focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none
                ${range === value
                  ? 'bg-slate-700 text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
                }
              `}
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{value}d</span>
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="
              w-8 h-8 flex items-center justify-center rounded-lg
              text-slate-400 hover:text-slate-200 hover:bg-slate-800
              transition-colors duration-150
              focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none
            "
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}

        {/* Tour trigger — always teal so it's discoverable */}
        <button
          onClick={onStartTour}
          aria-label="Replay product tour"
          title="Replay tour"
          className="
            w-8 h-8 flex items-center justify-center rounded-lg
            text-teal-400/70 hover:text-teal-300 hover:bg-teal-400/10
            border border-teal-400/20 hover:border-teal-400/40
            transition-all duration-150
            focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none
          "
        >
          <HelpCircle size={16} />
        </button>

        {/* Avatar */}
        <div
          aria-label="User menu"
          className="w-8 h-8 rounded-full bg-teal-400/20 border border-teal-400/30 flex items-center justify-center shrink-0"
        >
          <span className="text-xs font-medium text-teal-400 font-mono">EA</span>
        </div>
      </div>
    </header>
  )
}
