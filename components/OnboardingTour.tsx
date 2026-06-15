'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronRight, ExternalLink, ArrowRight, X } from 'lucide-react'

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
    body: 'An area chart overlays actual revenue against your target. Hover any point for the exact figure. The dashed line shows forecast vs. actuals — clients love this at a glance.',
  },
  {
    id: 'charts-row',
    target: '[data-tour="charts-row"]',
    title: 'Signups & plan distribution',
    body: 'A bar chart shows new signups per period alongside a donut breaking revenue by plan tier. The peak bar is always highlighted — no guessing which week performed best.',
  },
  {
    id: 'transactions',
    target: '[data-tour="transactions"]',
    title: 'Live activity feed',
    body: 'Every recent transaction — customer, plan, amount, status — in one compact table. Paid, pending, and failed events are color-coded at a glance.',
  },
  {
    id: 'daterange',
    target: '[data-tour="date-range"]',
    title: 'Instant date filtering',
    body: 'Switch between Last 7, 30, or 90 days and every chart, KPI, and table updates simultaneously — no reload. Clients can explore their data the same way.',
  },
  {
    id: 'sidebar',
    target: '[data-tour="sidebar"]',
    title: 'Modular navigation',
    body: 'Revenue, Customers, Settings — each tab is its own page. This architecture scales to dozens of pages without accumulating debt. On mobile, the sidebar collapses to icons.',
  },
  {
    id: 'calculator',
    target: null,
    title: 'Project cost calculator',
    body: 'Head to Settings to use the interactive estimator. Toggle features, pick complexity, and watch the budget and timeline update in real-time. No sales call required.',
    cta: { label: 'Open the calculator', href: '/settings' },
  },
  {
    id: 'cta',
    target: null,
    title: 'Ready to build yours?',
    body: "Whether it's an internal ops tool, a client-facing analytics portal, or a product metrics layer — I'd love to hear about your project.",
    cta: { label: 'Get in touch', href: 'mailto:digitalaxiomllc@gmail.com', external: true },
  },
]

// ── Layout constants ───────────────────────────────────────────────────────────
const CARD_W  = 340
const PAD     = 12   // spotlight padding around the target element
const MARGIN  = 14   // minimum gap to screen edges
const TOPBAR  = 68   // sticky header height + buffer so card clears it

const BOX_SHADOW = [
  '0 0 0 9999px rgba(10,18,35,0.82)',
  '0 0 0 2px #2DD4BF',
  '0 0 0 6px rgba(45,212,191,0.10)',
  '0 0 40px 8px rgba(45,212,191,0.15)',
].join(', ')

interface Rect { top: number; left: number; width: number; height: number }

function measure(sel: string): Rect | null {
  const el = document.querySelector<HTMLElement>(sel)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

// Places the tour card near the spotlight, always within the visible viewport
function placeCard(spot: Rect | null, cardH: number): { top: number; left: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const w  = Math.min(CARD_W, vw - 2 * MARGIN)

  // Null target → centered modal
  if (!spot) {
    return {
      top:  Math.max(TOPBAR, (vh - cardH) / 2),
      left: Math.max(MARGIN, (vw - w) / 2),
    }
  }

  // Tall target (sidebar) → try placing card to the right
  if (spot.height > vh * 0.5) {
    const rx = spot.left + spot.width + PAD + MARGIN
    if (rx + w < vw - MARGIN) {
      return { top: Math.max(TOPBAR, (vh - cardH) / 2), left: rx }
    }
  }

  // Horizontally centered over the spotlight
  let left = spot.left + spot.width / 2 - w / 2
  left = Math.max(MARGIN, Math.min(left, vw - w - MARGIN))

  // Prefer below; fall back to above; last resort clears the header
  const below = spot.top + spot.height + PAD + MARGIN
  if (below + cardH <= vh - MARGIN) return { top: below, left }

  const above = spot.top - PAD - MARGIN - cardH
  if (above >= TOPBAR) return { top: above, left }

  return { top: TOPBAR, left }
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props { open: boolean; onClose: () => void; onComplete?: () => void }

export default function OnboardingTour({ open, onClose, onComplete }: Props) {
  const [step, setStep]   = useState(0)
  const [spot, setSpot]   = useState<Rect | null>(null)
  const [ready, setReady] = useState(false)

  const cardRef  = useRef<HTMLDivElement>(null)
  const rafId    = useRef(0)
  const current  = STEPS[step]
  const isLast   = step === STEPS.length - 1
  const hasTarget = !!current.target

  // Snapshot the target element's current rect and update state.
  // React owns ALL style values — no imperative DOM tricks.
  const snap = () => {
    if (!current.target) { setSpot(null); return }
    const r = measure(current.target)
    setSpot(r)
  }

  // ── Real-time spotlight tracking while a step is active ───────────────────
  // Fires on scroll and resize (rAF-throttled). Keeps the spotlight ring
  // locked to the element even as the user scrolls the page.
  useEffect(() => {
    if (!open || !ready || !current.target) return

    let pending = false
    const schedule = () => {
      if (pending) return
      pending = true
      rafId.current = requestAnimationFrame(() => {
        pending = false
        snap()
      })
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(rafId.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ready, current.target])

  // ── ResizeObserver: reposition if the element itself resizes ──────────────
  useEffect(() => {
    if (!open || !ready || !current.target) return
    const el = document.querySelector<HTMLElement>(current.target)
    if (!el) return
    const obs = new ResizeObserver(() => snap())
    obs.observe(el)
    return () => obs.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ready, current.target])

  // ── IntersectionObserver: re-center if element scrolls off-screen ─────────
  useEffect(() => {
    if (!open || !current.target) return
    const el = document.querySelector<HTMLElement>(current.target)
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting)
          el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [open, current.target])

  // ── Step transitions: hide → scroll → scrollend → reveal ──────────────────
  useEffect(() => {
    if (!open) return

    setReady(false)
    setSpot(null)

    const el = current.target
      ? document.querySelector<HTMLElement>(current.target)
      : null

    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })

      let done = false
      const reveal = () => {
        if (done) return
        done = true
        window.removeEventListener('scrollend', reveal)
        clearTimeout(fb)
        // Measure now that scroll has settled, then show
        const r = el.getBoundingClientRect()
        setSpot({ top: r.top, left: r.left, width: r.width, height: r.height })
        setReady(true)
      }
      // scrollend = scroll truly finished (700ms fallback for Safari < 17)
      window.addEventListener('scrollend', reveal, { once: true })
      const fb = setTimeout(reveal, 700)

      return () => {
        done = true
        window.removeEventListener('scrollend', reveal)
        clearTimeout(fb)
      }
    } else {
      // Null-target step (welcome, CTA): scroll to top, no spotlight
      window.scrollTo({ top: 0, behavior: 'smooth' })
      const t = setTimeout(() => { setSpot(null); setReady(true) }, 80)
      return () => clearTimeout(t)
    }
  }, [open, step]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reset to step 0 whenever tour opens ───────────────────────────────────
  useEffect(() => {
    if (open) { setStep(0); setReady(false); setSpot(null) }
  }, [open])

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     { onClose(); return }
      if (e.key === 'ArrowRight') { e.preventDefault(); advance() }
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

  // Derive card position from current spot rect + card's rendered height
  const pos = placeCard(spot, cardRef.current?.offsetHeight ?? 270)

  return (
    <>
      {/* ── Dark overlay ──────────────────────────────────────────────────────
          Full-viewport fixed layer. Fades out when the spotlight takes over.
          pointer-events-none: nothing can accidentally dismiss the tour. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[900] pointer-events-none"
        style={{
          background:  'rgba(10,18,35,0.82)',
          opacity:     ready && hasTarget ? 0 : 1,
          transition:  'opacity .25s ease',
        }}
      />

      {/* ── Spotlight ring ────────────────────────────────────────────────────
          React drives top/left/width/height from `spot` state, which is
          updated by scroll/resize listeners every rAF. The ring tracks the
          element in real-time. box-shadow creates the surrounding darkening. */}
      <div
        aria-hidden="true"
        className="fixed z-[901] rounded-xl pointer-events-none"
        style={{
          top:        (spot?.top    ?? 0) - PAD,
          left:       (spot?.left   ?? 0) - PAD,
          width:      (spot?.width  ?? 0) + PAD * 2,
          height:     (spot?.height ?? 0) + PAD * 2,
          opacity:    ready && spot ? 1 : 0,
          boxShadow:  BOX_SHADOW,
          transition: 'opacity .2s ease',
          // No position transition — values update every rAF frame,
          // so movement is already smooth without CSS easing on top.
        }}
      />

      {/* ── Tour card ─────────────────────────────────────────────────────────
          position: fixed, positioned by placeCard() near the spotlight.
          Fades in once scroll has settled and position is correct. */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Tour step ${step + 1} of ${STEPS.length}: ${current.title}`}
        className="fixed z-[902] bg-slate-800/95 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          top:        pos.top,
          left:       pos.left,
          width:      CARD_W,
          maxWidth:   'calc(100vw - 28px)',
          opacity:    ready ? 1 : 0,
          transition: 'opacity .2s ease',
        }}
      >
        {/* Teal accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400/0 via-teal-400 to-teal-400/0" />

        {/* Only explicit buttons can close — no backdrop click */}
        <button
          onClick={onClose}
          aria-label="Skip tour"
          title="Skip tour"
          className="absolute top-3.5 right-3.5 z-10 w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/80 transition-colors"
        >
          <X size={14} />
        </button>

        {/* key={step} gives each step a fresh fade-in for its content */}
        <div key={step} className="p-5 pt-4 animate-fade-in">

          {/* Progress segments */}
          <div className="flex items-center gap-1 mb-4 pr-8" aria-hidden="true">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-[3px] rounded-full transition-all duration-300 ${
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
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
