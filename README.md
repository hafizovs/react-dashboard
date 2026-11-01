## Live demo

https://hafizovs.github.io/react-dashboard/

# Analytics dashboard

## About

Filterable sales dashboard with URL-synced filters, charts, and a virtualized orders table. The default range is the last 30 days, and changing **From** / **To** updates the query string. TanStack Query, Table, and Virtual, plus Recharts and MSW, back the view.

## Capabilities

- URL-synced **From** / **To** range, defaulting to the last 30 days
- Charts with series tooltips
- Filterable, sortable, virtualized orders table

## Functionality

- Open the dashboard on the last 30 days and change **From** / **To**; refresh keeps that range
- Filter and sort the orders table, then scroll to exercise virtualization
- Hover a chart series to read its tooltip

Filterable sales dashboard with URL-synced filters, charts, and a virtualized orders table — TanStack Query/Table/Virtual, Recharts, MSW.

## Responsive layout

Partial adaptive chrome for phone (~375px) and tablet (~768px): toolbars and panels stack or collapse on narrow viewports, with no page-level horizontal scroll. Desktop-first cores (canvas, boards, dense tables) stay simplified on small screens rather than a full mobile redesign.

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
