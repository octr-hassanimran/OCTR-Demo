# Dashboards (registry + handoff)

This folder is the dashboard registry for:
- route ownership
- implementation status
- minimal copy-paste subsets

## Route registry

- **Executive Summary**
  - Route: `/`
  - Source: `apps/web/src/app/(main)`
  - Docs: `docs/dashboards/db1-executive-summary/SPEC.md`
  - Status: `active`

- **Live Operations**
  - Route: `/operations`
  - Source: `apps/web/src/app/operations`
  - Docs: `docs/dashboards/db2-live-operations/SPEC.md`
  - Status: `active`

- **Systems Intelligence**
  - Route: `/systems`
  - Source: `apps/web/src/app/systems`
  - Docs: `docs/dashboards/db3-systems-intelligence/SPEC.md`
  - Status: `active`

- **Energy Hub**
  - Route: `/energy`
  - Source: `apps/web/src/app/energy`
  - Docs: `docs/dashboards/db4-energy-hub/SPEC.md`
  - Status: `active`

- **Optimization**
  - Route: `/optimization`
  - Source: `apps/web/src/app/optimization`
  - Docs: `docs/dashboards/db5-optimization/SPEC.md`
  - Status: `active`

- **Engineering**
  - Route: `/engineering`
  - Source: `apps/web/src/app/engineering`
  - Docs: `docs/dashboards/db6-engineering/SPEC.md`
  - Status: `active`

- **Energy Metering (G-Valley)**
  - Route: `/metering`
  - Source: currently standalone artifact only
  - Docs: `docs/dashboards/energy-metering/`
  - Export: `exports/energy-metering/standalone/`
  - Status: `standalone-only`

- **Optimisation Algos (G-Valley)**
  - Route: `/optimisation-algos`
  - Source: `apps/web/src/app/optimisation-algos`, `apps/web/src/components/optimisation-algos`
  - Docs: `docs/dashboards/optimisation-algos/`
  - Status: `active`

- **Visuals Lab 1**
  - Route: `/visuals-lab-1`
  - Source: `apps/web/src/app/visuals-lab-1`
  - Docs: `docs/dashboards/visuals-lab-1/`
  - Status: `active`

## Naming policy (to prevent route drift)

- Use **kebab-case** for route folder names in `apps/web/src/app`.
- Use **American spelling (`optimization`)** for core DB5 route family.
- Keep **`optimisation-algos`** as an intentional branded route for the G-Valley narrative.
- Do not introduce new mixed spellings unless there is a product naming reason documented in the dashboard spec.

