'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

const STATS = [
  {
    to: 47,
    format: (n: number) => String(n),
    label: 'dashboards deployed',
    desc: 'Shipped for clients across industries',
    delay: 0.1,
  },
  {
    to: 23,
    format: (n: number) => String(n),
    label: 'clients trust Digital Axiom',
    desc: 'From early-stage startups to enterprise',
    delay: 0.3,
  },
  {
    to: 15,
    format: (n: number) => `${n}M+`,
    label: 'data points analyzed',
    desc: 'Revenue, engagement & growth metrics',
    delay: 0.5,
  },
]

function StatCard({ to, format, label, desc, delay }: typeof STATS[0]) {
  const count   = useMotionValue(0)
  const display = useTransform(count, v => format(Math.round(v)))

  // counting: number is incrementing | done: settled at final value
  const [phase, setPhase] = useState<'idle' | 'counting' | 'done'>('idle')

  // Called once the card's fade-in animation completes — THEN start counting
  const handleCardAnimComplete = () => {
    if (phase !== 'idle') return
    setPhase('counting')
    const controls = animate(count, to, {
      duration: 1.7,
      // easeOut: fast start that decelerates into the final number
      ease: [0, 0, 0.2, 1],
      onComplete: () => setPhase('done'),
    })
    return controls.stop
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={handleCardAnimComplete}
      className="relative"
    >
      {/* Glow ring — animate opacity only (GPU-accelerated, no jank) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: '0 0 28px 6px rgba(45,212,191,0.26)' }}
        animate={{
          opacity: phase === 'counting' ? [0, 1, 0] : phase === 'done' ? 0.2 : 0,
        }}
        transition={
          phase === 'counting'
            ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.9, ease: 'easeOut' }
        }
      />

      {/* Card body */}
      <div className="relative h-full p-6 rounded-2xl border border-slate-700/60 bg-slate-800/50 backdrop-blur-sm flex flex-col">
        <motion.span
          className="font-mono text-5xl md:text-6xl font-bold text-white leading-none tracking-tight tabular"
        >
          {display}
        </motion.span>

        <div className="mt-auto pt-4">
          <p className="text-sm font-semibold text-teal-400 leading-snug">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
        </div>

        {/* Teal underline — slides in after card appears */}
        <motion.div
          className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-teal-400/0 via-teal-400/60 to-teal-400/0"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: delay + 0.65 }}
        />
      </div>
    </motion.div>
  )
}

export default function HeroStats() {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 px-5 md:px-8 py-10 md:py-14">
      {/* Layered backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-[#0a1120]" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-40 bg-indigo-500/4 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative">
        {/* Tagline */}
        <motion.div
          className="mb-8 md:mb-10"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-teal-400 uppercase tracking-widest mb-3">
            <span className="w-4 h-px bg-teal-400/60" />
            Digital Axiom
            <span className="w-4 h-px bg-teal-400/60" />
          </span>
          <h2 className="font-heading font-bold text-2xl md:text-[2rem] text-slate-100 leading-tight">
            Build smarter dashboards.{' '}
            <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
              Faster.
            </span>
          </h2>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATS.map(s => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
