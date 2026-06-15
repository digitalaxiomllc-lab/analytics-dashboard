'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import RevenueChart from '@/components/RevenueChart'
import SignupsChart from '@/components/SignupsChart'
import PlanDonut from '@/components/PlanDonut'
import TransactionsTable from '@/components/TransactionsTable'
import HeroStats from '@/components/HeroStats'
import SortableKPIGrid from '@/components/SortableKPIGrid'
import SortableSections from '@/components/SortableSections'
import { getKPIs, type DateRange } from '@/lib/data'

export default function Home() {
  const [range, setRange] = useState<DateRange>(30)
  const kpis = getKPIs(range)

  return (
    <>
      <HeroStats />

      <TopBar range={range} onRangeChange={setRange} />

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
    </>
  )
}
