import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { Badge } from './ui/badge'
import { useGameStore } from '@renderer/store/gameStore'
import type { Difficulty, CompetitionResult } from '@renderer/game/types'
import { DIFFICULTIES } from '@renderer/game/defaults'
import { getStrainText } from '@renderer/game/competition'

const DIFFICULTY_OPTIONS: Difficulty[] = ['easy', 'medium', 'hard', 'extreme']
const SUSPENSE_DELAY_MS = 1200

type PlaybackPhase = 'idle' | 'suspense' | 'revealed' | 'summary'

export function CompetitionPanel() {
  const lizards = useGameStore((s) => s.lizards)
  const pendingResults = useGameStore((s) => s.pendingCompetitionResults)
  const enterComp = useGameStore((s) => s.enterCompetition)

  const [selectedLizardId, setSelectedLizardId] = useState<string>('')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  const [playbackResult, setPlaybackResult] = useState<CompetitionResult | null>(null)
  const [currentRound, setCurrentRound] = useState(0)
  const [phase, setPhase] = useState<PlaybackPhase>('idle')

  const eligibleLizards = lizards.filter((l) => !l.competitionEnteredThisWeek)

  useEffect(() => {
    if (phase !== 'suspense') return
    const timer = setTimeout(() => setPhase('revealed'), SUSPENSE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [phase, currentRound])

  const handleEnter = useCallback(() => {
    if (!selectedLizardId) return
    enterComp(selectedLizardId, difficulty)

    const results = useGameStore.getState().pendingCompetitionResults
    const result = results[results.length - 1]
    if (result?.rounds && result.rounds.length > 0) {
      setPlaybackResult(result)
      setCurrentRound(0)
      setPhase('suspense')
    }
    setSelectedLizardId('')
  }, [selectedLizardId, difficulty, enterComp])

  const handleNextRound = useCallback(() => {
    if (!playbackResult?.rounds) return
    const nextIdx = currentRound + 1
    if (nextIdx < playbackResult.rounds.length) {
      setCurrentRound(nextIdx)
      setPhase('suspense')
    }
  }, [playbackResult, currentRound])

  const handleDone = useCallback(() => {
    setPlaybackResult(null)
    setCurrentRound(0)
    setPhase('idle')
  }, [])

  const rounds = playbackResult?.rounds ?? []
  const roundData = rounds[currentRound]
  const isLastRound =
    roundData && (!roundData.held || currentRound === rounds.length - 1)

  if (phase !== 'idle' && playbackResult && roundData) {
    if (phase === 'summary') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Competition Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <div className="font-medium text-base">{playbackResult.lizardName}</div>
              <div className="text-muted-foreground">
                {DIFFICULTIES[playbackResult.difficulty].label} ({playbackResult.difficulty})
              </div>
            </div>
            <div className="rounded-md border p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Rounds survived</span>
                <span className="font-medium">
                  {playbackResult.roundsSurvived} / {playbackResult.totalRounds}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Score</span>
                <span className="font-medium">{playbackResult.score.toFixed(1)} pts</span>
              </div>
              {playbackResult.maxWeightHeld > 0 && (
                <div className="flex justify-between">
                  <span>Max weight held</span>
                  <span className="font-medium">{playbackResult.maxWeightHeld} kg</span>
                </div>
              )}
              {playbackResult.detachedAtWeight > 0 && (
                <div className="flex justify-between">
                  <span>Detached at</span>
                  <span className="font-medium">{playbackResult.detachedAtWeight} kg</span>
                </div>
              )}
              {playbackResult.roundsSurvived === playbackResult.totalRounds && (
                <div className="text-center font-medium text-green-600">
                  Completed all rounds!
                </div>
              )}
            </div>
            <Button onClick={handleDone} className="w-full">
              Done
            </Button>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Round {currentRound + 1} / {playbackResult.totalRounds}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {playbackResult.lizardName} (stickiness: {playbackResult.stickinessAtEntry})
          </div>

          <div className="rounded-md border p-3 space-y-3">
            <div className="text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Weight</div>
              <div className="text-2xl font-bold">{roundData.weight} kg</div>
            </div>

            {phase === 'suspense' && (
              <div className="text-center text-muted-foreground animate-pulse">...</div>
            )}

            {phase === 'revealed' && (
              <div className="text-center space-y-1">
                <div
                  className={`text-lg font-semibold ${roundData.held ? 'text-green-600' : 'text-red-600'}`}
                >
                  {roundData.held ? 'Held on!' : 'Detached!'}
                </div>
                <div className="text-sm text-muted-foreground italic">
                  {getStrainText(roundData)}
                </div>
              </div>
            )}
          </div>

          {phase === 'revealed' && (
            <>
              {isLastRound ? (
                <Button onClick={() => setPhase('summary')} className="w-full">
                  See Results
                </Button>
              ) : (
                <Button onClick={handleNextRound} className="w-full">
                  Next Round
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Lizard</label>
          <Select value={selectedLizardId} onValueChange={setSelectedLizardId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a lizard..." />
            </SelectTrigger>
            <SelectContent>
              {eligibleLizards.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name} (stickiness: {l.stickiness.toFixed(1)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Difficulty{' '}
            <span className="text-xs">
              ({DIFFICULTIES[difficulty].label} — {DIFFICULTIES[difficulty].rounds} rounds)
            </span>
          </label>
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_OPTIONS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleEnter}
          disabled={!selectedLizardId || eligibleLizards.length === 0}
          className="w-full"
        >
          Enter Competition
        </Button>

        {pendingResults.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-medium">This Week's Results</h3>
            {pendingResults.map((r, i) => (
              <div key={i} className="rounded-md border p-2 text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span>
                    {r.lizardName}{' '}
                    <Badge variant="outline" className="ml-1">
                      {r.difficulty}
                    </Badge>
                  </span>
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
      </CardContent>
    </Card>
  )
}
