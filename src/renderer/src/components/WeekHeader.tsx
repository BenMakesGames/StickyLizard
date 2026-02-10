import { useState } from 'react'
import { Button } from './ui/button'
import { useGameStore } from '@renderer/store/gameStore'
import type { WeekSummary } from '@renderer/game/types'
import { WeekSummaryDialog } from './WeekSummaryDialog'

export function WeekHeader() {
  const currentWeek = useGameStore((s) => s.currentWeek)
  const advanceWeek = useGameStore((s) => s.advanceWeek)
  const lizards = useGameStore((s) => s.lizards)
  const [summary, setSummary] = useState<WeekSummary | null>(null)

  const handleAdvance = () => {
    const result = advanceWeek()
    setSummary(result)
  }

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Setae{' '}
        <span className="text-muted-foreground font-normal text-xl ml-2">Week {currentWeek}</span>
      </h1>
      <Button onClick={handleAdvance} disabled={lizards.length === 0} size="lg">
        Advance Week
      </Button>

      <WeekSummaryDialog summary={summary} onClose={() => setSummary(null)} />
    </>
  )
}
