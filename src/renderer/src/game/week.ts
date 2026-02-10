import type { GameState, WeekSummary } from './types'
import { applyTraining } from './training'

export function advanceWeek(state: GameState): {
  newState: GameState
  summary: WeekSummary
} {
  const trainingGains: WeekSummary['trainingGains'] = []

  const updatedLizards = state.lizards.map((lizard) => {
    const { lizard: trainedLizard, gain } = applyTraining(lizard)

    if (gain > 0) {
      trainingGains.push({
        lizardId: lizard.id,
        lizardName: lizard.name,
        gain
      })
    }

    // Reset weekly state
    return {
      ...trainedLizard,
      weeklyActivity: trainedLizard.weeklyActivity,
      competitionEnteredThisWeek: false
    }
  })

  const summary: WeekSummary = {
    week: state.currentWeek,
    trainingGains,
    competitionResults: [...state.pendingCompetitionResults]
  }

  const newState: GameState = {
    ...state,
    currentWeek: state.currentWeek + 1,
    lizards: updatedLizards,
    pendingCompetitionResults: [],
    weekHistory: [...state.weekHistory, summary]
  }

  return { newState, summary }
}
