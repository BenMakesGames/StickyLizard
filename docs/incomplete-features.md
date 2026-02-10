# Setae — Incomplete & Planned Features

A catalogue of features that are missing, partially implemented, or explicitly deferred. Sourced from `docs/decisions.md`, `docs/game wishlist.md`, `CLAUDE.md`, open questions in the design docs, and a full audit of the current codebase.

---

## Legend

| Status | Meaning |
|--------|---------|
| **Not started** | No code exists |
| **Partial** | Some code exists but the feature is incomplete |
| **Deferred** | Explicitly pushed to post-MVP in design docs |

---

## 1. Activities & Training

| Feature | Status | Notes |
|---------|--------|-------|
| Rest activity | Not started | Listed in wishlist and decisions.md as "to be added later". No type, logic, or UI exists. Purpose undefined — could be fatigue recovery, injury prevention, etc. (open question in decisions.md) |
| Additional activities beyond train-stickiness | Not started | Wishlist says "more activities will be added later". Only `'train-stickiness'` and `'idle'` exist in the `Activity` type |

**Current state:** `game/types.ts` defines `Activity = 'train-stickiness' | 'idle'`. Training logic in `game/training.ts` only handles stickiness.

---

## 2. Lizard Attributes

| Feature | Status | Notes |
|---------|--------|-------|
| Stamina stat | Not started | Open question in decisions.md: "Should lizards have additional stats beyond stickiness?" |
| Weight class | Not started | Same open question |
| Species / appearance variety | Not started | Open question: "Lizard appearance/species variety?" |
| Lizard visual representation | Not started | No sprites, images, or visual differentiation between lizards |

**Current state:** `Lizard` type has only `stickiness` as a stat. Lizards are distinguished only by name.

---

## 3. Lizard Acquisition

| Feature | Status | Notes |
|---------|--------|-------|
| Acquisition costs / economy | Deferred | decisions.md: "Economy / currency — Not in MVP" |
| Meaningful acquisition mechanics | Deferred | decisions.md: "acquisition mechanics to be designed later" |
| Breeding / genetics system | Deferred | decisions.md: "Breeding / genetics — Not in MVP" |

**Current state:** A "Get a Lizard" button instantly creates a free lizard with a player-chosen name. No limits, no cost.

---

## 4. Competition System

| Feature | Status | Notes |
|---------|--------|-------|
| Entry fees / risk | Deferred | decisions.md: "always free to enter for MVP" |
| Rankings / tiers / leaderboards | Not started | decisions.md mentions "Rankings/tiers based on score" but none are implemented |
| Competition history beyond current week | Not started | `weekHistory[]` stores past `WeekSummary` objects, but no UI displays historical data |
| Named competition events | Not started | Competitions are just a difficulty pick — no named events, locations, or flavor |
| Round-by-round animation / play-by-play | **Done** | Ticket 002: animated playback with suspense delay, strain commentary, and per-round reveal. Player controls pacing via "Next Round" button. |
| Strategic choices during competition | Not started | e.g. passing rounds — deferred per ticket 001 |

**Current state:** Weight-clinging format (ticket 001). Lizards cling to a surface while weight is added each round. Hold check per round: `gripStrength = stickiness × random(0.85–1.15)` vs `roundWeight = baseWeight + (round × weightIncrement)`. Results show rounds survived, max weight held, and detachment weight. Score = `roundsSurvived × difficultyMultiplier`. +1 stickiness for competing.

---

## 5. Progression & Economy

| Feature | Status | Notes |
|---------|--------|-------|
| Currency / resource system | Deferred | decisions.md: "Not in MVP — to be added later if needed" |
| Win condition / endgame | Not started | Open question: "Is there a win condition or is it open-ended?" |
| Milestones / achievements | Not started | No progression markers of any kind |

**Current state:** No economy, no progression goals. The game loop is purely train-compete-repeat with no long-term arc.

---

## 6. Save/Load Enhancements

| Feature | Status | Notes |
|---------|--------|-------|
| Auto-save | Not started | Player must manually save via file dialog every time |
| Multiple save slots | Not started | Single file picked via native OS dialog each time |
| Save migration logic | Partial | v1→v2 migration exists (backfills competition result fields). Migration chain in `saveLoadSlice.ts` supports future versions. |

**Current state:** Manual save/load via native file dialogs works. JSON format at version 2. v1→v2 migration backfills new `CompetitionResult` fields with zero defaults.

---

## 7. History & Data Visualization

| Feature | Status | Notes |
|---------|--------|-------|
| Week history browser | Not started | `weekHistory[]` data is stored in state but no UI reads it |
| Stickiness progression charts | Not started | No graphing/charting library installed |
| Lizard comparison tools | Not started | No side-by-side stat views |
| Statistics dashboard | Not started | No aggregate stats (total competitions, best scores, etc.) |

**Current state:** The data model tracks `weekHistory` with training gains and competition results per week, but this data is completely invisible to the player after the week-end summary dialog closes.

---

## 8. UI/UX Polish

| Feature | Status | Notes |
|---------|--------|-------|
| Sound / music | Not started | Open question in decisions.md |
| Animations | Not started | No transitions, no visual feedback beyond toasts |
| Settings / options menu | Not started | No configurable settings |
| Help / tutorial | Not started | No onboarding or help text |
| Lizard detail view | Not started | No way to see a lizard's full history or detailed stats |
| Confirmation dialogs for risky actions | Not started | No "are you sure?" prompts (e.g., overwriting saves) |

---

## 9. Testing

| Feature | Status | Notes |
|---------|--------|-------|
| Unit tests | Not started | No test files exist. Pure game logic in `game/` is well-suited for unit testing |
| Integration tests | Not started | No test runner configured |
| E2E tests | Not started | No Playwright/Spectron setup |

**Current state:** `npx tsc --noEmit` is the only validation. No test framework is installed.

---

## 10. Open Design Questions

These are unresolved questions from `docs/decisions.md` that block future feature work:

1. What does "rest" do? (fatigue recovery? injury prevention? mood?)
2. Should lizards have stats beyond stickiness? (stamina, weight class, etc.)
3. Is there a win condition or is gameplay open-ended?
4. What lizard appearance/species variety should exist?
5. Should there be sound/music?
6. What should acquisition mechanics look like post-MVP?
7. What should competition rankings/tiers look like?

---

*Generated from a full codebase audit on 2026-02-09.*
