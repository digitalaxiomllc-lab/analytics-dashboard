'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
    body: 'An area chart overlays actual revenue against your target. Hover any point for the exact figure. The dashed line shows the forecast — clients love seeing trend vs. plan at a glance without opening a spreadsheet.',
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
    body: 'Switch between Last 7, 30, or 90 days and every chart, KPI, and table updates simultaneously — no page reload. Clients can explore their own data the same way.',
  },
  {
    id: 'sidebar',
    target: '[data-tour="sidebar"]',
    title: 'Modular navigation',
    body: 'Revenue, Customers, Settings — each tab is its own page with its own data and charts. This architecture scales to dozens of pages without accumulating debt. On mobile, the sidebar collapses to icons automatically.',
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

const CARD_W   = 340
const PAD      = 12   // spotlight padding around element
const M        = 14   // screen margin
const TOPBAR   = 68   // height of sticky header + buffer

interface Rect { top: number; left: number; width: number; height: number }

function cardPos(spot: Rect | null, cardH: number): { top: number; left: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const w  = Math.min(CARD_W, vw - 2 * M)

  if (!spot) {
    return { top: Math.max(TOPBAR, (vh - cardH) / 2), left: Math.max(M, (vw - w) / 2) }
  }

  // Tall element (sidebar) → try right side first
  if (spot.height > vh * 0.5) {
    const rx = spot.left + spot.width + PAD + M
    if (rx + w < vw - M) return { top: Math.max(TOPBAR, (vh - cardH) / 2), left: rx }
  }

  // Horizontally centered over spotlight, clamped to viewport
  let left = spot.left + spot.width / 2 - w / 2
  left = Math.max(M, Math.min(left, vw - w - M))

  const below = spot.top + spot.height + PAD + M
  if (below + cardH <= vh - M) return { top: below, left }

  const above = spot.top - PAD - M - cardH
  if (above >= TOPBAR) return { top: above, left }

  return { top: TOPBAR, left }  // last resort: just clear the header
}

const SHADOW = [
  '0 0 0 9999px rgba(10,18,35,0.82)',
  '0 0 0 2px #2DD4BF',
  '0 0 0 6px rgba(45,212,191,0.10)',
  '0 0 40px 8px rgba(45,212,191,0.15)',
].join(', ')

interface Props { open: boolean; onClose: () => void; onComplete?: () => void }

export default function OnboardingTour({ open, onClose, onComplete }: Props) {
  const [step, setStep]   = useState(0)
  const [ready, setReady] = useState(false)

  // Refs for DOM elements whose position is managed outside React
  const spotRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Mutable refs used inside the rAF loop (avoids stale closures)
  const rafId    = useRef(0)
  const liveRef  = useRef(false)   // true = actively track and show spotlight
  const stepRef  = useRef(step)
  stepRef.current = step            // always current — read by rAF without stale closure

  // ── Initialize DOM-managed styles before first paint ──────────────────────
  // React never sets top/left/etc on these elements (not in JSX style),
  // so it will never overwrite what rAF writes to them.
  useLayoutEffect(() => {
    const s = spotRef.current
    const c = cardRef.current
    if (!s || !c) return

    Object.assign(s.style, {
      position: 'fixed', zIndex: '901', borderRadius: '12px',
      pointerEvents: 'none', opacity: '0',
      top: '0', left: '0', width: '0', height: '0',
      boxShadow: SHADOW,
      transition: 'opacity .2s ease',
    })

    // Start off-screen so it never flashes at (0,0) before rAF positions it
    Object.assign(c.style, {
      position: 'fixed', zIndex: '902',
      top: '-9999px', left: '-9999px',
    })
  }, [])   // runs once on mount; component unmounts when open=false so this is safe

  // ── rAF tracking loop ─────────────────────────────────────────────────────
  // Reads getBoundingClientRect() every frame and writes directly to DOM.
  // No React setState → no re-renders → zero lag even while the user scrolls.
  useEffect(() => {
    if (!open) return

    let running = true

    const tick = () => {
      if (!running) return

      const target = STEPS[stepRef.current].target
      const s      = spotRef.current
      const c      = cardRef.current

      if (s && c) {
        if (target && liveRef.current) {
          const el = document.querySelector<HTMLElement>(target)
          if (el) {
            const r = el.getBoundingClientRect()
            s.style.top    = `${r.top    - PAD}px`
            s.style.left   = `${r.left   - PAD}px`
            s.style.width  = `${r.width  + PAD * 2}px`
            s.style.height = `${r.height + PAD * 2}px`
            s.style.opacity = '1'

            const p = cardPos({ top: r.top, left: r.left, width: r.width, height: r.height }, c.offsetHeight)
            c.style.top  = `${p.top}px`
            c.style.left = `${p.left}px`
          }
        } else if (!target) {
          // Null-target step: no spotlight, card centered
          s.style.opacity = '0'
          const p = cardPos(null, c.offsetHeight)
          c.style.top  = `${p.top}px`
          c.style.left = `${p.left}px`
        }
        // target + !liveRef: transitioning — spotlight already hidden, leave card off-screen
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    return () => { running = false; cancelAnimationFrame(rafId.current) }
  }, [open])

  // ── Step change: hide → scroll → wait for scroll to finish → reveal ───────
  useEffect(() => {
    if (!open) return

    liveRef.current = false
    setReady(false)
    if (spotRef.current) spotRef.current.style.opacity = '0'

    const target = STEPS[step].target
    const el     = target ? document.querySelector<HTMLElement>(target) : null

    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })

      let done = false
      const reveal = () => {
        if (done) return
        done = true
        window.removeEventListener('scrollend', reveal)
        clearTimeout(fb)
        liveRef.current = true
        // Let rAF write the correct position before React fades the card in
        requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
      }
      // scrollend fires when smooth scroll truly finishes; 700ms fallback for Safari < 17
      window.addEventListener('scrollend', reveal, { once: true })
      const fb = setTimeout(reveal, 700)

      return () => {
        done = true
        window.removeEventListener('scrollend', reveal)
        clearTimeout(fb)
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      const t = setTimeout(() => requestAnimationFrame(() => setReady(true)), 80)
      return () => clearTimeout(t)
    }
  }, [open, step])

  // ── IntersectionObserver: re-center if element scrolls off-screen ─────────
  useEffect(() => {
    if (!open || !STEPS[step].target) return
    const el = document.querySelector<HTMLElement>(STEPS[step].target!)
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && liveRef.current) {
          el.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [open, step])

  // ── Reset on open ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (open) { setStep(0); setReady(false); liveRef.current = false }
  }, [open])

  // ── Keyboard ──────────────────────────────────────────────────────────────
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
    liveRef.current = false   // hide spotlight immediately on click
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else { onComplete?.(); onClose() }
  }

  if (!open) return null

  const current   = STEPS[step]
  const isLast    = step === STEPS.length - 1
  const hasTarget = !!current.target

  return (
    <>
      {/* ── Dark overlay ────────────────────────────────────────────────────
          Visible on null-target steps and during transitions.
          When spotlight is live, the spotlight's box-shadow provides the dimming.
          pointer-events-none: nothing can accidentally close the tour. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[900] pointer-events-none"
        style={{
          background: 'rgba(10,18,35,0.82)',
          opacity: (ready && hasTarget) ? 0 : 1,
          transition: 'opacity .25s ease',
        }}
      />

      {/* ── Spotlight ───────────────────────────────────────────────────────
          All styles (position, size, opacity) written by rAF loop.
          React only provides the DOM node via ref — it owns nothing on this div. */}
      <div ref={spotRef} aria-hidden="true" />

      {/* ── Card shell ──────────────────────────────────────────────────────
          Position (top/left) written by rAF loop.
          React owns: width, maxWidth (constants — never change).
          Inner div: React owns opacity for the fade-in. */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Tour step ${step + 1} of ${STEPS.length}: ${current.title}`}
        style={{ width: CARD_W, maxWidth: 'calc(100vw - 28px)' }}
      >
        <div
          className="bg-slate-800/95 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden"
          style={{ opacity: ready ? 1 : 0, transition: 'opacity .2s ease' }}
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

          <div key={step} className="p-5 pt-4 animate-fade-in">
            {/* Progress segments */}
            <div className="flex items-center gap-1 mb-4 pr-8" aria-hidden="true">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    i === step ? 'flex-[2] bg-teal-400' : i < step ? 'flex-1 bg-teal-600/70' : 'flex-1 bg-slate-700'
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
      </div>
    </>
  )
}
