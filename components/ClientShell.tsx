'use client'

import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-56 min-w-0 flex flex-col">
        {children}
        <Footer />
      </div>
    </div>
  )
}
