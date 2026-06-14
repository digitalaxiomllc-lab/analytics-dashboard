'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import type { KPI } from '@/lib/data'

interface Props extends KPI {
  index: number
}

export default function KPICard({ label, value, change, invertColor, index }: Props) {
  const isPositive = change >= 0
  // For churn, a decrease is good (green); invertColor flips the visual
  const good = invertColor ? !isPositive : isPositive

  return (
    <div
      className="card p-5 flex flex-col gap-3 animate-fade-in"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>

      <p className="tabular text-2xl md:text-3xl font-semibold text-slate-50 leading-none">
        {value}
      </p>

      <div className={good ? 'pill-up' : 'pill-down'}>
        {good ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        <span className="tabular">{Math.abs(change)}%</span>
        <span className="font-sans font-normal text-[10px] opacity-70">vs prev</span>
      </div>
    </div>
  )
}
