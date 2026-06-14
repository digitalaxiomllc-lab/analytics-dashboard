'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronRight, ExternalLink, ArrowRight } from 'lucide-react'

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
    body: "Revenue, Customers, Settings — each tab is a standalone page with its own data and charts. This architecture lets a dashboard grow to dozens (or hundreds) of pages without accumulating technical debt. On mobile, the sidebar collapses to icons automatically.",
  },
  {
    id: 'calculator',
    target: null,
    title: 'Project cost calculator',
    body: 'Head to Settings to use the interactive cost estimator. Toggle the features you need, pick Simple / Standard / Advanced complexity, and watch the estimated budget and timeline update in real-time. No sales call required to get a ballpark.',
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

// ── Geometry ───────────────────────────────────────────────────────────────────
const CARD_W  = 344
const SPOT_PAD = 12

interface SpotRect { top: number; left: number; width: number; height: number }

function measureEl(selector: string | null): SpotRect | null {
  if (!selector) return null
  const el = document.querySelector<HTMLElement>(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

function computeCardPos(spot: SpotRect | null, cardH: number): { top: number; left: number } {
  const M = 16
  const vw = window.innerWidth
  const vh = window.innerHeight

  if (!spot) {
    return {
      top:  Math.max(M, (vh - cardH) / 2),
      left: Math.max(M, (vw - CARD_W) / 2),
    }
  }

  // Tall target (e.g. sidebar) → place card to the right
  if (spot.height > vh * 0.45) {
    const rightX = spot.left + spot.width + SPOT_PAD + M
    if (rightX + CARD_W < vw - M) {
      return { top: Math.max(M, (vh - cardH) / 2), left: rightX }
    }
  }

  // Horizontal: center on element, clamp
  let left = spot.left + spot.width / 2 - CARD_W / 2
  left = Math.max(M, Math.min(left, vw - CARD_W - M))

  // Vertical: prefer below, else above
  const belowY = spot.top + spot.height + SPOT_PAD + M
  if (belowY + cardH < vh - M) return { top: belowY, left }
  return { top: Math.max(M, spot.top - SPOT_PAD - M - cardH), left }
}

// ── Component ──────────────────────────────────────────────────────────────────
interface Props { open: boolean; onClose: () => void; onComplete?: () => void }

export default function OnboardingTour({ open, onClose, onComplete }: Props) {
  const [step, setStep]       = useState(0)
  const [spot, setSpot]       = useState<SpotRect | null>(null)
  const [cardPos, setCardPos] = useState({ top: 0, left: 0 })
  const cardRef   = useRef<HTMLDivElement>(null)
  const timerRef  = useRef<ReturnType<typeof setTimeout>>()
  const current   = STEPS[step]
  const isLast    = step === STEPS.length - 1

  const remeasure = useCallback(() => {
    const r = measureEl(current.target)
    setSpot(r)
    setCardPos(computeCardPos(r, cardRef.current?.offsetHeight ?? 240))
  }, [current.target])

  // Debounced: clears any queued measurement before scheduling a new one,
  // preventing double-flashes when the user clicks Next rapidly.
  const schedule = useCallback((ms: number) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(remeasure, ms)
  }, [remeasure])

  useEffect(() => {
    if (!open) return
    // Scroll target into view first, then measure after scroll settles
    const el = current.target ? document.querySelector<HTMLElement>(current.target) : null
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    else     window.scrollTo({ top: 0, behavior: 'smooth' })
    schedule(el ? 140 : 0)
    window.addEventListener('resize', remeasure)
    return () => { clearTimeout(timerRef.current); window.removeEventListener('resize', remeasure) }
  }, [open, step, current.target, schedule, remeasure])

  useEffect(() => { if (open) setStep(0) }, [open])

  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
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

  const EASE = 'cubic-bezier(0.25,0.46,0.45,0.94)'
  const spotTransition = `top .24s ${EASE}, left .24s ${EASE}, width .24s ${EASE}, height .24s ${EASE}, opacity .18s ease-out`

  return (
    <>
      {/* ── Backdrop ── transparent when spotlight is up (box-shadow handles darkening);
           dark when step has no target (centered modal) */}
      <div
        className="fixed inset-0 z-[900]"
        style={{
          background: 'rgba(10,18,35,0.88)',
          opacity: spot ? 0 : 1,
          transition: 'opacity .2s ease-out',
          // Still catch clicks to dismiss — even when invisible
          pointerEvents: 'auto',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Spotlight ── persistent div that CSS-transitions to each new rect.
           box-shadow creates the dark overlay; the transparent center is the "hole". */}
      <div
        aria-hidden="true"
        className="fixed z-[901] rounded-xl pointer-events-none"
        style={{
          top:     (spot?.top  ?? 0) - SPOT_PAD,
          left:    (spot?.left ?? 0) - SPOT_PAD,
          width:   (spot?.width  ?? 0) + SPOT_PAD * 2,
          height:  (spot?.height ?? 0) + SPOT_PAD * 2,
          opacity: spot ? 1 : 0,
          boxShadow: [
            '0 0 0 9999px rgba(10,18,35,0.88)',
            '0 0 0 2px #2DD4BF',
            '0 0 0 6px rgba(45,212,191,0.10)',
            '0 0 44px 10px rgba(45,212,191,0.18)',
          ].join(', '),
          transition: spotTransition,
        }}
      />

      {/* ── Card ── outer div CSS-transitions position; inner div fades content */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Tour step ${step + 1} of ${STEPS.length}: ${current.title}`}
        className="fixed z-[902] bg-slate-800 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          top:   cardPos.top,
          left:  cardPos.left,
          width: CARD_W,
          transition: `top .24s ${EASE}, left .24s ${EASE}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Content wrapper gets the key so only the text fades, not the card shell */}
        <div key={step} className="p-6 animate-fade-in">
          {/* Progress bar */}
          <div className="flex items-center gap-1.5 mb-4" aria-hidden="true">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-[3px] rounded-full transition-all duration-300 ${
                i === step ? 'flex-[2] bg-teal-400' : i < step ? 'flex-1 bg-teal-700' : 'flex-1 bg-slate-700'
              }`} />
            ))}
            <span className="shrink-0 tabular text-[11px] text-slate-500 ml-1">{step + 1}/{STEPS.length}</span>
          </div>

          <h3 className="font-heading font-semibold text-slate-100 text-[15px] leading-snug mb-2">
            {current.title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-5">
            {current.body}
          </p>

          {/* CTA button — only on steps that define one */}
          {current.cta && (
            <a
              href={current.cta.href}
              {...(current.cta.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className={`
                flex items-center justify-center gap-2 w-full mb-3
                px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors
                focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:outline-none
                ${current.cta.external
                  ? 'bg-teal-400 hover:bg-teal-300 text-slate-900'
                  : 'bg-slate-700/80 hover:bg-slate-700 text-slate-100 border border-teal-400/30 hover:border-teal-400/60'
                }
              `}
            >
              {current.cta.label}
              {current.cta.external ? <ExternalLink size={13} /> : <ArrowRight size={13} />}
            </a>
          )}

          {/* Navigation — Next / Done only (no Skip) */}
          <div className="flex justify-end">
            <button
              onClick={advance}
              autoFocus
              className="
                flex items-center gap-1.5 px-4 py-2
                bg-slate-700 hover:bg-slate-600
                text-slate-100 text-sm font-medium rounded-lg
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
