# Restore checklist — `/metering` in-app route

Use this checklist when restoring Energy Metering as a first-class Next.js route.

## 1) Route and layout

- [ ] Create `apps/web/src/app/metering/page.tsx`
- [ ] Create `apps/web/src/app/metering/layout.tsx` (wrap with `DashboardChrome`)
- [ ] Add `/metering` nav item in `apps/web/src/components/layout/Sidebar.tsx`

## 2) Feature components

- [ ] Restore/create `apps/web/src/components/metering/` with:
  - `metering-header.tsx`
  - `metering-data-lineage.tsx`
  - `metering-kpi-strip.tsx`
  - `metering-combined-section.tsx`
  - `metering-electricity-charts.tsx`
  - `metering-gas-charts.tsx`
  - `metering-ledgers.tsx`
  - `metering-status-chip.tsx`

## 3) Data and chart helpers

- [ ] Add `apps/web/src/data/g-valley-metering.ts`
- [ ] Add `apps/web/src/lib/metering-chart-options.ts`
- [ ] Add `apps/web/src/lib/metering-utils.ts`
- [ ] Reuse `apps/web/src/lib/echarts-theme.ts`

## 4) Validation

- [ ] `npm run dev` and verify `/metering` renders.
- [ ] `npm run build` passes.
- [ ] Update docs status in `docs/dashboards/README.md` from `standalone-only` to `active`.

