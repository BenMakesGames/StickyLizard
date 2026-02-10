import { create } from 'zustand'
import type { GameState } from '@renderer/game/types'
import { createInitialGameState } from '@renderer/game/defaults'
import { createLizardSlice, type LizardSlice } from './lizardSlice'
import { createWeekSlice, type WeekSlice } from './weekSlice'
import { createSaveLoadSlice, type SaveLoadSlice } from './saveLoadSlice'

export type GameStore = GameState & LizardSlice & WeekSlice & SaveLoadSlice

export const useGameStore = create<GameStore>()((...a) => ({
  ...createInitialGameState(),
  ...createLizardSlice(...a),
  ...createWeekSlice(...a),
  ...createSaveLoadSlice(...a)
}))
