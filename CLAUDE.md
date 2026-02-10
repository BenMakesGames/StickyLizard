# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Setae?

A lizard management sim — single-player desktop game built with Electron. Core loop: get lizard → train → compete → repeat, plus save/load. Distributed via itch.io for Windows/Mac/Linux.

## Commands

```bash
npm run dev          # Dev server + Electron window (hot reload)
npm run build        # Production build (electron-vite → out/)
npm run build:win    # Windows installer (NSIS)
npm run build:mac    # macOS build
npm run build:linux  # Linux build
npx tsc --noEmit     # Type check (no linter configured yet)
```

## Architecture

Three-process Electron app with strict separation:

```
src/main/          → Electron main process (window, IPC handlers, native dialogs)
src/preload/       → Bridge exposing window.api to renderer (save/load)
src/shared/        → Code shared between main + renderer (IPC channel constants)
src/renderer/src/  → React app
```

### Renderer internals — the key separation

- **`game/`** — Pure game logic functions. **No React, no Zustand, no framework imports.** This is the game engine. Contains types, constants, formulas for training/competition/week advancement.
- **`store/`** — Zustand store using the slices pattern. Calls into `game/` functions. Three slices: `lizardSlice` (add/set activity), `weekSlice` (advance week/enter competition), `saveLoadSlice` (serialize via IPC).
- **`components/`** — React components that read from the store. `ui/` subdirectory has shadcn/ui primitives.

Data flows one way: **components → store actions → game logic → store state → components**.

### Path aliases

- `@renderer/*` → `src/renderer/src/*`
- `@shared/*` → `src/shared/*`

Configured in both `tsconfig.web.json` and `electron.vite.config.ts`.

### IPC bridge

`src/shared/ipc.ts` defines channel names. Main process registers `ipcMain.handle()` handlers. Preload exposes them via `contextBridge`. Renderer accesses `window.api.saveGame(json)` and `window.api.loadGame()`. Types live in `src/preload/index.d.ts`.

## Game formulas

- **Training:** `gain = 5 / (1 + stickiness / 50)` — diminishing returns
- **Competition:** Weight-clinging format. Each round: `gripStrength = stickiness × random(0.85–1.15)` vs `roundWeight = baseWeight + (round × weightIncrement)`. Lizard holds if grip >= weight, otherwise detaches.
- **Difficulty tiers** (`DIFFICULTIES` in `defaults.ts`): each defines rounds, baseWeight, weightIncrement, multiplier, and label.
  - Easy: 5 rounds, base 2, increment 1, x1.0
  - Medium: 7 rounds, base 3, increment 2, x1.5
  - Hard: 10 rounds, base 5, increment 3, x2.5
  - Extreme: 12 rounds, base 8, increment 5, x4.0
- **Competition score:** `roundsSurvived × difficultyMultiplier`
- **Competing:** always grants +1 stickiness; one competition per lizard per week
- **Competition playback:** Results are played back round-by-round with a 1.2s suspense delay per round. Strain commentary (`getStrainText()` in `competition.ts`) shows grip-to-weight ratio feedback. Player advances with "Next Round" button. All rounds are pre-computed; playback is a UI concern managed via local component state in `CompetitionPanel.tsx`.
- **`RoundDetail`** type stores per-round data (round, gripStrength, weight, held). Optional `rounds?: RoundDetail[]` field on `CompetitionResult` — no save migration needed.

## Key conventions

- **electron-vite v5** does NOT export `./runtime`. Use `@electron-toolkit/utils` for `is.dev`.
- **Tailwind CSS v4** — uses `@import "tailwindcss"` and `@theme {}` in `globals.css`. No `tailwind.config.js`.
- **shadcn/ui components** are manually placed in `components/ui/`, not installed via CLI. They import `cn()` from `@renderer/lib/utils`.
- **Zustand slices** are typed as `StateCreator<GameStore, [], [], SliceType>` and combined in `gameStore.ts`.
- **Save format** is JSON at version 2. Migration chain in `saveLoadSlice.ts` handles older saves (v1→v2 backfills new `CompetitionResult` fields).
- New lizards start with stickiness 10, default activity "idle".

## Design decisions

See `docs/decisions.md` for the full rationale log (tech stack choices, gameplay mechanics, what's deferred to post-MVP).
