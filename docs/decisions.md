# Setae — Design Decisions & Q&A Log

## Game Overview

**Title**: Setae
**Genre**: Lizard management sim
**Players**: Single-player
**Platforms**: Windows, Mac, Linux (cross-platform desktop)
**Distribution**: itch.io

---

## Tech Stack

| Decision | Choice | Reasoning |
|---|---|---|
| Language | TypeScript | Very AI/LLM-friendly, strong typing, huge ecosystem |
| Desktop wrapper | Electron | Easier build setup than Tauri; no Rust toolchain needed. Tradeoff: larger binaries |
| UI framework | React | Most fluent for AI dev, component-based, massive ecosystem |
| Styling | Component library (e.g. shadcn/ui) | Polished, consistent UI out of the box. Faster iteration |
| Visual style | UI / management sim | Clean panels, cards, stat displays. All HTML/CSS, no external art assets required |
| Save/load | Yes | Format TBD (likely JSON to local filesystem) |

**Why not Godot?** Claude Code has no access to the Godot GUI editor. Since the game is UI-heavy, building layouts by hand-editing .tscn files would be slow and error-prone. Web tech (HTML/CSS) can be built and iterated entirely from CLI.

---

## Gameplay Decisions

### Lizards

| Question | Answer |
|---|---|
| How many lizards does the player start with? | **0** — the player starts with no lizards |
| How does the player get lizards? | A button that gives the player a new lizard and prompts them to name it |
| Can the player name lizards? | Yes, names are chosen by the player when acquiring a lizard |

### Training

| Question | Answer |
|---|---|
| What activities are available? | Train stickiness (more activities including rest to be added later) |
| How does a training week work? | Player chooses what each lizard does for the week, then presses a button to advance |
| How do stickiness gains work? | **Diminishing returns** — gains decrease as stickiness gets higher, creating a natural soft cap and progression curve |

### Weight-Dragging Competition

| Question | Answer |
|---|---|
| How do outcomes work? | **Scored performance** — lizard gets a score (e.g. distance dragged). Higher stickiness = better average score. Rankings/tiers based on score |
| Is there an entry fee or risk? | **No** — always free to enter for MVP |
| Time cost? | Competitions don't consume the lizard's week, but each lizard can only enter **one competition per week** |
| Does competing train stats? | Yes (per original wishlist) |
| What determines difficulty? | Player chooses a competition of some difficulty level |

### Progression

| Question | Answer |
|---|---|
| Overall approach | **Start minimal** — build the core loop (train → compete → repeat) first, then expand |
| Economy / currency | Not in MVP — to be added later if needed |
| Breeding / genetics | Not in MVP — to be added later if needed |
| Acquiring more lizards | Via the "get a lizard" button for now; acquisition mechanics to be designed later |

---

## Open Questions (for future sessions)

- What specific component library? (shadcn/ui, Mantine, Chakra, etc.)
- What are the competition difficulty tiers/names?
- What score formula maps stickiness + difficulty → distance?
- What's the diminishing returns curve for training?
- Should lizards have additional stats beyond stickiness? (stamina, weight class, etc.)
- What does "rest" do when it's added? (recovery from fatigue? injury prevention?)
- Is there a win condition or is it open-ended?
- Lizard appearance/species variety?
- Sound/music?

---

*This document is maintained by Claude Code as the project's primary developer. Updated 2026-02-09.*
