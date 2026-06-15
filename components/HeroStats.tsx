'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  BarChart3, Database, LayoutDashboard,
  LineChart, PieChart, Smartphone, ArrowRight, ExternalLink,
} from 'lucide-react'

const CAPABILITIES = [
  { icon: LayoutDashboard, label: 'Custom KPI Dashboards' },
  { icon: LineChart,       label: 'Real-time Metrics' },
  { icon: Database,        label: 'Data Pipeline Integration' },
  { icon: BarChart3,       label: 'Revenue & Growth Analytics' },
  { icon: PieChart,        label: 'Executive Reporting' },
  { icon: Smartphone,      label: 'Mobile-responsive Design' },
]

const STATS = [
  {
    to: 47,
    format: (n: number) => String(n),
    label: 'dashboards deployed',
    desc: 'Shipped for clients across industries',
    delay: 0.4,
  },
  {
    to: 23,
    format: (n: number) => String(n),
    label: 'clients trust Digital Axiom',
    desc: 'From early-stage startups to enterprise',
    delay: 0.55,
  },
  {
    to: 15,
    format: (n: number) => `${n}M+`,
    label: 'data points analyzed',
    desc: 'Revenue, engagement & growth metrics',
    delay: 0.7,
  },
]

function StatCard({ to, format, label, desc, delay }: typeof STATS[0]) {
  const count   = useMotionValue(0)
  const display = useTransform(count, v => format(Math.round(v)))
  const [phase, setPhase] = useState<'idle' | 'counting' | 'done'>('idle')

  const startCount = () => {
    if (phase !== 'idle') return
    setPhase('counting')
    const ctrl = animate(count, to, {
      duration: 1.6,
      ease: [0, 0, 0.2, 1],
      onComplete: () => setPhase('done'),
    })
    return ctrl.stop
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={startCount}
      className="relative"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: '0 0 28px 6px rgba(45,212,191,0.22)' }}
        animate={{
          opacity: phase === 'counting' ? [0, 1, 0] : phase === 'done' ? 0.15 : 0,
        }}
        transition={
          phase === 'counting'
            ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.9, ease: 'easeOut' }
        }
      />
      <div className="relative h-full p-5 rounded-2xl border border-slate-700/60 bg-slate-800/40 backdrop-blur-sm flex flex-col">
        <motion.span className="font-mono text-4xl md:text-5xl font-bold text-white leading-none tracking-tight tabular">
          {display}
        </motion.span>
        <div className="mt-auto pt-3">
          <p className="text-sm font-semibold text-teal-400 leading-snug">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        </div>
        <motion.div
          className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-teal-400/0 via-teal-400/50 to-teal-400/0"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: delay + 0.6 }}
        />
      </div>
    </motion.div>
  )
}

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-[#080f1e]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-teal-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-56 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #94A3B8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative px-5 md:px-8 lg:px-12 pt-14 pb-10 md:pt-16 md:pb-12">

        {/* ── Headline block ─────────────────────────────────────────────── */}
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-bold text-teal-400 uppercase tracking-[0.18em] mb-5">
            <span className="w-5 h-px bg-teal-400/50" />
            Digital Axiom
            <span className="w-5 h-px bg-teal-400/50" />
          </span>

          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-[2.6rem] text-slate-50 leading-[1.15] tracking-tight mb-4">
            Analytics dashboards your{' '}
            <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
              team will actually use.
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl mb-8">
            We design and ship production-ready data products — KPI dashboards, SaaS admin portals,
            investor reporting tools. Built fast, built to last.
          </p>
        </motion.div>

        {/* ── Capabilities grid ──────────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap gap-2.5 mb-10"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {CAPABILITIES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-800/70 border border-slate-700/60 text-slate-300 text-xs font-medium"
            >
              <Icon size={13} className="text-teal-400 shrink-0" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* ── CTAs ───────────────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap items-center gap-3 mb-12"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="mailto:digitalaxiomllc@gmail.com?subject=Dashboard%20Project%20Inquiry"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-900 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Start a project
            <ArrowRight size={14} />
          </a>
          <a
            href="https://github.com/digitalaxiomllc-lab/analytics-dashboard"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-100 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            View source
            <ExternalLink size={13} />
          </a>
        </motion.div>

        {/* ── Stat cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATS.map(s => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

      </div>

      {/* ── "Live demo" divider ────────────────────────────────────────── */}
      <div className="relative border-t border-slate-800/60 px-5 md:px-8 lg:px-12 py-3 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700/40" />
        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest shrink-0">
          Live dashboard preview
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700/40" />
      </div>
    </section>
  )
}
