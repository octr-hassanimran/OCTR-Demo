# Energy Metering — G Valley (offline bundle)

> **Goal**: provide a polished metering dashboard UX (tabs, range chips, KPIs, charts) for demo inspiration.  
> **Status in this repo snapshot**: the full Next.js `/metering` route code is **not present** under `src/app/metering` (the directory exists but has no files).  

## What exists (ready to share)

- **Offline interactive HTML** bundle in exports:
  - `exports/energy-metering/standalone/` (folder)
  - `exports/energy-metering/metering-standalone.zip` (zip)

This is what you can share with a demo builder who “has the numbers already” and wants the layout + chart grammar.

## If/when you re-add the in-app route

Recommended Next.js (App Router) structure:

- `apps/web/src/app/metering/page.tsx`
- `apps/web/src/app/metering/layout.tsx`
- `apps/web/src/components/metering/*`
- `apps/web/src/data/g-valley-metering.ts`
- `apps/web/src/lib/metering-chart-options.ts`, `apps/web/src/lib/metering-utils.ts`, `apps/web/src/lib/echarts-theme.ts`
- `apps/web/src/components/layout/DashboardChrome.tsx`

See restoration checklist:
- `docs/dashboards/energy-metering/RESTORE-IN-APP-CHECKLIST.md`

