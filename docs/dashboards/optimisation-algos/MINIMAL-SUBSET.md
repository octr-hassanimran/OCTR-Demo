# Minimal subset — Optimisation Algos

If you want to copy only the **Optimisation Algos** dashboard into another Next.js (App Router) demo, copy these files.

## 1) App route

- `apps/web/src/app/optimisation-algos/page.tsx`
- `apps/web/src/app/optimisation-algos/layout.tsx`

## 2) Components

Copy the entire folder:

- `apps/web/src/components/optimisation-algos/`

## 3) Data

- `apps/web/src/data/g-valley-optimisation-strategies.ts`
- `apps/web/src/data/g-valley-plant-flow.ts`

## 4) Shared UI / utilities required

- `apps/web/src/components/layout/DashboardChrome.tsx`
- `apps/web/src/lib/utils.ts` (for `cn`)
- `apps/web/src/app/globals.css` (theme tokens if you rely on CSS variables)

## 5) Dependencies (package.json)

Ensure these exist (versions can differ):

- `lucide-react`
- `@xyflow/react`
- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `tailwindcss` + postcss config (if you want the same styling)

