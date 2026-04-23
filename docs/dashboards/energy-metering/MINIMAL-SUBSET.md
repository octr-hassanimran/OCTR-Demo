# Minimal subset — Energy Metering

In this repo snapshot, the in-app Next.js `/metering` implementation is **not present** under `src/app/metering` and `src/components/metering` (directories exist but have no files).

## What you can copy today (works offline)

- `exports/energy-metering/standalone/`
  - `index.html`
  - `echarts.min.js`
  - `data.example.js`
  - `README.md`
- `exports/energy-metering/metering-standalone.zip`

## If you restore the Next.js route later

These are the recommended files to copy:

- `apps/web/src/app/metering/page.tsx`
- `apps/web/src/app/metering/layout.tsx`
- `apps/web/src/components/metering/` (entire folder)
- `apps/web/src/data/g-valley-metering.ts`
- `apps/web/src/lib/metering-chart-options.ts`
- `apps/web/src/lib/metering-utils.ts`
- `apps/web/src/lib/echarts-theme.ts`
- `apps/web/src/components/layout/DashboardChrome.tsx`
- `apps/web/src/lib/utils.ts`
- `apps/web/src/app/globals.css`

