import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from './ui/dialog'
import { Separator } from './ui/separator'
import type { WeekSummary } from '@renderer/game/types'

interface Props {
  summary: WeekSummary | null
  onClose: () => void
}

export function WeekSummaryDialog({ summary, onClose }: Props) {
  if (!summary) return null

  const hasTraining = summary.trainingGains.length > 0
  const hasCompetitions = summary.competitionResults.length > 0
  const hasActivity = hasTraining || hasCompetitions

  return (
    <Dialog open={!!summary} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Week {summary.week} Summary</DialogTitle>
          <DialogDescription>
            Here's what happened this week.
          </DialogDescription>
        </DialogHeader>

        {!hasActivity && (
          <p className="text-sm text-muted-foreground">Nothing happened this week.</p>
        )}

        {hasTraining && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Training</h3>
            {summary.trainingGains.map((t) => (
              <div key={t.lizardId} className="flex justify-between text-sm">
                <span>{t.lizardName}</span>
                <span className="text-green-600">+{t.gain.toFixed(2)} stickiness</span>
              </div>
            ))}
          </div>
        )}

        {hasTraining && hasCompetitions && <Separator />}

        {hasCompetitions && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Competitions</h3>
            {summary.competitionResults.map((r, i) => (
              <div key={i} className="space-y-0.5 text-sm">
                <div className="flex justify-between">
                  <span>{r.lizardName} ({r.difficulty})</span>
                  <span className="text-muted-foreground">{r.score.toFixed(1)} pts</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Held {r.roundsSurvived}/{r.totalRounds} rounds
                  {r.maxWeightHeld > 0 && <> (max {r.maxWeightHeld}kg)</>}
                  {r.detachedAtWeight > 0 && <> — detached at {r.detachedAtWeight}kg</>}
                  {r.roundsSurvived === r.totalRounds && <> — completed all rounds!</>}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
