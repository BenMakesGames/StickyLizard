# Ticket 001: Competition Rework — Weight-Clinging Format

## Summary

Replace the current single-roll score calculation with a multi-round **weight-clinging** competition inspired by real-world dog weight pull events and gecko adhesion science. Lizards cling to a surface while weight is progressively added each round. The lizard that holds on through the most rounds wins.

## Motivation

The current competition system is a single opaque calculation: `stickiness x multiplier x random`. The player picks a difficulty, clicks a button, and gets a number. There's no tension, no decision-making during the event, and no narrative to follow. The result is meaningless beyond "bigger number = better."

A round-by-round weight-clinging format gives the player:
- A progression to watch unfold (will my lizard hold on?)
- Results that tell a story ("held through round 7 of 10, detached at 35kg")
- A connection between the stickiness stat and what's actually happening in-game
- A basis for future features like spectating, commentary, or strategic choices

## Current State

**Files involved:**
- `src/renderer/src/game/types.ts` — `CompetitionResult`, `Difficulty`
- `src/renderer/src/game/competition.ts` — `calculateCompetitionScore()`, `enterCompetition()`
- `src/renderer/src/game/defaults.ts` — `DIFFICULTY_MULTIPLIERS`
- `src/renderer/src/store/weekSlice.ts` — `enterCompetition()` action
- `src/renderer/src/components/CompetitionPanel.tsx` — entry UI + results display
- `src/renderer/src/components/WeekSummaryDialog.tsx` — week-end results display
- `src/renderer/src/components/LizardCard.tsx` — "Competed" badge

**Current formula:** `score = stickiness × DIFFICULTY_MULTIPLIERS[difficulty] × random(0.8–1.2)`

**Current flow:** Pick lizard → pick difficulty → instant score → +1 stickiness always.

## New Competition Format

### Concept

The competition is a **weight-clinging challenge**. The lizard clings to a vertical surface while increasingly heavy weights are attached to its body. Each round adds more weight. The lizard holds on or detaches. The competition ends when the lizard falls.

### Round Structure

A competition consists of up to **N rounds** (determined by difficulty). Each round:

1. A weight value is set for the round (starts low, increases each round).
2. A **hold check** determines whether the lizard clings on or detaches.
3. If the lizard holds, it advances to the next round. If it detaches, the competition ends.

The result records how many rounds the lizard survived and the maximum weight held.

### Hold Check Formula

Each round, the lizard's effective grip is compared to the weight:

```
gripStrength = stickiness × random(0.85–1.15)
roundWeight  = baseWeight + (round × weightIncrement)

hold = gripStrength >= roundWeight
```

- `baseWeight` and `weightIncrement` scale with difficulty.
- The random factor means a lizard might fail earlier or later than expected — there's always tension.

### Difficulty Tiers

Each difficulty tier defines the competition parameters:

| Difficulty | Rounds | Base Weight | Weight Increment | Description |
|------------|--------|-------------|------------------|-------------|
| Easy       | 5      | 2           | 1                | Lightweight amateur event |
| Medium     | 7      | 3           | 2                | Regional qualifier |
| Hard       | 10     | 5           | 3                | National championship |
| Extreme    | 12     | 8           | 5                | Legendary invitational |

These values will need playtesting and balancing against the stickiness curve (lizards start at 10, training gives diminishing returns via `5 / (1 + stickiness / 50)`).

### Scoring

```
score = roundsSurvived × difficultyMultiplier
```

The difficulty multipliers can stay the same (easy=1.0, medium=1.5, hard=2.5, extreme=4.0) or be retuned. The score is no longer the primary point of interest — rounds survived and max weight held are the headline stats — but score remains as a comparable number across difficulties.

### Stickiness Reward

Keep +1 stickiness for competing, regardless of outcome. This is a good base mechanic. Future tickets can revisit scaling rewards by performance.

## Type Changes

### `CompetitionResult` (updated)

```typescript
export interface CompetitionResult {
  lizardId: string
  lizardName: string
  difficulty: Difficulty
  score: number
  stickinessAtEntry: number
  roundsSurvived: number      // NEW — how many rounds the lizard held on
  totalRounds: number         // NEW — max possible rounds for this difficulty
  maxWeightHeld: number       // NEW — heaviest weight successfully held
  detachedAtWeight: number    // NEW — weight that caused detachment (0 if completed all rounds)
}
```

### Difficulty Config (new)

```typescript
export interface DifficultyConfig {
  rounds: number
  baseWeight: number
  weightIncrement: number
  multiplier: number
  label: string               // "Lightweight Amateur", "Regional Qualifier", etc.
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = { ... }
```

This replaces the flat `DIFFICULTY_MULTIPLIERS` record with a richer config object.

## Logic Changes

### `game/competition.ts`

Replace `calculateCompetitionScore()` with a `simulateCompetition()` function that runs the round loop and returns a full `CompetitionResult`. The function should:

1. Accept `stickiness`, `difficulty`, and an optional `randomSeed` (for testability).
2. Loop through rounds, running the hold check each round.
3. Return the result with all new fields populated.

`enterCompetition()` calls `simulateCompetition()` instead of `calculateCompetitionScore()`.

## UI Changes

### `CompetitionPanel.tsx`

**Pending results display** — Instead of just `"{name} — {score} pts"`, show:

```
{name} — Held {roundsSurvived}/{totalRounds} rounds (max {maxWeightHeld}kg)
```

Score can still appear but is secondary.

### `WeekSummaryDialog.tsx`

Same treatment — show rounds survived and max weight held as the primary stats, score as secondary.

### Future (not this ticket)

- Animated round-by-round reveal (show each round resolving one at a time)
- Competition log / play-by-play text

## Save Compatibility

The `CompetitionResult` type gains new required fields. This means:

- Existing saves with old-format `CompetitionResult` entries in `pendingCompetitionResults` or `weekHistory` will break if loaded without migration.
- **Save version should bump to 2.** Add a migration function that backfills old results with sensible defaults (e.g., `roundsSurvived: 0, totalRounds: 0, maxWeightHeld: 0, detachedAtWeight: 0`).
- This is the first real use of the `version` field in the save format.

## Out of Scope

- Weight classes / lizard size stats (separate ticket)
- Named competition events / flavor text (separate ticket)
- Competition history UI / week history browser (separate ticket)
- Entry fees or economy (deferred per decisions.md)
- Rankings / leaderboards (separate ticket)
- Round-by-round animation or play-by-play (future enhancement)
- Strategic choices during competition like passing rounds (future enhancement)

## Files to Modify

| File | Change |
|------|--------|
| `src/renderer/src/game/types.ts` | Update `CompetitionResult`, add `DifficultyConfig` |
| `src/renderer/src/game/defaults.ts` | Replace `DIFFICULTY_MULTIPLIERS` with `DIFFICULTIES` config |
| `src/renderer/src/game/competition.ts` | Rewrite to round-based simulation |
| `src/renderer/src/store/weekSlice.ts` | Update to use new `enterCompetition()` signature (likely minimal) |
| `src/renderer/src/components/CompetitionPanel.tsx` | Update results display |
| `src/renderer/src/components/WeekSummaryDialog.tsx` | Update results display |
| `src/renderer/src/store/saveLoadSlice.ts` | Add v1→v2 migration |

---

## Implementation Notes

**Completed: 2026-02-09**

### What was done

All changes from the ticket were implemented as specified:

1. **`game/types.ts`** — Added `DifficultyConfig` interface and extended `CompetitionResult` with `roundsSurvived`, `totalRounds`, `maxWeightHeld`, `detachedAtWeight`.
2. **`game/defaults.ts`** — Replaced `DIFFICULTY_MULTIPLIERS` with `DIFFICULTIES: Record<Difficulty, DifficultyConfig>` containing rounds, baseWeight, weightIncrement, multiplier, and label per tier. Bumped `SAVE_VERSION` to 2.
3. **`game/competition.ts`** — Replaced `calculateCompetitionScore()` with `simulateCompetition()` that runs a round-by-round hold check loop. `enterCompetition()` wraps it and preserves the same external API (takes lizard + difficulty, returns updated lizard + result). The random function is injectable for testability.
4. **`components/CompetitionPanel.tsx`** — Updated difficulty label to show tier label and round count. Results now show "Held X/Y rounds (max Nkg)" with detachment/completion info, score shown as secondary.
5. **`components/WeekSummaryDialog.tsx`** — Same treatment for week-end summary.
6. **`store/saveLoadSlice.ts`** — Added `migrateV1toV2()` that backfills old `CompetitionResult` entries with zero defaults for new fields. Load logic now runs migrations for saves older than current version and rejects saves from newer versions.

### What didn't change

- **`store/weekSlice.ts`** — No changes needed; `enterCompetition()` kept the same signature.
- **`components/LizardCard.tsx`** — No changes needed; "Competed" badge still works as before.

### Design decisions

- `simulateCompetition` returns an `Omit<CompetitionResult, 'lizardId' | 'lizardName' | 'stickinessAtEntry'>` so it stays pure (no lizard identity info). `enterCompetition` merges identity fields.
- Random function is passed as `randomFn: () => number` rather than a seed, keeping it simple while enabling deterministic testing.
- Migration is structured as a chain (`migrateSave` calls `migrateV1toV2`) so future v2→v3 migrations slot in naturally.
