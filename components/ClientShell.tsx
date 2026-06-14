'use client'

import { ThemeProvider } from 'next-themes'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex min-h-screen bg-slate-950 dark:bg-slate-950">
        <Sidebar />
        {/* Right side: all page content slides in here via template.tsx */}
        <div className="flex-1 ml-16 md:ml-56 min-w-0 flex flex-col">
          {children}
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  )
}
