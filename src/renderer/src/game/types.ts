export type Activity = 'train-stickiness' | 'idle'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme'

export interface Lizard {
  id: string
  name: string
  stickiness: number
  weeklyActivity: Activity
  competitionEnteredThisWeek: boolean
}

export interface DifficultyConfig {
  rounds: number
  baseWeight: number
  weightIncrement: number
  multiplier: number
  label: string
}

export interface RoundDetail {
  round: number
  gripStrength: number
  weight: number
  held: boolean
}

export interface CompetitionResult {
  lizardId: string
  lizardName: string
  difficulty: Difficulty
  score: number
  stickinessAtEntry: number
  roundsSurvived: number
  totalRounds: number
  maxWeightHeld: number
  detachedAtWeight: number
  rounds?: RoundDetail[]
}

export interface WeekSummary {
  week: number
  trainingGains: { lizardId: string; lizardName: string; gain: number }[]
  competitionResults: CompetitionResult[]
}

export interface GameState {
  version: number
  currentWeek: number
  lizards: Lizard[]
  pendingCompetitionResults: CompetitionResult[]
  weekHistory: WeekSummary[]
}
