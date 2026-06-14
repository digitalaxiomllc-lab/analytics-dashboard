'use client'

import DashboardShell from '@/components/DashboardShell'
import { TrendingUp, TrendingDown } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

// ── Data ──────────────────────────────────────────────────────────────────────
const kpis = [
  { label: 'Total Customers', value: '1,432',  change: +14.8, up: true  },
  { label: 'New This Month',  value: '+106',    change: +8.2,  up: true  },
  { label: 'Net Rev Retention', value: '118%', change: +3.1,  up: true  },
  { label: 'Monthly Churn',   value: '0.88%',  change: -0.21, up: false, invertColor: true },
]

const growth = [
  { month: 'Jan', customers: 987,  new: 108, churned: 12 },
  { month: 'Feb', customers: 1082, new: 119, churned: 24 },
  { month: 'Mar', customers: 1165, new: 101, churned: 18 },
  { month: 'Apr', customers: 1247, new: 98,  churned: 16 },
  { month: 'May', customers: 1340, new: 109, churned: 16 },
  { month: 'Jun', customers: 1432, new: 106, churned: 14 },
]

// Cohort: rows = cohort month, cols = months since join (M0–M5)
const cohorts = [
  { cohort: 'Jan', months: [100, 82, 74, 68, 63, 59] },
  { cohort: 'Feb', months: [100, 79, 71, 65, 61, null] },
  { cohort: 'Mar', months: [100, 84, 77, 71, null, null] },
  { cohort: 'Apr', months: [100, 80, 72, null, null, null] },
  { cohort: 'May', months: [100, 83, null, null, null, null] },
  { cohort: 'Jun', months: [100, null, null, null, null, null] },
]

const topCustomers = [
  { name: 'Meridian Analytics', plan: 'Enterprise', arr: 81600,  health: 98, since: 'Mar 2024' },
  { name: 'Acme Corp',          plan: 'Enterprise', arr: 50400,  health: 95, since: 'Jan 2025' },
  { name: 'NovaTech Inc',       plan: 'Enterprise', arr: 50400,  health: 92, since: 'Jun 2025' },
  { name: 'Sparq AI',           plan: 'Enterprise', arr: 50400,  health: 88, since: 'Sep 2025' },
  { name: 'Apex Solutions',     plan: 'Enterprise', arr: 32400,  health: 85, since: 'Jan 2026' },
  { name: 'DataPulse',          plan: 'Pro',        arr: 588,    health: 91, since: 'Feb 2025' },
  { name: 'Sarah Chen',         plan: 'Pro',        arr: 588,    health: 86, since: 'Apr 2025' },
  { name: 'James Okafor',       plan: 'Pro',        arr: 588,    health: 79, since: 'Nov 2025' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function retentionStyle(v: number | null): string {
  if (v === null) return 'bg-transparent text-transparent select-none'
  if (v >= 90)   return 'bg-teal-400/90 text-slate-900 font-semibold'
  if (v >= 75)   return 'bg-teal-500/50 text-teal-100'
  if (v >= 60)   return 'bg-teal-700/40 text-teal-300'
  if (v >= 45)   return 'bg-slate-700   text-slate-400'
  return             'bg-slate-800 text-slate-600'
}

function healthColor(n: number) {
  if (n >= 90) return 'text-emerald-400'
  if (n >= 75) return 'text-amber-400'
  return 'text-red-400'
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
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CustomersPage() {
  return (
    <DashboardShell title="Customers">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => {
          const good = k.invertColor ? !k.up : k.up
          return (
            <div
              key={k.label}
              className="card p-5 flex flex-col gap-3 animate-fade-in"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
            >
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{k.label}</p>
              <p className="tabular text-2xl md:text-3xl font-semibold text-slate-50 leading-none">{k.value}</p>
              <span className={good ? 'pill-up' : 'pill-down'}>
                {good ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                <span className="tabular">{Math.abs(k.change)}{typeof k.change === 'number' && Math.abs(k.change) < 5 ? 'pp' : '%'}</span>
                <span className="font-sans font-normal text-[10px] opacity-70">vs prev</span>
              </span>
            </div>
          )
        })}
      </div>

      {/* Customer growth chart */}
      <div className="card p-5 md:p-6">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-heading font-semibold text-slate-200 text-sm">Customer growth</h2>
          <span className="text-xs text-slate-500">total · new · churned</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={growth} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#2DD4BF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-ibm-plex-mono)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-ibm-plex-mono)' }} axisLine={false} tickLine={false} width={44} />
            <Tooltip content={<ChartTip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
            <Area type="monotone" dataKey="customers" name="Total" stroke="#2DD4BF" strokeWidth={2} fill="url(#custGrad)" dot={false} activeDot={{ r: 4, fill: '#2DD4BF' }} />
            <Area type="monotone" dataKey="new"       name="New"   stroke="#818CF8" strokeWidth={1.5} fill="none" dot={false} activeDot={{ r: 3 }} />
            <Area type="monotone" dataKey="churned"   name="Churned" stroke="#F87171" strokeWidth={1.5} strokeDasharray="3 3" fill="none" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cohort retention + top customers */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 md:gap-6">

        {/* Cohort heatmap */}
        <div className="card p-5 md:p-6 xl:col-span-3">
          <h2 className="font-heading font-semibold text-slate-200 text-sm mb-5">Cohort retention</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" aria-label="Cohort retention heatmap">
              <thead>
                <tr>
                  <th className="text-left text-slate-500 font-medium pb-3 pr-3 whitespace-nowrap">Cohort</th>
                  {['M0','M1','M2','M3','M4','M5'].map(m => (
                    <th key={m} className="text-center text-slate-500 font-medium pb-3 px-1.5 whitespace-nowrap tabular">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="space-y-1">
                {cohorts.map(row => (
                  <tr key={row.cohort}>
                    <td className="text-slate-400 pr-3 py-1 whitespace-nowrap tabular">{row.cohort}</td>
                    {row.months.map((v, ci) => (
                      <td key={ci} className="px-1.5 py-1">
                        <div className={`rounded-md px-2 py-1.5 text-center tabular text-[11px] ${retentionStyle(v)}`}>
                          {v !== null ? `${v}%` : '—'}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="text-[10px] text-slate-500">Legend:</span>
            {[
              { label: '≥ 90%', cls: 'bg-teal-400/90' },
              { label: '75–89%', cls: 'bg-teal-500/50' },
              { label: '60–74%', cls: 'bg-teal-700/40' },
              { label: '< 60%', cls: 'bg-slate-700' },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className={`w-3 h-3 rounded-sm ${l.cls}`} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Top customers */}
        <div className="card overflow-hidden xl:col-span-2">
          <div className="px-5 py-4 border-b border-slate-700/60">
            <h2 className="font-heading font-semibold text-slate-200 text-sm">Top accounts</h2>
          </div>
          <div className="divide-y divide-slate-800">
            {topCustomers.map(c => (
              <div key={c.name} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors">
                <div className="min-w-0">
                  <p className="text-xs text-slate-200 truncate">{c.name}</p>
                  <p className={`text-[11px] font-medium ${c.plan === 'Enterprise' ? 'text-teal-400' : 'text-indigo-400'}`}>{c.plan}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="tabular text-xs text-slate-300">${c.arr.toLocaleString()}</p>
                  <p className={`tabular text-[11px] font-medium ${healthColor(c.health)}`}>{c.health}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardShell>
  )
}
