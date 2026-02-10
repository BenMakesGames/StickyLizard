import { useGameStore } from '@renderer/store/gameStore'
import { LizardCard } from './LizardCard'
import { GetLizardDialog } from './GetLizardDialog'

export function LizardList() {
  const lizards = useGameStore((s) => s.lizards)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Lizards</h2>
        <GetLizardDialog />
      </div>
      {lizards.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No lizards yet. Get one to start training!
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lizards.map((lizard) => (
            <LizardCard key={lizard.id} lizard={lizard} />
          ))}
        </div>
      )}
    </div>
  )
}
