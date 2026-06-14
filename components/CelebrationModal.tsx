'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'

interface Props {
  show: boolean
  onClose: () => void
}

export default function CelebrationModal({ show, onClose }: Props) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (!show || firedRef.current) return
    firedRef.current = true

    import('canvas-confetti').then(mod => {
      const confetti = mod.default as (opts: object) => void
      const end = Date.now() + 2600
      const COLORS = ['#2DD4BF', '#818CF8', '#F472B6', '#FB923C', '#34D399', '#60A5FA']

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 60,
          startVelocity: 65,
          origin: { x: 0, y: 0.55 },
          colors: COLORS,
          zIndex: 960,
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 60,
          startVelocity: 65,
          origin: { x: 1, y: 0.55 },
          colors: COLORS,
          zIndex: 960,
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    })
  }, [show])

  // Reset so confetti fires again if tour is re-triggered + completed
  useEffect(() => {
    if (!show) firedRef.current = false
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 z-[950] bg-slate-950/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed z-[951] inset-0 flex items-center justify-center p-4 pointer-events-none"
            aria-hidden="true"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Ready to build your dashboard?"
              className="pointer-events-auto w-full max-w-sm"
              initial={{ opacity: 0, scale: 0.82, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320, mass: 0.8 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative bg-slate-800 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
                {/* Teal glow accent at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400/0 via-teal-400 to-teal-400/0" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
                >
                  <X size={14} />
                </button>

                <div className="px-8 pb-8 pt-7 text-center">
                  <div
                    className="text-5xl mb-5 select-none"
                    role="img"
                    aria-label="Party popper"
                  >
                    🎉
                  </div>

                  <h2 className="font-heading font-bold text-slate-100 text-xl leading-tight mb-2">
                    Ready to build your dashboard?
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed mb-7 max-w-xs mx-auto">
                    You've seen what a polished data product looks like. Let's build yours — faster than you think.
                  </p>

                  <a
                    href="mailto:digitalaxiomllc@gmail.com"
                    className="
                      flex items-center justify-center gap-2 w-full
                      px-5 py-3 rounded-xl
                      bg-teal-400 hover:bg-teal-300
                      text-slate-900 font-semibold text-sm
                      transition-colors
                      focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:outline-none
                    "
                  >
                    Get a quote
                    <ExternalLink size={13} />
                  </a>

                  <button
                    onClick={onClose}
                    className="mt-3 text-xs text-slate-600 hover:text-slate-400 transition-colors w-full py-1"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
