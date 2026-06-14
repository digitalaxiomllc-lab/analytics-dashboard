export type DateRange = 7 | 30 | 90

// ── Revenue area chart ────────────────────────────────────────────────────────
const revenueBase: Record<DateRange, { date: string; revenue: number; target: number }[]> = {
  7: [
    { date: 'Jun 8',  revenue: 14200, target: 13500 },
    { date: 'Jun 9',  revenue: 15800, target: 14000 },
    { date: 'Jun 10', revenue: 13900, target: 14500 },
    { date: 'Jun 11', revenue: 17100, target: 15000 },
    { date: 'Jun 12', revenue: 16400, target: 15500 },
    { date: 'Jun 13', revenue: 18900, target: 16000 },
    { date: 'Jun 14', revenue: 19500, target: 16500 },
  ],
  30: [
    { date: 'May 15', revenue: 88000,  target: 82000 },
    { date: 'May 18', revenue: 91500,  target: 85000 },
    { date: 'May 21', revenue: 87200,  target: 88000 },
    { date: 'May 24', revenue: 95600,  target: 91000 },
    { date: 'May 27', revenue: 102300, target: 94000 },
    { date: 'May 30', revenue: 98100,  target: 97000 },
    { date: 'Jun 2',  revenue: 108700, target: 100000 },
    { date: 'Jun 5',  revenue: 112400, target: 103000 },
    { date: 'Jun 8',  revenue: 107900, target: 106000 },
    { date: 'Jun 11', revenue: 119300, target: 109000 },
    { date: 'Jun 14', revenue: 124800, target: 112000 },
  ],
  90: [
    { date: 'Mar',  revenue: 241000, target: 220000 },
    { date: 'Apr 1', revenue: 268000, target: 250000 },
    { date: 'Apr 15', revenue: 255000, target: 258000 },
    { date: 'May 1', revenue: 290000, target: 270000 },
    { date: 'May 15', revenue: 312000, target: 285000 },
    { date: 'Jun 1', revenue: 338000, target: 305000 },
    { date: 'Jun 14', revenue: 357000, target: 325000 },
  ],
}

// ── Signups bar chart ─────────────────────────────────────────────────────────
const signupsBase: Record<DateRange, { week: string; signups: number }[]> = {
  7: [
    { week: 'Mon', signups: 42 },
    { week: 'Tue', signups: 58 },
    { week: 'Wed', signups: 37 },
    { week: 'Thu', signups: 71 },
    { week: 'Fri', signups: 65 },
    { week: 'Sat', signups: 29 },
    { week: 'Sun', signups: 34 },
  ],
  30: [
    { week: 'Wk 1', signups: 284 },
    { week: 'Wk 2', signups: 321 },
    { week: 'Wk 3', signups: 298 },
    { week: 'Wk 4', signups: 367 },
    { week: 'Wk 5', signups: 412 },
  ],
  90: [
    { week: 'Mar W1', signups: 810 },
    { week: 'Mar W2', signups: 745 },
    { week: 'Mar W3', signups: 890 },
    { week: 'Mar W4', signups: 920 },
    { week: 'Apr W1', signups: 980 },
    { week: 'Apr W2', signups: 1050 },
    { week: 'Apr W3', signups: 1010 },
    { week: 'Apr W4', signups: 1120 },
    { week: 'May W1', signups: 1190 },
    { week: 'May W2', signups: 1240 },
    { week: 'May W3', signups: 1180 },
    { week: 'May W4', signups: 1310 },
    { week: 'Jun W1', signups: 1420 },
  ],
}

// ── Donut plan split ──────────────────────────────────────────────────────────
const planSplitBase: Record<DateRange, { name: string; value: number; color: string }[]> = {
  7: [
    { name: 'Enterprise', value: 8200,  color: '#2DD4BF' },
    { name: 'Pro',        value: 6900,  color: '#818CF8' },
    { name: 'Free',       value: 1100,  color: '#334155' },
  ],
  30: [
    { name: 'Enterprise', value: 68400,  color: '#2DD4BF' },
    { name: 'Pro',        value: 48200,  color: '#818CF8' },
    { name: 'Free',       value: 7700,   color: '#334155' },
  ],
  90: [
    { name: 'Enterprise', value: 198000, color: '#2DD4BF' },
    { name: 'Pro',        value: 129000, color: '#818CF8' },
    { name: 'Free',       value: 21000,  color: '#334155' },
  ],
}

// ── KPI cards ─────────────────────────────────────────────────────────────────
export interface KPI {
  label: string
  value: string
  change: number // positive = up, negative = down
  invertColor?: boolean // churn: down is good
}

const kpiBase: Record<DateRange, KPI[]> = {
  7: [
    { label: 'Total Revenue',    value: '$116,300', change: +8.4 },
    { label: 'Active Users',     value: '24,812',   change: +3.1 },
    { label: 'Conversion Rate',  value: '4.82%',    change: +0.6 },
    { label: 'Churn Rate',       value: '1.24%',    change: -0.3, invertColor: true },
  ],
  30: [
    { label: 'Total Revenue',    value: '$484,800', change: +12.7 },
    { label: 'Active Users',     value: '28,340',   change: +5.8 },
    { label: 'Conversion Rate',  value: '5.14%',    change: +1.2 },
    { label: 'Churn Rate',       value: '1.09%',    change: -0.5, invertColor: true },
  ],
  90: [
    { label: 'Total Revenue',    value: '$1.42M',   change: +22.3 },
    { label: 'Active Users',     value: '31,905',   change: +14.6 },
    { label: 'Conversion Rate',  value: '5.61%',    change: +1.9 },
    { label: 'Churn Rate',       value: '0.88%',    change: -0.9, invertColor: true },
  ],
}

// ── Recent transactions ───────────────────────────────────────────────────────
export interface Transaction {
  id: string
  customer: string
  plan: 'Free' | 'Pro' | 'Enterprise'
  amount: number
  status: 'paid' | 'pending' | 'failed'
  date: string
}

export const transactions: Transaction[] = [
  { id: 'TXN-9821', customer: 'Acme Corp',         plan: 'Enterprise', amount: 4200, status: 'paid',    date: 'Jun 14' },
  { id: 'TXN-9820', customer: 'Sarah Chen',         plan: 'Pro',        amount: 49,   status: 'paid',    date: 'Jun 14' },
  { id: 'TXN-9819', customer: 'NovaTech Inc',       plan: 'Enterprise', amount: 4200, status: 'paid',    date: 'Jun 13' },
  { id: 'TXN-9818', customer: 'Marcus Webb',        plan: 'Pro',        amount: 49,   status: 'pending', date: 'Jun 13' },
  { id: 'TXN-9817', customer: 'Meridian Analytics', plan: 'Enterprise', amount: 6800, status: 'paid',    date: 'Jun 12' },
  { id: 'TXN-9816', customer: 'Lena Hoffmann',      plan: 'Pro',        amount: 49,   status: 'failed',  date: 'Jun 12' },
  { id: 'TXN-9815', customer: 'Sparq AI',           plan: 'Enterprise', amount: 4200, status: 'paid',    date: 'Jun 11' },
  { id: 'TXN-9814', customer: 'James Okafor',       plan: 'Pro',        amount: 49,   status: 'paid',    date: 'Jun 11' },
]

// ── Public accessors ──────────────────────────────────────────────────────────
export const getRevenueData = (range: DateRange) => revenueBase[range]
export const getSignupsData  = (range: DateRange) => signupsBase[range]
export const getPlanSplit    = (range: DateRange) => planSplitBase[range]
export const getKPIs         = (range: DateRange) => kpiBase[range]
