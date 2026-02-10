import type { Lizard, Difficulty, CompetitionResult, RoundDetail } from './types'
import { DIFFICULTIES } from './defaults'

export function getStrainText(round: RoundDetail): string {
  const ratio = round.gripStrength / round.weight
  if (ratio >= 1.3) return 'Barely broke a sweat'
  if (ratio >= 1.15) return 'Held on with confidence'
  if (ratio >= 1.0) return 'White-knuckling it!'
  return "Couldn't hold on!"
}

export function simulateCompetition(
  stickiness: number,
  difficulty: Difficulty,
  randomFn: () => number = Math.random
): Omit<CompetitionResult, 'lizardId' | 'lizardName' | 'stickinessAtEntry'> {
  const config = DIFFICULTIES[difficulty]
  let roundsSurvived = 0
  let maxWeightHeld = 0
  let detachedAtWeight = 0
  const rounds: RoundDetail[] = []

  for (let round = 0; round < config.rounds; round++) {
    const gripStrength = stickiness * (0.85 + randomFn() * 0.3) // 0.85–1.15
    const roundWeight = config.baseWeight + (round * config.weightIncrement)
    const held = gripStrength >= roundWeight

    rounds.push({ round, gripStrength, weight: roundWeight, held })

    if (held) {
      roundsSurvived++
      maxWeightHeld = roundWeight
    } else {
      detachedAtWeight = roundWeight
      break
    }
  }

  const score = roundsSurvived * config.multiplier

  return {
    difficulty,
    score,
    roundsSurvived,
    totalRounds: config.rounds,
    maxWeightHeld,
    detachedAtWeight,
    rounds
  }
}

export function enterCompetition(
  lizard: Lizard,
  difficulty: Difficulty,
  randomFn?: () => number
): { lizard: Lizard; result: CompetitionResult } {
  const simResult = simulateCompetition(lizard.stickiness, difficulty, randomFn)

  const result: CompetitionResult = {
    lizardId: lizard.id,
    lizardName: lizard.name,
    stickinessAtEntry: lizard.stickiness,
    ...simResult
  }

  const updatedLizard: Lizard = {
    ...lizard,
    stickiness: lizard.stickiness + 1,
    competitionEnteredThisWeek: true
  }

  return { lizard: updatedLizard, result }
}
