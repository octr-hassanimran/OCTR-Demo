# Optimisation Algos — G Valley (interactive narrative)

> **Route**: `/optimisation-algos`  
> **Persona**: owners + FM leadership (storyboard of optimisation strategies)  
> **Focus**: explain *what* OCTR does at G‑Valley with schematics + “demo strips”  

## Key files (source of truth)

- Route entry:
  - `apps/web/src/app/optimisation-algos/page.tsx`
  - `apps/web/src/app/optimisation-algos/layout.tsx` (wraps in `DashboardChrome`)
- Main view + components:
  - `apps/web/src/components/optimisation-algos/optimisation-algos-view.tsx`
  - `apps/web/src/components/optimisation-algos/section-card.tsx`
  - `apps/web/src/components/optimisation-algos/g-valley-plant-schematic.tsx`
  - `apps/web/src/components/optimisation-algos/g-valley-ahu-schematic.tsx`
  - `apps/web/src/components/optimisation-algos/g-valley-plant-flow-canvas.tsx`
  - `apps/web/src/components/optimisation-algos/g-valley-plant-hero-3d.tsx`
  - `apps/web/src/components/optimisation-algos/gv-equipment-node.tsx`
  - `apps/web/src/components/optimisation-algos/schematic/*`
  - `apps/web/src/components/optimisation-algos/demos/*`
- Data:
  - `apps/web/src/data/g-valley-optimisation-strategies.ts`
  - `apps/web/src/data/g-valley-plant-flow.ts`

## Dependencies

- React + Next.js App Router
- `@xyflow/react` (flow canvas)
- `three`, `@react-three/fiber`, `@react-three/drei` (3D hero)
- Tailwind (styling)

