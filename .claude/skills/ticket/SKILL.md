---
name: ticket
description: Implement a ticket from docs/tickets/, following the full workflow from reading through implementation to documentation updates
argument-hint: [ticket-number e.g. 003]
---

# Implement Ticket

Work through ticket **$ARGUMENTS** following this exact workflow.

## 1. Find and Read the Ticket

- Look in `docs/tickets/` for a file matching the ticket number (e.g. `003-*.md`)
- Read the ticket thoroughly
- Read all source files mentioned in the ticket to understand the current code

## 2. Clarify Before Starting

- If any requirements are ambiguous, ask clarifying questions **before writing any code**
- If the ticket is clear, state your implementation plan briefly and proceed

## 3. Implement

- Follow the ticket's recommendations for approach (e.g. if it suggests Option A vs Option B, follow the recommendation unless there's a strong reason not to)
- Keep changes minimal — only modify what the ticket requires
- Respect the project's architecture: pure game logic in `game/`, store actions in `store/`, UI in `components/`
- Run `npx tsc --noEmit` after implementation to verify the build is clean

## 4. Move Ticket to Completed

- Move the ticket file from `docs/tickets/` to `docs/tickets/completed/`
- Append a **"Completion Notes"** section to the moved file documenting:
  - Date of implementation
  - Approach taken and any deviations from the ticket
  - Files modified with a brief description of each change
  - Any notable design decisions

## 5. Update Documentation

- **`docs/incomplete-features.md`** — Update any entries that are now done or changed by this ticket
- **`CLAUDE.md`** — Add or update any sections affected by the new functionality (formulas, conventions, architecture notes)
- **Memory files** — Update `MEMORY.md` if the changes affect project patterns, formulas, or key conventions
