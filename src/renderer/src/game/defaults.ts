import type { GameState, Lizard, Activity, Difficulty, DifficultyConfig } from './types'
import { v4 as uuidv4 } from 'uuid'

export const SAVE_VERSION = 2
export const STARTING_STICKINESS = 10
export const DEFAULT_ACTIVITY: Activity = 'idle'

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { rounds: 5, baseWeight: 2, weightIncrement: 1, multiplier: 1.0, label: 'Lightweight Amateur' },
  medium: { rounds: 7, baseWeight: 3, weightIncrement: 2, multiplier: 1.5, label: 'Regional Qualifier' },
  hard: { rounds: 10, baseWeight: 5, weightIncrement: 3, multiplier: 2.5, label: 'National Championship' },
  extreme: { rounds: 12, baseWeight: 8, weightIncrement: 5, multiplier: 4.0, label: 'Legendary Invitational' }
}

export function createInitialGameState(): GameState {
  return {
    version: SAVE_VERSION,
    currentWeek: 1,
    lizards: [],
    pendingCompetitionResults: [],
    weekHistory: []
  }
}

export function createLizard(name: string): Lizard {
  return {
    id: uuidv4(),
    name,
    stickiness: STARTING_STICKINESS,
    weeklyActivity: DEFAULT_ACTIVITY,
    competitionEnteredThisWeek: false
  }
}
