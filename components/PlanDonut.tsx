'use client'

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { DateRange } from '@/lib/data'
import { getPlanSplit } from '@/lib/data'

function fmt(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`
  return `$${v}`
}

interface CustomTooltipProps {
  active?: boolean
  payload?: { name: string; value: number; payload: { color: string } }[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{p.name}</p>
      <p className="tabular text-sm font-medium" style={{ color: p.payload.color }}>{fmt(p.value)}</p>
    </div>
  )
}

export default function PlanDonut({ range }: { range: DateRange }) {
  const data = getPlanSplit(range)
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="card p-5 md:p-6 flex flex-col">
      <h2 className="font-heading font-semibold text-slate-200 text-sm mb-5">Revenue by plan</h2>

      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={48} outerRadius={68}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="tabular text-xs text-slate-500">total</span>
            <span className="tabular text-sm font-semibold text-slate-200 mt-0.5">{fmt(total)}</span>
          </div>
        </div>

        {/* Legend */}
        <ul className="flex flex-col gap-3 flex-1 min-w-0">
          {data.map(d => {
            const pct = ((d.value / total) * 100).toFixed(1)
            return (
              <li key={d.name} className="flex items-center justify-between gap-2 min-w-0">
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: d.color }}
                  />
                  <span className="text-xs text-slate-400 truncate">{d.name}</span>
                </span>
                <span className="tabular text-xs text-slate-300 shrink-0">{pct}%</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
