'use client'

import DashboardShell from '@/components/DashboardShell'
import { TrendingUp } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

// ── Data ──────────────────────────────────────────────────────────────────────
const revTrend = [
  { month: 'Jan', actual: 218000, forecast: 195000 },
  { month: 'Feb', actual: 234000, forecast: 218000 },
  { month: 'Mar', actual: 241000, forecast: 238000 },
  { month: 'Apr', actual: 268000, forecast: 252000 },
  { month: 'May', actual: 312000, forecast: 278000 },
  { month: 'Jun', actual: 357000, forecast: 305000 },
]

const tierRevenue = [
  { month: 'Jan', Free: 7200,  Pro: 68000,  Enterprise: 142800 },
  { month: 'Feb', Free: 7800,  Pro: 74000,  Enterprise: 152200 },
  { month: 'Mar', Free: 8100,  Pro: 79000,  Enterprise: 153900 },
  { month: 'Apr', Free: 8800,  Pro: 86000,  Enterprise: 173200 },
  { month: 'May', Free: 9400,  Pro: 98000,  Enterprise: 204600 },
  { month: 'Jun', Free: 9600,  Pro: 116000, Enterprise: 231400 },
]

const kpis = [
  { label: 'MRR',            value: '$357,000', change: +14.4 },
  { label: 'ARR',            value: '$4.28M',   change: +22.3 },
  { label: 'ARPU',           value: '$249.30',  change: +5.1  },
  { label: 'Revenue Growth', value: '+22.3%',   change: +4.6  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}k`
  return `$${v}`
}

interface TTProps {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}
function ChartTip({ active, payload, label }: TTProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="tabular font-medium" style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RevenuePage() {
  return (
    <DashboardShell title="Revenue">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div
            key={k.label}
            className="card p-5 flex flex-col gap-3 animate-fade-in"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          >
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{k.label}</p>
            <p className="tabular text-2xl md:text-3xl font-semibold text-slate-50 leading-none">{k.value}</p>
            <span className="pill-up">
              <TrendingUp size={11} />
              <span className="tabular">{k.change}%</span>
              <span className="font-sans font-normal text-[10px] opacity-70">vs prev</span>
            </span>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div className="card p-5 md:p-6">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-heading font-semibold text-slate-200 text-sm">Monthly revenue trend</h2>
          <span className="text-xs text-slate-500">YTD 2026 · actual vs. forecast</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={revTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#2DD4BF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-ibm-plex-mono)' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-ibm-plex-mono)' }}
              axisLine={false} tickLine={false} width={52}
            />
            <Tooltip content={<ChartTip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8', paddingTop: 16 }} iconType="circle" iconSize={7} />
            <Area
              type="monotone" dataKey="actual" name="Actual"
              stroke="#2DD4BF" strokeWidth={2} fill="url(#revGrad2)"
              dot={false} activeDot={{ r: 4, fill: '#2DD4BF' }}
            />
            <Area
              type="monotone" dataKey="forecast" name="Forecast"
              stroke="#818CF8" strokeWidth={1.5} strokeDasharray="4 3" fill="none"
              dot={false} activeDot={{ r: 3, fill: '#818CF8' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue by tier — stacked bar */}
      <div className="card p-5 md:p-6">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-heading font-semibold text-slate-200 text-sm">Revenue by plan tier</h2>
          <span className="text-xs text-slate-500">stacked monthly</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={tierRevenue} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-ibm-plex-mono)' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-ibm-plex-mono)' }}
              axisLine={false} tickLine={false} width={52}
            />
            <Tooltip content={<ChartTip />} cursor={{ fill: '#1E293B' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8', paddingTop: 16 }} iconType="circle" iconSize={7} />
            <Bar dataKey="Enterprise" name="Enterprise" stackId="a" fill="#2DD4BF" />
            <Bar dataKey="Pro"        name="Pro"        stackId="a" fill="#818CF8" />
            <Bar dataKey="Free"       name="Free"       stackId="a" fill="#334155" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardShell>
  )
}
