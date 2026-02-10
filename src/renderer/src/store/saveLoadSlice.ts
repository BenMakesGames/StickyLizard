import type { StateCreator } from 'zustand'
import type { GameState, CompetitionResult } from '@renderer/game/types'
import { SAVE_VERSION } from '@renderer/game/defaults'
import type { GameStore } from './gameStore'

export interface SaveLoadSlice {
  saveGame: () => Promise<boolean>
  loadGame: () => Promise<boolean>
}

function extractGameState(store: GameStore): GameState {
  return {
    version: store.version,
    currentWeek: store.currentWeek,
    lizards: store.lizards,
    pendingCompetitionResults: store.pendingCompetitionResults,
    weekHistory: store.weekHistory
  }
}

function migrateCompetitionResult(r: Partial<CompetitionResult>): CompetitionResult {
  return {
    lizardId: r.lizardId ?? '',
    lizardName: r.lizardName ?? '',
    difficulty: r.difficulty ?? 'easy',
    score: r.score ?? 0,
    stickinessAtEntry: r.stickinessAtEntry ?? 0,
    roundsSurvived: r.roundsSurvived ?? 0,
    totalRounds: r.totalRounds ?? 0,
    maxWeightHeld: r.maxWeightHeld ?? 0,
    detachedAtWeight: r.detachedAtWeight ?? 0
  }
}

function migrateV1toV2(state: GameState): GameState {
  return {
    ...state,
    version: 2,
    pendingCompetitionResults: state.pendingCompetitionResults.map(migrateCompetitionResult),
    weekHistory: state.weekHistory.map((week) => ({
      ...week,
      competitionResults: week.competitionResults.map(migrateCompetitionResult)
    }))
  }
}

function migrateSave(parsed: GameState): GameState {
  let state = parsed
  if (state.version === 1) state = migrateV1toV2(state)
  return state
}

export const createSaveLoadSlice: StateCreator<GameStore, [], [], SaveLoadSlice> = (set, get) => ({
  saveGame: async () => {
    const state = extractGameState(get())
    const json = JSON.stringify(state, null, 2)
    const result = await window.api.saveGame(json)
    return result
  },

  loadGame: async () => {
    const json = await window.api.loadGame()
    if (!json) return false

    try {
      let parsed = JSON.parse(json) as GameState
      if (parsed.version > SAVE_VERSION) {
        console.error('Save is from a newer version:', parsed.version)
        return false
      }
      if (parsed.version < SAVE_VERSION) {
        parsed = migrateSave(parsed)
      }
      set({
        version: parsed.version,
        currentWeek: parsed.currentWeek,
        lizards: parsed.lizards,
        pendingCompetitionResults: parsed.pendingCompetitionResults,
        weekHistory: parsed.weekHistory
      })
      return true
    } catch (e) {
      console.error('Failed to parse save:', e)
      return false
    }
  }
})
