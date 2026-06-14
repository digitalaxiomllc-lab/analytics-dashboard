'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import type { DateRange } from '@/lib/data'
import { getRevenueData } from '@/lib/data'

function fmt(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`
  return `$${v}`
}

interface CustomTooltipProps {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="tabular text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function RevenueChart({ range }: { range: DateRange }) {
  const data = getRevenueData(range)

  return (
    <div className="card p-5 md:p-6">
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="font-heading font-semibold text-slate-200 text-sm">Revenue over time</h2>
        <span className="text-xs text-slate-500">vs. target</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2DD4BF" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="tgtGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#818CF8" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-ibm-plex-mono)' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-ibm-plex-mono)' }}
            axisLine={false} tickLine={false} width={52}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: '#94A3B8', paddingTop: 16 }}
            iconType="circle" iconSize={7}
          />
          <Area type="monotone" dataKey="revenue" name="Revenue"
            stroke="#2DD4BF" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#2DD4BF' }}
          />
          <Area type="monotone" dataKey="target" name="Target"
            stroke="#818CF8" strokeWidth={1.5} strokeDasharray="4 3" fill="url(#tgtGrad)" dot={false} activeDot={{ r: 3, fill: '#818CF8' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
