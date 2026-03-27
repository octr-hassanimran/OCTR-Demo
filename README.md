# OCTR Energy Optimization Demo

A polished, investor-ready product demo for OCTR -- a building energy optimization platform in the real estate sector. Dark forest/matcha theme, publishable-quality charts, interactive 3D building visualization, and 20 OEH/AIRAH optimization strategies as the core differentiator.

## Dashboard Architecture

Six dashboards forming a closed performance loop:

```
DB-1  Executive Summary         ← "How are we doing overall?"
DB-2  Live Operations           ← "What needs attention RIGHT NOW?"
DB-3  Systems Intelligence      ← "Which systems are causing it?"
DB-4  Energy Hub & Metering     ← "How much energy and cost?"
DB-5  Optimization & Analytics  ← "Are our strategies working?"
DB-6  Engineering & Data        ← [INTERNAL USE ONLY]
```

See [docs/DASHBOARD-INDEX.md](docs/DASHBOARD-INDEX.md) for the full spec index and strategy mapping.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui, themed via CSS variables
- **Charts**: shadcn/Recharts (KPIs) + Apache ECharts (heatmaps, Sankey, gauges, scatter)
- **3D**: React Three Fiber + @react-three/drei (building visualization)
- **Maps**: Mapbox GL JS (3D urban context)
- **Animation**: Framer Motion (micro-interactions, transitions)
- **Data**: Synthetic seed dataset with adapter interface for future real BAS/BEMS

See [docs/TECH-STACK.md](docs/TECH-STACK.md) for full details and install commands.

## Project Structure

```
├── docs/                          # All documentation and specs
│   ├── DASHBOARD-INDEX.md         # Dashboard map and build order
│   ├── TECH-STACK.md              # Libraries, versions, rationale
│   ├── WORKFLOW.md                # Cursor/Claude workflow notes
│   ├── SYNTHETIC-DATA.md          # Synthetic data schema and storyline
│   ├── dashboards/                # One folder per dashboard
│   │   ├── db1-executive-summary/
│   │   │   └── SPEC.md
│   │   ├── db2-live-operations/
│   │   │   └── SPEC.md
│   │   ├── db3-systems-intelligence/
│   │   │   └── SPEC.md
│   │   ├── db4-energy-hub/
│   │   │   └── SPEC.md
│   │   ├── db5-optimization/
│   │   │   └── SPEC.md
│   │   └── db6-engineering/
│   │       └── SPEC.md
│   ├── design-system/             # Design tokens, palette, chart theme
│   │   ├── tokens.css
│   │   ├── palette.json
│   │   ├── chart-theme.json
│   │   ├── DESIGN-SYSTEM.md
│   │   └── demo-page-outline.md
│   ├── references/                # Competitor screenshots, inspiration links
│   │   └── REFERENCES.md
│   └── planning/                  # Planning chat archive
│       ├── PLANNING-CHAT.md
│       └── PLANNING-CHAT-FULL-EXPORT.md
├── src/                           # Next.js application source
│   ├── app/                       # App Router pages
│   ├── components/                # Shared UI components
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── charts/                # Chart wrapper components
│   │   ├── layout/                # Sidebar, header, drawer
│   │   └── three/                 # 3D building components
│   ├── data/                      # Synthetic data seed files
│   └── lib/                       # Utilities, types, adapters
├── public/                        # Static assets
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The demo is meant to run on **[Vercel](https://vercel.com)** so you get a shareable `https://….vercel.app` URL for your cofounder (no extra auth required for a trusted link).

**Recommended:** connect your Git repo to Vercel — every push to `main` deploys production; other branches get preview URLs for safe iteration.

```bash
npm run deploy:preview   # npx vercel — preview URL
npm run deploy           # npx vercel --prod — production (requires Vercel CLI linked)
```

Full step-by-step (GitHub import, production branch, troubleshooting): **[docs/DEPLOY.md](docs/DEPLOY.md)**.

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, perf, test, chore
Scopes: db1, db2, db3, db4, db5, db6, layout, design-system, data, deploy
```

Examples:
- `feat(db1): add KPI tiles with sparklines and delta arrows`
- `feat(db3): implement water-side one-line SCADA diagram`
- `docs(db5): update strategy scorecard spec with deep-dive details`
- `chore(deploy): configure Vercel project settings`

Every commit should be self-contained and the app should build cleanly after each one.

## Design Anchors

When in doubt, refer back to these:
- **Supabase** -- hover micro-interactions, "alive" UI
- **WindPulse** (Behance) -- chart styling, dark theme, data density
- **Orion UI Kit** -- infographic-quality data visualization
- **Sourceful Energy** -- energy-specific component patterns

See [docs/references/REFERENCES.md](docs/references/REFERENCES.md) for all links and competitor screenshots.
