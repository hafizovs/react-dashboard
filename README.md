## Live demo

https://hafizovs.github.io/react-dashboard/

# Analytics dashboard

Filterable sales dashboard with URL-synced filters, charts, and a virtualized orders table — TanStack Query/Table/Virtual, Recharts, MSW.

## Scripts

```bash
pnpm install
pnpm dev          # http://localhost:5002
pnpm check
pnpm build
```

## Manual demo

1. Open the dashboard — default range is the last 30 days.
2. Change **From** / **To** — query params update; refresh keeps the same view.
3. Filter / sort the orders table; scroll to exercise virtualization.
4. Hover chart series for tooltips.
