import { tokens } from '../tokens'

const t = tokens

type Props = {
  active: 'timeline' | 'calendar'
  onBack: () => void
  onSwitch: (next: 'timeline' | 'calendar') => void
  rightSlot?: React.ReactNode
}

export function HistoryHeader({ active, onBack, onSwitch, rightSlot }: Props) {
  return (
    <div
      style={{
        padding: '18px 22px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: t.mono,
        fontSize: 10,
        color: t.textFaint,
        letterSpacing: '0.15em',
      }}
    >
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: t.textFaint,
          font: 'inherit',
          letterSpacing: 'inherit',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        ← back
      </button>
      <div
        style={{
          display: 'flex',
          background: t.bgCard,
          borderRadius: 999,
          border: `1px solid ${t.border}`,
          padding: 2,
        }}
      >
        <button
          onClick={() => onSwitch('timeline')}
          style={toggleStyle(active === 'timeline')}
        >
          TIMELINE
        </button>
        <button
          onClick={() => onSwitch('calendar')}
          style={toggleStyle(active === 'calendar')}
        >
          CALENDAR
        </button>
      </div>
      <span style={{ minWidth: 36, textAlign: 'right' }}>{rightSlot ?? ''}</span>
    </div>
  )
}

function toggleStyle(active: boolean) {
  return {
    padding: '5px 12px',
    borderRadius: 999,
    background: active ? t.accent : 'transparent',
    color: active ? t.bg : t.textSoft,
    letterSpacing: '0.1em',
    fontFamily: t.mono,
    fontSize: 10,
    border: 'none',
    cursor: 'pointer',
  } as const
}
