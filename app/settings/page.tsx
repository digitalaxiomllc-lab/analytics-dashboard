'use client'

import DashboardShell from '@/components/DashboardShell'
import { useState, useMemo, useEffect } from 'react'
import { Check, PlayCircle } from 'lucide-react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRouter } from 'next/navigation'

// ── Feature catalogue ─────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: 'realtime',
    label: 'Real-time data sync',
    desc: 'Live WebSocket updates — charts and KPIs refresh without a page reload.',
    costs: { simple: 2000, standard: 4000, advanced: 8000 },
    weeks: { simple: 1.0, standard: 1.5, advanced: 3.0 },
  },
  {
    id: 'charts',
    label: 'Advanced chart library',
    desc: 'Custom chart types, drill-down interactions, and exportable SVG/PNG.',
    costs: { simple: 1500, standard: 3000, advanced: 6000 },
    weeks: { simple: 0.5, standard: 1.0, advanced: 2.0 },
  },
  {
    id: 'permissions',
    label: 'Role-based permissions',
    desc: 'Admin, editor, and viewer roles with per-page or per-widget access control.',
    costs: { simple: 1000, standard: 2500, advanced: 5000 },
    weeks: { simple: 0.5, standard: 1.0, advanced: 2.5 },
  },
  {
    id: 'export',
    label: 'Data export (CSV / PDF)',
    desc: 'One-click export of any table or chart as a formatted report.',
    costs: { simple: 800, standard: 1600, advanced: 3200 },
    weeks: { simple: 0.5, standard: 0.5, advanced: 1.0 },
  },
  {
    id: 'mobile',
    label: 'Mobile-optimized layout',
    desc: 'Native-quality experience on phones and tablets — not just "responsive".',
    costs: { simple: 2000, standard: 3500, advanced: 7000 },
    weeks: { simple: 1.0, standard: 1.5, advanced: 3.0 },
  },
  {
    id: 'branding',
    label: 'Custom branding / white-label',
    desc: 'Your logo, colors, typography, and domain — fully white-labeled.',
    costs: { simple: 1000, standard: 2000, advanced: 4000 },
    weeks: { simple: 0.5, standard: 1.0, advanced: 1.5 },
  },
  {
    id: 'alerts',
    label: 'Alerts & notifications',
    desc: 'Email, Slack, or in-app alerts when metrics cross thresholds you define.',
    costs: { simple: 2000, standard: 3500, advanced: 6000 },
    weeks: { simple: 1.0, standard: 1.5, advanced: 2.5 },
  },
  {
    id: 'api',
    label: 'External API integrations',
    desc: 'Connect to Stripe, Salesforce, HubSpot, or any REST / GraphQL source.',
    costs: { simple: 3000, standard: 6000, advanced: 12000 },
    weeks: { simple: 1.5, standard: 2.5, advanced: 5.0 },
  },
]

type Complexity = 'simple' | 'standard' | 'advanced'

const COMPLEXITY: { key: Complexity; label: string; desc: string; base: number; baseWeeks: number }[] = [
  { key: 'simple',   label: 'Simple',   desc: 'Static or near-static data, single user type, minimal interactivity.', base: 3000, baseWeeks: 2 },
  { key: 'standard', label: 'Standard', desc: 'Dynamic data, interactive charts, multiple views, 1–2 user roles.',    base: 7000, baseWeeks: 4 },
  { key: 'advanced', label: 'Advanced', desc: 'Real-time feeds, multi-tenant, enterprise auth, complex permissions.',  base: 15000, baseWeeks: 8 },
]

function fmtCost(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return `$${n}`
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter()
  const [complexity, setComplexity] = useState<Complexity>('standard')
  const [selected, setSelected]     = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const { totalCost, totalWeeks } = useMemo(() => {
    const base = COMPLEXITY.find(c => c.key === complexity)!
    let cost  = base.base
    let weeks = base.baseWeeks
    for (const f of FEATURES) {
      if (selected.has(f.id)) {
        cost  += f.costs[complexity]
        weeks += f.weeks[complexity]
      }
    }
    return { totalCost: cost, totalWeeks: weeks }
  }, [complexity, selected])

  // Animated motion values — roll to new totals whenever they change
  const animCost  = useMotionValue(totalCost)
  const animWeeks = useMotionValue(totalWeeks)

  useEffect(() => {
    const c = animate(animCost, totalCost, { duration: 0.55, ease: [0.16, 1, 0.3, 1] })
    return c.stop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCost])

  useEffect(() => {
    const c = animate(animWeeks, totalWeeks, { duration: 0.55, ease: [0.16, 1, 0.3, 1] })
    return c.stop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalWeeks])

  const dispLo   = useTransform(animCost,  v => fmtCost(Math.round(v * 0.9  / 100) * 100))
  const dispHi   = useTransform(animCost,  v => fmtCost(Math.round(v * 1.15 / 100) * 100))
  const dispWkLo = useTransform(animWeeks, v => String(Math.floor(v)))
  const dispWkHi = useTransform(animWeeks, v => String(Math.ceil(v * 1.2)))

  return (
    <DashboardShell title="Settings">
      <div className="max-w-4xl space-y-6">

        {/* Hero header */}
        <div className="card p-6 md:p-8" data-tour="calculator">
          <div className="mb-1 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-400/10 border border-teal-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className="text-[11px] font-medium text-teal-400 uppercase tracking-wider">Interactive tool</span>
          </div>
          <h2 className="font-heading font-semibold text-slate-100 text-xl md:text-2xl mt-3 mb-2">
            Project Cost Calculator
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            Toggle the features you need, pick a complexity level, and see a real-time cost estimate and delivery
            timeline. No sales call required to get a ballpark.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 items-start">

          {/* ── Left: controls ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Complexity selector */}
            <div className="card p-5 md:p-6">
              <h3 className="font-heading font-semibold text-slate-200 text-sm mb-4">Project complexity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {COMPLEXITY.map(opt => {
                  const active = complexity === opt.key
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setComplexity(opt.key)}
                      aria-pressed={active}
                      className={`
                        text-left p-4 rounded-xl border transition-all duration-150
                        focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none
                        ${active
                          ? 'bg-teal-400/10 border-teal-400/50 text-teal-300'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                        }
                      `}
                    >
                      <p className={`font-heading font-semibold text-sm mb-1 ${active ? 'text-teal-300' : 'text-slate-200'}`}>
                        {opt.label}
                      </p>
                      <p className="text-[11px] leading-relaxed">{opt.desc}</p>
                      <p className={`tabular text-xs font-semibold mt-3 ${active ? 'text-teal-400' : 'text-slate-500'}`}>
                        from {fmtCost(opt.base)}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Feature toggles */}
            <div className="card p-5 md:p-6">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-heading font-semibold text-slate-200 text-sm">Features</h3>
                {selected.size > 0 && (
                  <button
                    onClick={() => setSelected(new Set())}
                    className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FEATURES.map(f => {
                  const on = selected.has(f.id)
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggle(f.id)}
                      aria-pressed={on}
                      className={`
                        group text-left p-3.5 rounded-xl border transition-all duration-150
                        focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none
                        ${on
                          ? 'bg-teal-400/8 border-teal-400/40'
                          : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors border
                          ${on ? 'bg-teal-400 border-teal-400' : 'bg-transparent border-slate-600 group-hover:border-slate-400'}
                        `}>
                          {on && <Check size={10} strokeWidth={3} className="text-slate-900" />}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-medium leading-snug transition-colors ${on ? 'text-slate-100' : 'text-slate-300'}`}>
                            {f.label}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{f.desc}</p>
                          <p className={`tabular text-[11px] font-medium mt-1.5 transition-colors ${on ? 'text-teal-400' : 'text-slate-600'}`}>
                            +{fmtCost(f.costs[complexity])}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Right: estimate ─────────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 space-y-4">

            {/* Cost output */}
            <div className="card p-5 md:p-6 border-teal-400/20">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Estimated budget</p>
              <p className="tabular text-3xl font-semibold text-slate-50 leading-none mb-1">
                <motion.span>{dispLo}</motion.span>
                <span className="text-slate-500 text-xl"> – <motion.span>{dispHi}</motion.span></span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Rough range · not a formal quote</p>

              <div className="my-4 h-px bg-slate-700/60" />

              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Delivery timeline</p>
              <p className="tabular text-2xl font-semibold text-slate-100 leading-none">
                <motion.span>{dispWkLo}</motion.span>
                –
                <motion.span>{dispWkHi}</motion.span>
                <span className="text-slate-400 text-base font-normal"> weeks</span>
              </p>

              {selected.size > 0 && (
                <>
                  <div className="my-4 h-px bg-slate-700/60" />
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2">Selected features</p>
                  <ul className="space-y-1">
                    {FEATURES.filter(f => selected.has(f.id)).map(f => (
                      <li key={f.id} className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-slate-400 truncate">{f.label}</span>
                        <span className="tabular text-teal-400 shrink-0">+{fmtCost(f.costs[complexity])}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* CTA */}
            <a
              href="mailto:digitalaxiomllc@gmail.com"
              className="
                flex items-center justify-center gap-2 w-full
                px-4 py-3 rounded-xl
                bg-teal-400 hover:bg-teal-300
                text-slate-900 font-semibold text-sm
                transition-colors
                focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none
              "
            >
              Get a real quote
            </a>
            <p className="text-[11px] text-slate-600 text-center">
              No commitment. Usually reply within 24 h.
            </p>

            {/* Replay tour shortcut */}
            <div className="mt-4 pt-4 border-t border-slate-700/40">
              <button
                onClick={() => {
                  localStorage.removeItem('prism_tour_v1_done')
                  router.push('/')
                }}
                className="
                  flex items-center justify-center gap-2 w-full
                  px-4 py-2.5 rounded-xl
                  bg-slate-700/60 hover:bg-slate-700
                  text-slate-300 text-xs font-medium
                  border border-slate-600/50 hover:border-slate-500
                  transition-colors
                  focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none
                "
              >
                <PlayCircle size={13} className="text-teal-400" />
                Replay product tour
              </button>
              <p className="text-[10px] text-slate-600 text-center mt-1.5">
                Takes you back to Overview and replays from the start
              </p>
            </div>
          </div>

        </div>
      </div>
    </DashboardShell>
  )
}
