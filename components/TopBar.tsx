'use client'

import type { DateRange } from '@/lib/data'

interface TopBarProps {
  range: DateRange
  onRangeChange: (r: DateRange) => void
}

const ranges: { label: string; value: DateRange }[] = [
  { label: 'Last 7 days',  value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
]

export default function TopBar({ range, onRangeChange }: TopBarProps) {
  return (
    <header className="
      h-14 px-5 md:px-7
      flex items-center justify-between
      border-b border-slate-800
      bg-slate-900/80 backdrop-blur-sm
      sticky top-0 z-20
    ">
      <h1 className="font-heading font-semibold text-slate-400 text-sm tracking-tight">
        Dashboard overview
      </h1>

      <div className="flex items-center gap-3">
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

        <div
          aria-label="User"
          className="w-8 h-8 rounded-full bg-teal-400/20 border border-teal-400/30 flex items-center justify-center shrink-0"
        >
          <span className="text-xs font-medium text-teal-400 font-mono">EA</span>
        </div>
      </div>
    </header>
  )
}
