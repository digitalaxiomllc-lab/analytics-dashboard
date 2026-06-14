'use client'

import { BarChart2, Users, DollarSign, Settings, Zap } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { label: 'Overview',  href: '/',          icon: BarChart2 },
  { label: 'Revenue',   href: '/revenue',   icon: DollarSign },
  { label: 'Customers', href: '/customers', icon: Users },
  { label: 'Settings',  href: '/settings',  icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      data-tour="sidebar"
      className="
        fixed top-0 left-0 z-30 h-screen
        w-16 md:w-56
        flex flex-col
        bg-slate-900 border-r border-slate-800
        transition-all duration-200
      "
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-3 md:px-5 border-b border-slate-800 shrink-0">
        <span className="flex items-center gap-2.5">
          <Zap size={20} className="text-teal-400 shrink-0" />
          <span className="hidden md:block font-heading font-semibold text-sm tracking-wide text-slate-100">
            Prism
          </span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5" aria-label="Main navigation">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`
                group flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm
                transition-colors duration-150
                focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none
                ${active
                  ? 'bg-teal-400/10 text-teal-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }
              `}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                size={17}
                className={`shrink-0 transition-colors ${active ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`}
              />
              <span className="hidden md:block font-sans">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 hidden md:block">
        <p className="text-xs text-slate-600 tabular">v1.4.0</p>
      </div>
    </aside>
  )
}
