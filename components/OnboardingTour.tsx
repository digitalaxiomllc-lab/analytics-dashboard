'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronRight, ExternalLink, ArrowRight, X } from 'lucide-react'

// ── Step definitions ───────────────────────────────────────────────────────────
interface Step {
  id: string
  target: string | null
  title: string
  body: string
  cta?: { label: string; href: string; external?: boolean }
}

const STEPS: Step[] = [
  {
    id: 'welcome',
    target: null,
    title: 'Welcome to Prism Dashboard',
    body: "I build polished, data-driven interfaces like this one. This quick tour walks you through every section — then let's talk about building yours.",
  },
  {
    id: 'kpi',
    target: '[data-tour="kpi-cards"]',
    title: 'Real-time KPI cards',
    body: 'The four cards at the top surface what matters instantly — revenue, active users, conversion rate, churn. Each includes a trend pill showing change vs. the previous period. Perfect for executive dashboards, SaaS admin panels, and investor portals.',
  },
  {
    id: 'chart',
    target: '[data-tour="revenue-chart"]',
    title: 'Interactive revenue chart',
    body: 'An area chart overlays actual revenue against your target. Hover any point to see the exact figure. The dashed line shows the forecast — clients love seeing trend vs. plan at a glance without opening a spreadsheet.',
  },
  {
    id: 'charts-row',
    target: '[data-tour="charts-row"]',
    title: 'Signups & plan distribution',
    body: 'A bar chart shows new user signups per period alongside a donut breaking revenue down by plan tier (Free, Pro, Enterprise). The peak bar is always highlighted — no guessing which week performed best.',
  },
  {
    id: 'transactions',
    target: '[data-tour="transactions"]',
    title: 'Live activity feed',
    body: 'Every recent transaction — customer, plan, amount, and status — in one compact table. Paid, pending, and failed events are color-coded at a glance. This pattern works for revenue feeds, audit logs, support queues, and any real-time activity stream.',
  },
  {
    id: 'daterange',
    target: '[data-tour="date-range"]',
    title: 'Instant date filtering',
    body: 'Switch between Last 7, 30, or 90 days and every chart, KPI card, and table on the page updates simultaneously — no page reload, no waiting. Clients can explore their own data the same way.',
  },
  {
    id: 'sidebar',
    target: '[data-tour="sidebar"]',
    title: 'Modular navigation',
    body: "Revenue, Customers, Settings — each tab is a standalone page with its own data and charts. This architecture lets a dashboard grow to dozens of pages without accumulating technical debt. On mobile, the sidebar collapses to icons automatically.",
  },
  {
    id: 'calculator',
    target: null,
    title: 'Project cost calculator',
    body: 'Head to Settings to use the interactive cost estimator. Toggle features, pick complexity, and watch the estimated budget and timeline update in real-time. No sales call required to get a ballpark.',
    cta: { label: 'Open the calculator', href: '/settings' },
  },
  {
    id: 'cta',
    target: null,
    title: 'Ready to build yours?',
    body: "Whether it's an internal ops tool, a client-facing analytics portal, or a product metrics layer — I'd love to hear about your project. Let's build something together.",
    cta: { label: 'Get in touch', href: 'mailto:digitalaxiomllc@gmail.com', external: true },
  },
]

// ── Spotlight geometry ─────────────────────────────────────────────────────────
const SPOT_PAD = 12

interface SpotRect { top: number; left: number; width: number; height: number }

function measureEl(selector: string): SpotRect | null {
  const el = document.querySelector<HTMLElement>(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

// ── Component ──────────────────────────────────────────────────────────────────
interface Props { open: boolean; onClose: () => void; onComplete?: () => void }

export default function OnboardingTour({ open, onClose, onComplete }: Props) {
  const [step, setStep]   = useState(0)
  const [spot, setSpot]   = useState<SpotRect | null>(null)
  const timerRef          = useRef<ReturnType<typeof setTimeout>>()
  const current           = STEPS[step]
  const isLast            = step === STEPS.length - 1

  const remeasure = useCallback(() => {
    setSpot(current.target ? measureEl(current.target) : null)
  }, [current.target])

  useEffect(() => {
    if (!open) return
    // Scroll target to center, then re-measure once smooth scroll settles
    const el = current.target ? document.querySelector<HTMLElement>(current.target) : null
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    else    window.scrollTo({ top: 0, behavior: 'smooth' })

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(remeasure, el ? 300 : 60)

    window.addEventListener('resize', remeasure)
    return () => {
      clearTimeout(timerRef.current)
      window.removeEventListener('resize', remeasure)
    }
  }, [open, step, current.target, remeasure])

  // Reset to step 0 every time the tour opens
  useEffect(() => { if (open) setStep(0) }, [open])

  // Keyboard: Esc to close, → to advance
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      { onClose(); return }
      if (e.key === 'ArrowRight')  { e.preventDefault(); advance() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step])

  function advance() {
    if (!isLast) setStep(s => s + 1)
    else { onComplete?.(); onClose() }
  }

  if (!open) return null

  const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

  return (
    <>
      {/* ── Dark overlay ──────────────────────────────────────────────────────
          Always present, never intercepts clicks (pointer-events-none).
          For non-spotlight steps this is the sole darkening layer.
          For spotlight steps the spotlight box-shadow adds the "hole" on top. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[900] pointer-events-none"
        style={{
          background: 'rgba(10,18,35,0.80)',
          opacity: spot ? 0 : 1,
          transition: 'opacity .25s ease',
        }}
      />

      {/* ── Spotlight ─────────────────────────────────────────────────────────
          A single div that CSS-transitions its rect to follow the target.
          box-shadow creates the dark surround; the transparent center is the hole.
          pointer-events-none so it never blocks interaction with the page. */}
      <div
        aria-hidden="true"
        className="fixed z-[901] rounded-xl pointer-events-none"
        style={{
          top:     (spot?.top    ?? 0) - SPOT_PAD,
          left:    (spot?.left   ?? 0) - SPOT_PAD,
          width:   (spot?.width  ?? 0) + SPOT_PAD * 2,
          height:  (spot?.height ?? 0) + SPOT_PAD * 2,
          opacity: spot ? 1 : 0,
          boxShadow: [
            '0 0 0 9999px rgba(10,18,35,0.82)',
            '0 0 0 2px #2DD4BF',
            '0 0 0 6px rgba(45,212,191,0.10)',
            '0 0 40px 8px rgba(45,212,191,0.16)',
          ].join(', '),
          transition: [
            `top .35s ${EASE}`,
            `left .35s ${EASE}`,
            `width .35s ${EASE}`,
            `height .35s ${EASE}`,
            'opacity .2s ease',
          ].join(', '),
        }}
      />

      {/* ── Tour card ─────────────────────────────────────────────────────────
          Fixed to the bottom-right corner — never repositions between steps.
          This is what makes navigation feel stable and non-jarring. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Tour step ${step + 1} of ${STEPS.length}: ${current.title}`}
        className="
          fixed z-[902]
          bottom-6 right-6
          w-[320px] max-w-[calc(100vw-2rem)]
          bg-slate-800/95 backdrop-blur-md
          border border-slate-700/60
          rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)]
          overflow-hidden
        "
      >
        {/* Teal accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400/0 via-teal-400 to-teal-400/0" />

        {/* Close (×) — only explicit button dismisses the tour */}
        <button
          onClick={onClose}
          aria-label="Skip tour"
          title="Skip tour"
          className="
            absolute top-3.5 right-3.5 z-10
            w-7 h-7 flex items-center justify-center rounded-lg
            text-slate-500 hover:text-slate-300 hover:bg-slate-700/80
            transition-colors
          "
        >
          <X size={14} />
        </button>

        {/* Content — key={step} makes it fade in fresh on every step */}
        <div key={step} className="p-5 pt-4 animate-fade-in">

          {/* Progress segments */}
          <div className="flex items-center gap-1 mb-4 pr-8" aria-hidden="true">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-[3px] rounded-full transition-all duration-400 ${
                  i === step
                    ? 'flex-[2] bg-teal-400'
                    : i < step
                      ? 'flex-1 bg-teal-600/70'
                      : 'flex-1 bg-slate-700'
                }`}
              />
            ))}
            <span className="shrink-0 tabular text-[11px] text-slate-600 ml-1.5 font-mono">
              {step + 1}/{STEPS.length}
            </span>
          </div>

          <h3 className="font-heading font-semibold text-slate-100 text-[15px] leading-snug mb-2">
            {current.title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            {current.body}
          </p>

          {/* Optional CTA link (e.g. "Open the calculator", "Get in touch") */}
          {current.cta && (
            <a
              href={current.cta.href}
              {...(current.cta.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className={`
                flex items-center justify-center gap-2 w-full mb-4
                px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
                focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none
                ${current.cta.external
                  ? 'bg-teal-400 hover:bg-teal-300 text-slate-900'
                  : 'bg-slate-700/80 hover:bg-slate-700 text-slate-100 border border-teal-400/30 hover:border-teal-400/50'
                }
              `}
            >
              {current.cta.label}
              {current.cta.external ? <ExternalLink size={13} /> : <ArrowRight size={13} />}
            </a>
          )}

          {/* Footer nav */}
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors px-1 py-1"
            >
              Skip tour
            </button>

            <button
              onClick={advance}
              autoFocus
              className="
                flex items-center gap-1.5
                px-4 py-2 rounded-xl
                bg-slate-700 hover:bg-slate-600
                text-slate-100 text-sm font-medium
                transition-colors
                focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none
              "
            >
              {isLast ? 'Done' : 'Next'}
              {!isLast && <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
