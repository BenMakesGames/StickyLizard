import type { Lizard } from './types'

/**
 * Diminishing returns formula:
 * gain = 5 / (1 + stickiness / 50)
 */
export function calculateTrainingGain(stickiness: number): number {
  return 5 / (1 + stickiness / 50)
}

export function applyTraining(lizard: Lizard): { lizard: Lizard; gain: number } {
  if (lizard.weeklyActivity !== 'train-stickiness') {
    return { lizard, gain: 0 }
  }

  const gain = calculateTrainingGain(lizard.stickiness)
  return {
    lizard: {
      ...lizard,
      stickiness: lizard.stickiness + gain
    },
    gain
  }
}
