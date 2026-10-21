# 02-dashboard — agent instructions

Filterable analytics dashboard (Vite + FSD). Parent canon: `../AGENTS.md`, spec: `../plans/02-dashboard.md`.

## Commands

- Install (workspace root): `pnpm install`
- Dev: `pnpm dev` (port 5002, strict)
- Verify: `pnpm check` (= typecheck + test)
- Build: `pnpm build`

Use `pnpm` only.

## FSD map

- `src/app` — providers (Query, nuqs, sonner), root App
- `src/pages/dashboard` — dashboard screen
- `src/widgets/filter-bar`, `revenue-chart`, `channel-chart`, `orders-table`
- `src/features/dashboard-filters`, `export-orders-csv`
- `src/entities/order`, `metrics`
- `src/shared/api`, `ui`, `lib`, `config`, `mocks`

## Boundaries

- Imports only downward in FSD; public API via slice `index.ts`.
- Server state: TanStack Query. URL filters: nuqs (`useDashboardFilters`).
- MSW: `GET /api/orders`, `GET /api/metrics`.
- Module Federation remote `dashboard`, expose `./App`; federation disabled in Vitest (`mode === 'test'`).

## Ready criteria

`pnpm check` green and README demo scenario works manually.
