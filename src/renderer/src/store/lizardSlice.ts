import type { StateCreator } from 'zustand'
import type { Activity, Lizard } from '@renderer/game/types'
import { createLizard } from '@renderer/game/defaults'
import type { GameStore } from './gameStore'

export interface LizardSlice {
  addLizard: (name: string) => void
  setLizardActivity: (lizardId: string, activity: Activity) => void
}

export const createLizardSlice: StateCreator<GameStore, [], [], LizardSlice> = (set) => ({
  addLizard: (name: string) =>
    set((state) => ({
      lizards: [...state.lizards, createLizard(name)]
    })),

  setLizardActivity: (lizardId: string, activity: Activity) =>
    set((state) => ({
      lizards: state.lizards.map((l: Lizard) =>
        l.id === lizardId ? { ...l, weeklyActivity: activity } : l
      )
    }))
})
