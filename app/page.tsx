'use client'

import { useState, useEffect, useCallback } from 'react'
import TopBar from '@/components/TopBar'
import RevenueChart from '@/components/RevenueChart'
import SignupsChart from '@/components/SignupsChart'
import PlanDonut from '@/components/PlanDonut'
import TransactionsTable from '@/components/TransactionsTable'
import OnboardingTour from '@/components/OnboardingTour'
import HeroStats from '@/components/HeroStats'
import CelebrationModal from '@/components/CelebrationModal'
import SortableKPIGrid from '@/components/SortableKPIGrid'
import SortableSections from '@/components/SortableSections'
import { getKPIs, type DateRange } from '@/lib/data'

const TOUR_KEY = 'prism_tour_v1_done'

export default function Home() {
  const [range, setRange]                   = useState<DateRange>(30)
  const [tourOpen, setTourOpen]             = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const kpis = getKPIs(range)

  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      const t = setTimeout(() => setTourOpen(true), 400)
      return () => clearTimeout(t)
    }
  }, [])

  const closeTour = useCallback(() => {
    setTourOpen(false)
    localStorage.setItem(TOUR_KEY, '1')
  }, [])

  const handleTourComplete = useCallback(() => {
    setShowCelebration(true)
  }, [])

  return (
    <>
      <TopBar
        range={range}
        onRangeChange={setRange}
        onStartTour={() => setTourOpen(true)}
      />

      <HeroStats />

      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-5 md:space-y-6">
        <section aria-label="Key performance indicators">
          <SortableKPIGrid kpis={kpis} />
        </section>

        <SortableSections
          sections={[
            {
              id: 'revenue',
              label: 'Revenue chart',
              children: (
                <section aria-label="Revenue over time" data-tour="revenue-chart">
                  <RevenueChart range={range} />
                </section>
              ),
            },
            {
              id: 'charts-row',
              label: 'Signups and plan distribution',
              children: (
                <section
                  aria-label="Signups and plan distribution"
                  data-tour="charts-row"
                  className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6"
                >
                  <div className="lg:col-span-2">
                    <SignupsChart range={range} />
                  </div>
                  <div>
                    <PlanDonut range={range} />
                  </div>
                </section>
              ),
            },
            {
              id: 'transactions',
              label: 'Recent transactions',
              children: (
                <section aria-label="Recent transactions" data-tour="transactions">
                  <TransactionsTable />
                </section>
              ),
            },
          ]}
        />
      </main>

      <OnboardingTour
        open={tourOpen}
        onClose={closeTour}
        onComplete={handleTourComplete}
      />
      <CelebrationModal
        show={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
    </>
  )
}
