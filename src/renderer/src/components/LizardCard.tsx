import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import type { Activity, Lizard } from '@renderer/game/types'
import { useGameStore } from '@renderer/store/gameStore'

const ACTIVITY_LABELS: Record<Activity, string> = {
  'train-stickiness': 'Train Stickiness',
  idle: 'Idle'
}

export function LizardCard({ lizard }: { lizard: Lizard }) {
  const setLizardActivity = useGameStore((s) => s.setLizardActivity)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{lizard.name}</CardTitle>
          {lizard.competitionEnteredThisWeek && (
            <Badge variant="secondary">Competed</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Stickiness</span>
          <span className="text-lg font-semibold">{lizard.stickiness.toFixed(1)}</span>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Weekly Activity</label>
          <Select
            value={lizard.weeklyActivity}
            onValueChange={(v) => setLizardActivity(lizard.id, v as Activity)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ACTIVITY_LABELS) as Activity[]).map((activity) => (
                <SelectItem key={activity} value={activity}>
                  {ACTIVITY_LABELS[activity]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
