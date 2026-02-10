# Ticket 002: Animated Round-by-Round Competition Playback

## Summary

Replace the instant competition result display with an animated **round-by-round playback** that builds tension. Each round shows the weight being applied, pauses for suspense, then reveals whether the lizard held on — plus a strain commentary describing how close it was.

## Motivation

Ticket 001 introduced the weight-clinging competition format with round-by-round simulation, but the UI still resolves everything instantly. The player clicks "Enter Competition" and sees the final result. There's no drama, no buildup, and no sense of the lizard struggling against increasing weight.

The round-by-round data already exists in the game logic — it's just not surfaced to the player. This ticket bridges that gap by playing each round out visually, one at a time.

## Current State

**Files involved:**
- `src/renderer/src/game/types.ts` — `CompetitionResult`, `RoundDetail` (new this ticket)
- `src/renderer/src/game/competition.ts` — `simulateCompetition()`, `enterCompetition()`
- `src/renderer/src/game/defaults.ts` — `DIFFICULTIES`
- `src/renderer/src/store/weekSlice.ts` — `enterCompetition()` action
- `src/renderer/src/components/CompetitionPanel.tsx` — entry UI + results display
- `src/renderer/src/components/WeekSummaryDialog.tsx` — week-end results display

**Current flow:** Pick lizard -> pick difficulty -> instant full result -> display summary.

**What's missing:** `simulateCompetition()` calculates grip and weight per round but discards the per-round data, returning only aggregates (roundsSurvived, maxWeightHeld, detachedAtWeight).

## New Playback Experience

### User Flow

1. Player selects lizard + difficulty, clicks "Enter Competition"
2. UI transitions to a **competition playback view**:
   - **Round indicator**: "Round 1 / 5"
   - **Lizard info**: name, stickiness at entry
   - **Weight display**: the weight being applied this round (e.g. "3 kg")
   - **Suspense delay** (~1-1.5s) before the outcome is revealed
3. Outcome reveals:
   - **Hold / Detach** result
   - **Strain commentary** — a short text note based on how close the grip was to the weight (see thresholds below)
4. If the lizard **held on**: a **"Next Round"** button appears to advance
5. If the lizard **detached** or completed the **final round**: show a **summary screen** with score, rounds survived, max weight held, and a "Done" button to return to the main view

### Strain Commentary

Each round, after the outcome is revealed, a text note indicates how strained the lizard was. This is derived from the grip-to-weight ratio for that round:

| Grip / Weight Ratio | Commentary |
|---|---|
| >= 1.30 | "Barely broke a sweat" |
| >= 1.15 | "Held on with confidence" |
| >= 1.00 | "White-knuckling it!" |
| < 1.00 | "Couldn't hold on!" |

These thresholds may need tuning during implementation. The commentary adds personality and gives the player insight into how their lizard's stickiness stacks up against the difficulty.

## Type Changes

### `RoundDetail` (new)

```typescript
export interface RoundDetail {
  round: number           // 0-indexed round number
  gripStrength: number    // effective grip this round (stickiness x random)
  weight: number          // weight applied this round
  held: boolean           // whether the lizard held on
}
```

### `CompetitionResult` (updated)

```typescript
export interface CompetitionResult {
  // ... existing fields unchanged ...
  rounds: RoundDetail[]   // NEW — per-round breakdown
}
```

The `rounds` array includes all rounds that were attempted (including the final failed round, if any).

## Logic Changes

### `game/competition.ts`

`simulateCompetition()` currently calculates `gripStrength` and `roundWeight` per round but only tracks aggregates. Change it to also build and return a `RoundDetail[]` array capturing each round's data.

`enterCompetition()` passes the rounds array through to the `CompetitionResult`.

### `game/strain.ts` (new, optional)

A pure helper function to derive strain commentary from a `RoundDetail`:

```typescript
export function getStrainText(round: RoundDetail): string
```

This keeps the strain logic testable and out of the component. Could also live in `competition.ts` if a separate file feels like overkill.

## Store Changes

### `weekSlice.ts`

The `enterCompetition` action currently computes the result and immediately commits it to `pendingCompetitionResults`. With playback, the flow splits:

**Option A (simpler):** Keep the current flow. Compute all rounds up front and commit the result to the store immediately. The playback UI reads from the committed result's `rounds` array and plays them back locally using component state (current round index, reveal state). The store doesn't need to know about playback progress.

**Option B (more complex):** Add transient playback state to the store. Not recommended unless we later need other components to react to playback progress.

**Recommendation: Option A.** The playback is purely a UI concern.

## UI Changes

### `CompetitionPanel.tsx`

This is where the bulk of the work happens. The component needs new local state to manage the playback:

**New component state:**
- `playbackResult: CompetitionResult | null` — the result being played back
- `currentRound: number` — which round is currently being shown
- `phase: 'idle' | 'suspense' | 'revealed' | 'summary'` — where we are in the playback

**Phases:**
1. **idle** — normal entry form (current behavior)
2. **suspense** — round info shown, outcome hidden, timer running
3. **revealed** — outcome + strain text shown, "Next Round" or summary button visible
4. **summary** — final results screen with score and "Done" button

**Round display layout (during suspense/revealed):**
```
Round 3 / 7
-----------
[Lizard name] (stickiness: 15)

Weight: 7 kg

[suspense: spinner or "..." / revealed: "Held on!" + strain text]

[Next Round button / Done button]
```

**Transitions:**
- Enter competition -> commit to store -> set `playbackResult`, `currentRound = 0`, `phase = 'suspense'`
- After delay -> `phase = 'revealed'`
- Click "Next Round" -> `currentRound++`, `phase = 'suspense'`
- Final round revealed (or detachment) -> `phase = 'summary'`
- Click "Done" -> reset to `phase = 'idle'`

### `WeekSummaryDialog.tsx`

No changes needed — it already shows the aggregate result, which is fine for the summary view. Per-round detail is a live experience, not a historical one.

## Save Compatibility

Adding `rounds: RoundDetail[]` to `CompetitionResult` requires a save migration (v2 -> v3). Old saves won't have per-round data, so the migration backfills with an empty array:

```typescript
function migrateV2toV3(save: any): any {
  // Backfill rounds array on all CompetitionResults
  for (const result of save.pendingCompetitionResults ?? []) {
    result.rounds = result.rounds ?? []
  }
  for (const week of save.weekHistory ?? []) {
    for (const result of week.competitionResults ?? []) {
      result.rounds = result.rounds ?? []
    }
  }
  save.version = 3
  return save
}
```

Alternatively, make `rounds` optional on the type (`rounds?: RoundDetail[]`) and skip the migration. The playback UI simply won't be available for historical results (which is fine — they were never played back).

## Out of Scope

- Sound effects or visual animations beyond text transitions
- Player strategic choices during rounds (e.g. "bail out" to preserve stickiness)
- Skip / fast-forward button (could be a quick follow-up)
- Replay of past competitions from week history
- Any changes to the competition formula itself

## Files to Modify

| File | Change |
|------|--------|
| `src/renderer/src/game/types.ts` | Add `RoundDetail` interface, add `rounds` field to `CompetitionResult` |
| `src/renderer/src/game/competition.ts` | Track per-round data in `simulateCompetition()`, include in return value |
| `src/renderer/src/components/CompetitionPanel.tsx` | Add playback state machine, round-by-round display, strain text, summary screen |
| `src/renderer/src/store/saveLoadSlice.ts` | Add v2->v3 migration for `rounds` backfill (or make field optional) |
| `src/renderer/src/game/defaults.ts` | Bump `SAVE_VERSION` to 3 (if migrating) |

## Implementation Notes

- The suspense delay should feel dramatic but not annoying. Start with ~1.2s and adjust by feel.
- Strain commentary thresholds are suggestions — tune them once you can see them in context.
- The "Next Round" button keeps the player in control of pacing. No auto-advance.
- All round data is computed up front. The playback is purely a UI reveal of pre-computed results.

---

## Completion Notes

**Implemented 2026-02-09.**

### Approach taken
- **Option A (simpler)**: All rounds computed up front and committed to the store immediately. Playback is purely a UI concern managed via local component state.
- **`rounds` made optional** (`rounds?: RoundDetail[]`) on `CompetitionResult` — no save migration needed. Old saves simply won't have per-round data, and the playback UI handles this gracefully.
- **`getStrainText()`** added to `competition.ts` rather than a separate `strain.ts` file — keeps related competition logic together.
- **Save version stays at 2** — no migration required since the field is optional.

### Files modified
| File | Change |
|------|--------|
| `src/renderer/src/game/types.ts` | Added `RoundDetail` interface; added optional `rounds?: RoundDetail[]` to `CompetitionResult` |
| `src/renderer/src/game/competition.ts` | `simulateCompetition()` now builds and returns `RoundDetail[]`; added `getStrainText()` helper |
| `src/renderer/src/components/CompetitionPanel.tsx` | Full playback state machine with idle/suspense/revealed/summary phases |

### Design details
- **Suspense delay**: 1200ms (`SUSPENSE_DELAY_MS` constant)
- **Strain thresholds**: Exactly as specified in the ticket (1.30 / 1.15 / 1.00)
- **Playback phases**: `idle` → `suspense` → `revealed` → (next round or `summary`) → `idle`
- **Player controls pacing** via "Next Round" button; "See Results" button after final/failed round; "Done" button returns to entry form
- **No store changes needed** — weekSlice.ts untouched, playback state lives in component
