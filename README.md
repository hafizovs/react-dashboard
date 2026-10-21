# 02 — Analytics dashboard

**Live:** https://hafizovs.github.io/react-dashboard/

Filterable sales dashboard with charts and a virtualized orders table for a React CV portfolio.

**CV line:** analytics dashboard with URL-synced filters, TanStack Table/Query, Recharts, and MSW-backed APIs

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, Feature-Sliced Design, TanStack Query, TanStack Table, `@tanstack/react-virtual`, Recharts, nuqs, date-fns, Zod, MSW, sonner.


## How to run

```bash
# from portfolio_react/
pnpm install
pnpm dev
```

Open **http://localhost:5002**

See also [docs/RUNBOOK.md](../docs/RUNBOOK.md).

## Scripts

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
```

Dev server: **http://localhost:5002** (`strictPort`). Module Federation remote name: `dashboard`, expose `./App`.

## Manual demo

1. Open the dashboard — default range is the last 30 days.
2. Change **From** / **To** — query params update; refresh keeps the same view.
3. Inspect the revenue line chart and channel pie/bar toggle.
4. Sort columns, paginate, toggle column visibility, export CSV of visible columns on the current page.
5. Narrow the range until charts and table show empty states.

## Interview talking points

- URL state with nuqs vs server state with TanStack Query
- Server-driven sort/pagination vs client column visibility
- Row virtualization for large tables
- Zod at API boundaries and MSW handlers for deterministic demos
- FSD slice boundaries (`entities/order`, `widgets/orders-table`, etc.)
