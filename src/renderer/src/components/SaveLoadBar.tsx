import { Button } from './ui/button'
import { useGameStore } from '@renderer/store/gameStore'
import { toast } from 'sonner'

export function SaveLoadBar() {
  const saveGame = useGameStore((s) => s.saveGame)
  const loadGame = useGameStore((s) => s.loadGame)

  const handleSave = async () => {
    const success = await saveGame()
    if (success) {
      toast.success('Game saved!')
    }
  }

  const handleLoad = async () => {
    const success = await loadGame()
    if (success) {
      toast.success('Game loaded!')
    } else {
      // User may have cancelled — only toast on actual failures
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleSave}>
        Save
      </Button>
      <Button variant="outline" size="sm" onClick={handleLoad}>
        Load
      </Button>
    </div>
  )
}
