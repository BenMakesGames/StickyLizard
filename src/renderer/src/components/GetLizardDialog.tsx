import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useGameStore } from '@renderer/store/gameStore'

export function GetLizardDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const addLizard = useGameStore((s) => s.addLizard)

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    addLizard(trimmed)
    setName('')
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Get a Lizard</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get a New Lizard</DialogTitle>
          <DialogDescription>Give your new lizard a name to begin training.</DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Lizard name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Add Lizard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
