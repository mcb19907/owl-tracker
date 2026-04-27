import { useState } from 'react'
import { useStore } from './store'
import type { Screen } from './types'
import { Home } from './screens/Home'
import { Log } from './screens/Log'
import { Timeline } from './screens/Timeline'
import { Calendar } from './screens/Calendar'

function App() {
  const { state, renameOwl, addSighting } = useStore()
  const [screen, setScreen] = useState<Screen>('home')

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050810',
      }}
    >
      {screen === 'home' && (
        <Home
          owls={state.owls}
          sightings={state.sightings}
          onRenameOwl={renameOwl}
          onOpenLog={() => setScreen('log')}
        />
      )}
      {screen === 'log' && (
        <Log
          owls={state.owls}
          onSave={(s) => {
            addSighting(s)
            setScreen('home')
          }}
          onBack={() => setScreen('home')}
          onOpenJournal={() => setScreen('timeline')}
        />
      )}
      {screen === 'timeline' && (
        <Timeline
          owls={state.owls}
          sightings={state.sightings}
          onBack={() => setScreen('home')}
          onSwitch={(next) => setScreen(next)}
        />
      )}
      {screen === 'calendar' && (
        <Calendar
          owls={state.owls}
          sightings={state.sightings}
          onBack={() => setScreen('home')}
          onSwitch={(next) => setScreen(next)}
        />
      )}
    </div>
  )
}

export default App
