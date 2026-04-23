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

## Prerequisites

- **Node.js** 18.18 or newer (20 LTS recommended) — [nodejs.org](https://nodejs.org/)
- **npm** (comes with Node)

Check versions:

```bash
node -v   # should be v18.18+ or v20+
npm -v
```

If you use **[nvm](https://github.com/nvm-sh/nvm)**, run `nvm use` in this directory — **`.nvmrc`** pins Node **20** to match typical local/Vercel setups.

If you use **Homebrew** on macOS, tooling for this repo is tracked in **`Brewfile`**:

```bash
brew bundle install
```

This installs the repo CLI dependencies (`node`, `gh`) and helps keep your local environment consistent.

This is a **Node.js / Next.js** project. Dependencies are declared in **`package.json`** and locked with **`package-lock.json`** (not a Python `requirements.txt`).

## Installation

Clone the repository, install dependencies, and start the dev server:

```bash
git clone https://github.com/octr-hassanimran/OCTR-Demo.git
cd OCTR-Demo
npm ci          # clean install from lockfile (preferred for CI / reproducible builds)
# or: npm install
```

### Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` only when you add integrations that need keys. The demo runs without any env vars.

### Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build (same as Vercel) |
| `npm run start` | Run production build locally (`npm run build` first) |
| `npm run lint` | ESLint |
| `npm run deploy:preview` | `npx vercel` — preview URL |
| `npm run deploy` | `npx vercel --prod` — production (CLI must be linked) |

### Cursor: Vercel coding agent plugin (optional)

Adds Vercel-focused context and slash commands in Cursor. From the project directory (requires Node/npm on your machine):

```bash
npx plugins add vercel/vercel-plugin
```

Or in Cursor: **`/add-plugin vercel`**. See [Vercel docs: Agent resources](https://vercel.com/docs/agent-resources/vercel-plugin).

## Repository Map

### Folder guide (what belongs where)

- `apps/web/` — production Next.js app (single source of truth)
- `docs/` — specifications, references, design system, and handoff notes
- `exports/` — shareable standalone deliverables (HTML bundles, zips)
- `tooling/` — local dev tooling files (brew, node version)

Dashboard-specific implementation + handoff mapping lives in:
- `docs/dashboards/README.md`

## Project Structure

```
├── docs/                          # Documentation, specs, and references
│   ├── DASHBOARD-INDEX.md         # Dashboard map and build order
│   ├── TECH-STACK.md              # Libraries, versions, rationale
│   ├── WORKFLOW.md                # Cursor/Claude workflow notes
│   ├── SYNTHETIC-DATA.md          # Synthetic data schema and storyline
│   ├── dashboards/                # Dashboard registry + per-dashboard specs
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
│   └── planning/                  # Planning notes
│       └── PLANNING-CHAT.md
├── exports/                       # Standalone handoff artifacts
│   └── energy-metering/
│       ├── standalone/
│       └── metering-standalone.zip
├── apps/
│   └── web/                       # Next.js application
│       ├── src/                   # App Router source (routes/components/data/lib)
│       ├── public/                # Static assets
│       ├── next.config.mjs
│       ├── tailwind.config.ts
│       └── tsconfig.json
├── tooling/                       # Local tooling (brew + node version)
│   ├── Brewfile
│   └── .nvmrc
├── .env.example                   # Template for `.env.local` (optional keys)
├── package.json
├── package-lock.json
└── (workspace root)
```

## Getting Started (quick)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a full setup, see **Installation** above.

## Deployment

The demo is meant to run on **[Vercel](https://vercel.com)** so you get a shareable `https://….vercel.app` URL for your cofounder (no extra auth required for a trusted link).

**Recommended:** connect your Git repo to Vercel — every push to `main` deploys production; other branches get preview URLs for safe iteration.

```bash
npm run deploy:preview   # npx vercel — preview URL
npm run deploy           # npx vercel --prod — production (requires Vercel CLI linked)
```

Full step-by-step (GitHub import, production branch, troubleshooting): **[docs/DEPLOY.md](docs/DEPLOY.md)**.

## GitHub Pre-publish Checklist

Before pushing for team review:

- [ ] `npm run build` succeeds locally.
- [ ] Root folder is clean: no throwaway files, screenshots, temp notes.
- [ ] Standalone/demo deliverables are under `exports/` (not repo root).
- [ ] `docs/dashboards/README.md` reflects current route status (`active`, `standalone-only`, `planned`).
- [ ] New dashboard work includes `SPEC.md` + `MINIMAL-SUBSET.md`.
- [ ] Route naming stays consistent (see dashboard naming policy).

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
