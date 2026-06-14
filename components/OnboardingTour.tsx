'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronRight, ExternalLink, ArrowRight, X } from 'lucide-react'

// ── Steps ─────────────────────────────────────────────────────────────────────
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

// ── Geometry ──────────────────────────────────────────────────────────────────
const CARD_W   = 340
const SPOT_PAD = 12
const MARGIN   = 14
const TOPBAR_H = 68  // 64px sticky header + 4px buffer

interface Rect { top: number; left: number; width: number; height: number }

function getRect(sel: string): Rect | null {
  const el = document.querySelector<HTMLElement>(sel)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

function placeCard(spot: Rect | null, cardH: number): { top: number; left: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const w  = Math.min(CARD_W, vw - 2 * MARGIN)

  // No target → center the card in the viewport
  if (!spot) {
    return {
      top:  Math.max(TOPBAR_H, (vh - cardH) / 2),
      left: Math.max(MARGIN, (vw - w) / 2),
    }
  }

  // Tall element (e.g. sidebar) → put card to its right if space allows
  if (spot.height > vh * 0.5) {
    const rx = spot.left + spot.width + SPOT_PAD + MARGIN
    if (rx + w < vw - MARGIN) {
      return { top: Math.max(TOPBAR_H, (vh - cardH) / 2), left: rx }
    }
  }

  // Horizontal: center card over the spotlight
  let left = spot.left + spot.width / 2 - w / 2
  left = Math.max(MARGIN, Math.min(left, vw - w - MARGIN))

  // Vertical: below the spotlight, or above if no room below
  const below = spot.top + spot.height + SPOT_PAD + MARGIN
  if (below + cardH <= vh - MARGIN) return { top: below, left }

  const above = spot.top - SPOT_PAD - MARGIN - cardH
  if (above >= TOPBAR_H)           return { top: above, left }

  // Last resort: just clear the top bar
  return { top: TOPBAR_H, left }
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props { open: boolean; onClose: () => void; onComplete?: () => void }

export default function OnboardingTour({ open, onClose, onComplete }: Props) {
  const [step, setStep]     = useState(0)
  const [spot, setSpot]     = useState<Rect | null>(null)
  const [cardPos, setCardPos] = useState({ top: 0, left: 0 })
  // `ready` gates visibility — false during scroll so the card is hidden
  // until it's measured in exactly the right place, then fades in.
  const [ready, setReady]   = useState(false)
  const cardRef             = useRef<HTMLDivElement>(null)
  const cancelRef           = useRef<(() => void) | null>(null)
  const current             = STEPS[step]
  const isLast              = step === STEPS.length - 1

  // Called once the page has finished scrolling to the target
  const settle = useCallback(() => {
    const r = current.target ? getRect(current.target) : null
    const h = cardRef.current?.offsetHeight ?? 270
    setSpot(r)
    // Snap position with no transition, then fade in on the next frame
    setCardPos(placeCard(r, h))
    requestAnimationFrame(() => setReady(true))
  }, [current.target])

  // Repositions without touching ready (used for resize)
  const reposition = useCallback(() => {
    const r = current.target ? getRect(current.target) : null
    const h = cardRef.current?.offsetHeight ?? 270
    setSpot(r)
    setCardPos(placeCard(r, h))
  }, [current.target])

  useEffect(() => {
    if (!open) return

    // Cancel any in-flight scroll listener from a previous step
    cancelRef.current?.()

    // Hide card + spotlight immediately — card will reappear once scroll settles
    setReady(false)
    setSpot(null)

    const el = current.target
      ? document.querySelector<HTMLElement>(current.target)
      : null

    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })

      let done = false
      const finish = () => {
        if (done) return
        done = true
        window.removeEventListener('scrollend', finish)
        clearTimeout(fb)
        settle()
      }
      // `scrollend` fires when the browser finishes its smooth scroll.
      // The 650ms fallback covers browsers that don't support scrollend yet.
      window.addEventListener('scrollend', finish, { once: true })
      const fb = setTimeout(finish, 650)

      cancelRef.current = () => {
        done = true
        window.removeEventListener('scrollend', finish)
        clearTimeout(fb)
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      const t = setTimeout(settle, 80)
      cancelRef.current = () => clearTimeout(t)
    }

    window.addEventListener('resize', reposition)
    return () => {
      cancelRef.current?.()
      window.removeEventListener('resize', reposition)
    }
  }, [open, step, current.target, settle, reposition])

  // Always restart from step 0 when tour opens
  useEffect(() => { if (open) setStep(0) }, [open])

  // Keyboard nav
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

  const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

  return (
    <>
      {/* Full-page dark overlay — for non-spotlight steps only.
          pointer-events-none: clicks pass through, nothing dismisses the tour. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[900] pointer-events-none"
        style={{
          background: 'rgba(10,18,35,0.82)',
          opacity: spot ? 0 : 1,
          transition: 'opacity .25s ease',
        }}
      />

      {/* Spotlight ring — CSS-transitions to each new target rect.
          box-shadow creates the dark surround; the transparent center is the hole. */}
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
            '0 0 40px 8px rgba(45,212,191,0.15)',
          ].join(', '),
          transition: [
            `top .32s ${EASE}`,
            `left .32s ${EASE}`,
            `width .32s ${EASE}`,
            `height .32s ${EASE}`,
            'opacity .22s ease',
          ].join(', '),
        }}
      />

      {/* Tour card.
          - Hidden (opacity 0, no transition) until scroll settles and position is correct.
          - Once ready, fades in at exactly the right place.
          - On resize, smoothly repositions with CSS transition. */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Tour step ${step + 1} of ${STEPS.length}: ${current.title}`}
        className="fixed z-[902] bg-slate-800/95 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          top:      cardPos.top,
          left:     cardPos.left,
          width:    CARD_W,
          maxWidth: 'calc(100vw - 28px)',
          opacity:  ready ? 1 : 0,
          // Disable transitions while hidden so position snaps instantly;
          // enable them once visible so resize repositions feel smooth.
          transition: ready
            ? `top .32s ${EASE}, left .32s ${EASE}, opacity .22s ease`
            : 'none',
        }}
      >
        {/* Teal accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400/0 via-teal-400 to-teal-400/0" />

        {/* The only way to close the tour — no backdrop click */}
        <button
          onClick={onClose}
          aria-label="Skip tour"
          title="Skip tour"
          className="absolute top-3.5 right-3.5 z-10 w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/80 transition-colors"
        >
          <X size={14} />
        </button>

        {/* key={step} gives each step a fresh fade-in of its content only */}
        <div key={step} className="p-5 pt-4 animate-fade-in">

          {/* Progress bar */}
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
