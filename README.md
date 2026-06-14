# Prism Analytics

A premium SaaS analytics dashboard — a calm "control room" aesthetic built with Next.js 14, TypeScript, Tailwind CSS, and Recharts.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| Icons | lucide-react |
| Fonts | Sora (headings) · Inter (UI) · IBM Plex Mono (numbers) via `next/font` |
| Theme | next-themes (dark default, light toggle) |

## Design tokens

- **Base:** `#0F172A` slate-950
- **Card:** `#1E293B` slate-800 @ 60% opacity
- **Border:** `#334155` slate-700
- **Accent:** `#2DD4BF` teal-400
- **Text:** `#F8FAFC` / `#CBD5E1`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **4 KPI cards** — Revenue, Active Users, Conversion Rate, Churn Rate with change pills
- **Area chart** — revenue vs. target over time
- **Bar chart** — new signups per period
- **Donut chart** — revenue split by Free / Pro / Enterprise plan
- **Transactions table** — 8 recent transactions with status badges
- **Date range selector** — Last 7 / 30 / 90 days; all charts update reactively
- **Light / dark toggle** — dark is default
- **Responsive** — sidebar collapses to icon-only on mobile
- **Accessible** — visible keyboard focus states, `aria-current`, `aria-label`, `role="group"`, `aria-pressed`
- **Reduced motion** — respects `prefers-reduced-motion`
- **No backend** — all data is hardcoded in `lib/data.ts`
