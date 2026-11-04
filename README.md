# PMatrix

PMatrix is the product repository for PODI MATRIX, a fermentation and flavor-engineering workspace for next-generation plant-based foods.

The product turns a plant-protein starting point, flavor direction, off-note profile, cooking method, and process constraints into a deterministic flavor-design hypothesis. Outputs are starting points for laboratory and sensory work—not claims of taste parity or regulatory approval.

## Product surface

- **Landing page** — explains the protein-to-flavor workflow and the matrix pipeline.
- **Flavor Studio** — planned workspace for entering a protein brief and generating a matrix.
- **Matrix Library** — planned workspace for saving and comparing designs.
- **Fermentation Lab** — planned workspace for route and process planning.
- **Flavor Fingerprint** — planned workspace for baseline-versus-designed sensory vectors.

Workspace route coverage is tracked in [Issue #2](https://github.com/simplyshree/PMatrix/issues/2), and the matrix builder is tracked in [Issue #3](https://github.com/simplyshree/PMatrix/issues/3).

## Architecture

- `src/routes/` — TanStack Start file-based routes.
- `src/components/podi/` — PODI MATRIX product shell, panels, charts, and reusable UI.
- `src/lib/podi-engine.ts` — deterministic domain model, vocabulary, fingerprints, routes, and podi formulation hypotheses.
- `src/lib/podi-store.ts` — current browser-local design store; durable persistence is tracked in [Issue #5](https://github.com/simplyshree/PMatrix/issues/5).
- `src/styles.css` — Tailwind v4 design tokens and PODI MATRIX visual system.
- `AGENTS.md` — Lovable synchronization constraints; preserve this guidance when contributing.

## Local development

Requirements: Node.js 20+ or Bun.

```sh
git clone https://github.com/simplyshree/PMatrix.git
cd PMatrix
bun install
bun run dev
```

Open the local URL printed by Vite. The available quality commands are:

```sh
bun run lint
bun run build
```

npm users can run the same scripts with `npm install` and `npm run <script>`.

## Scientific and product safety

PMatrix outputs are modeled hypotheses. Every generated matrix must be reviewed against:

- analytical chemistry and process data;
- allergen and ingredient constraints;
- sensory-panel results;
- product-specific regulatory and safety requirements.

Do not interpret a similarity index, fermentation route, or chemical association as a validated result without experimental evidence.

## Lovable development

This repository is connected to [Lovable](https://lovable.dev). Commits pushed to the connected branch can sync into the Lovable editor. Avoid force-pushing, rebasing, amending, or squashing commits that have already been published.
