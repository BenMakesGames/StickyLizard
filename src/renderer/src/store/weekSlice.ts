import type { StateCreator } from 'zustand'
import type { Difficulty, Lizard, WeekSummary } from '@renderer/game/types'
import { enterCompetition } from '@renderer/game/competition'
import { advanceWeek } from '@renderer/game/week'
import type { GameStore } from './gameStore'

export interface WeekSlice {
  enterCompetition: (lizardId: string, difficulty: Difficulty) => void
  advanceWeek: () => WeekSummary
}

export const createWeekSlice: StateCreator<GameStore, [], [], WeekSlice> = (set, get) => ({
  enterCompetition: (lizardId: string, difficulty: Difficulty) => {
    const state = get()
    const lizard = state.lizards.find((l: Lizard) => l.id === lizardId)
    if (!lizard || lizard.competitionEnteredThisWeek) return

    const { lizard: updatedLizard, result } = enterCompetition(lizard, difficulty)

    set({
      lizards: state.lizards.map((l: Lizard) => (l.id === lizardId ? updatedLizard : l)),
      pendingCompetitionResults: [...state.pendingCompetitionResults, result]
    })
  },

  advanceWeek: () => {
    const state = get()
    const { newState, summary } = advanceWeek(state)

    set({
      currentWeek: newState.currentWeek,
      lizards: newState.lizards,
      pendingCompetitionResults: newState.pendingCompetitionResults,
      weekHistory: newState.weekHistory
    })

    return summary
  }
})
