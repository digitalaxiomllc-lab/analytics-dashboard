'use client'

import { transactions, type Transaction } from '@/lib/data'

const statusStyle: Record<Transaction['status'], string> = {
  paid:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  failed:  'bg-red-500/10 text-red-400 border-red-500/20',
}

const planStyle: Record<Transaction['plan'], string> = {
  Enterprise: 'text-teal-400',
  Pro:        'text-indigo-400',
  Free:       'text-slate-500',
}

export default function TransactionsTable() {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 md:px-6 py-4 border-b border-slate-700/60">
        <h2 className="font-heading font-semibold text-slate-200 text-sm">Recent transactions</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs" aria-label="Recent transactions">
          <thead>
            <tr className="border-b border-slate-700/40">
              {['Transaction', 'Customer', 'Plan', 'Amount', 'Status', 'Date'].map(h => (
                <th
                  key={h}
                  className="px-5 md:px-6 py-3 text-left text-slate-500 font-medium uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {transactions.map(tx => (
              <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-5 md:px-6 py-3.5 tabular text-slate-400 whitespace-nowrap">{tx.id}</td>
                <td className="px-5 md:px-6 py-3.5 text-slate-200 whitespace-nowrap">{tx.customer}</td>
                <td className={`px-5 md:px-6 py-3.5 font-medium whitespace-nowrap ${planStyle[tx.plan]}`}>
                  {tx.plan}
                </td>
                <td className="px-5 md:px-6 py-3.5 tabular text-slate-200 whitespace-nowrap">
                  ${tx.amount.toLocaleString()}
                </td>
                <td className="px-5 md:px-6 py-3.5 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium capitalize ${statusStyle[tx.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      tx.status === 'paid' ? 'bg-emerald-400' :
                      tx.status === 'pending' ? 'bg-amber-400' : 'bg-red-400'
                    }`} />
                    {tx.status}
                  </span>
                </td>
                <td className="px-5 md:px-6 py-3.5 tabular text-slate-500 whitespace-nowrap">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
