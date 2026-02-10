import { Toaster } from './components/ui/sonner'
import { WeekHeader } from './components/WeekHeader'
import { LizardList } from './components/LizardList'
import { CompetitionPanel } from './components/CompetitionPanel'
import { SaveLoadBar } from './components/SaveLoadBar'
import { Separator } from './components/ui/separator'

function App(): React.JSX.Element {
  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <WeekHeader />
        <div className="ml-auto">
          <SaveLoadBar />
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <LizardList />
        <CompetitionPanel />
      </div>

      <Toaster />
    </div>
  )
}

export default App
