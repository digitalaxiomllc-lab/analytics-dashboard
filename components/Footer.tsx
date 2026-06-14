'use client'

import Image from 'next/image'
import { Mail, ArrowUpRight } from 'lucide-react'

const SERVICES = [
  'Custom Analytics Dashboards',
  'SaaS Admin & Ops Portals',
  'Data Visualization & Charting',
  'Investor & Executive Reporting',
  'Real-time Metrics Pipelines',
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/30">
      {/* Main grid */}
      <div className="px-6 md:px-10 lg:px-12 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-16">

          {/* ── Brand ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Logo: mix-blend-lighten makes the black bg transparent on dark surface */}
            <div className="w-[90px] h-[90px] rounded-xl overflow-hidden bg-black">
              <Image
                src="/digital-axiom-logo.png"
                alt="Digital Axiom LLC"
                width={90}
                height={90}
                className="object-cover mix-blend-lighten"
                priority={false}
              />
            </div>

            <div>
              <p className="font-heading font-semibold text-slate-100 text-[15px] leading-snug">
                Digital Axiom LLC
              </p>
              <p className="text-xs text-teal-400 font-medium mt-0.5 tracking-wide">
                Build smarter dashboards. Faster.
              </p>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-[260px]">
              We design and ship custom data products for SaaS teams,
              operators, and founders who need clarity at a glance.
            </p>
          </div>

          {/* ── Services ──────────────────────────────────────────── */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-5">
              Services
            </h4>
            <ul className="space-y-2.5">
              {SERVICES.map(s => (
                <li key={s} className="flex items-start gap-2.5">
                  <span className="mt-[5px] w-1 h-1 rounded-full bg-teal-400/60 shrink-0" />
                  <span className="text-sm text-slate-300 leading-snug">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ───────────────────────────────────────────── */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-5">
              Get in touch
            </h4>

            {/* Availability badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/8 mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] font-medium text-emerald-400">
                Available for new projects
              </span>
            </div>

            {/* Email */}
            <a
              href="mailto:digitalaxiomllc@gmail.com"
              className="
                group flex items-center gap-2.5 mb-5
                text-sm text-slate-300 hover:text-teal-300
                transition-colors
              "
            >
              <Mail size={14} className="text-slate-500 group-hover:text-teal-400 transition-colors shrink-0" />
              digitalaxiomllc@gmail.com
            </a>

            {/* CTA button */}
            <a
              href="mailto:digitalaxiomllc@gmail.com?subject=Dashboard%20Project%20Inquiry"
              className="
                inline-flex items-center gap-2
                px-4 py-2.5 rounded-xl
                bg-teal-400 hover:bg-teal-300
                text-slate-900 text-sm font-semibold
                transition-colors
                focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2
                focus-visible:ring-offset-slate-900 focus-visible:outline-none
              "
            >
              Start a project
              <ArrowUpRight size={14} />
            </a>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────── */}
      <div className="border-t border-slate-800/60 px-6 md:px-10 lg:px-12 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-slate-600">
            © {year} Digital Axiom LLC · All rights reserved.
          </p>
          <p className="text-xs text-slate-700">
            Built with Next.js · TypeScript · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
