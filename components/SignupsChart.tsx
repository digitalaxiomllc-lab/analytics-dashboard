'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { DateRange } from '@/lib/data'
import { getSignupsData } from '@/lib/data'

interface CustomTooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="tabular text-sm font-medium text-teal-400">{payload[0].value.toLocaleString()} signups</p>
    </div>
  )
}

export default function SignupsChart({ range }: { range: DateRange }) {
  const data = getSignupsData(range)
  const max = Math.max(...data.map(d => d.signups))

  return (
    <div className="card p-5 md:p-6">
      <h2 className="font-heading font-semibold text-slate-200 text-sm mb-5">New signups</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-ibm-plex-mono)' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-ibm-plex-mono)' }}
            axisLine={false} tickLine={false} width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1E293B' }} />
          <Bar dataKey="signups" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.signups === max ? '#2DD4BF' : '#334155'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
