import { useMemo, useState } from 'react'
import { tokens, BRANCHES, MOODS } from '../tokens'
import type { Mood, Owl, Sighting } from '../types'
import { NocturnalShell } from '../components/NocturnalShell'
import { fmtTime, uuid } from '../helpers'

const t = tokens

type Props = {
  owls: Owl[]
  onSave: (s: Sighting) => void
  onBack: () => void
  onOpenJournal: () => void
}

const BRANCH_PINS: Record<string, { x: number; y: number }> = {
  'East fork': { x: 80, y: 80 },
  'High crown': { x: 200, y: 40 },
  'Low oak limb': { x: 80, y: 130 },
  'Garage-side perch': { x: 270, y: 100 },
  'South branch': { x: 240, y: 60 },
  'Trunk hollow': { x: 160, y: 140 },
}

export function Log({ owls, onSave, onBack, onOpenJournal }: Props) {
  const initialNow = useMemo(() => new Date(), [])
  const [hours, setHours] = useState(initialNow.getHours())
  const [minutes, setMinutes] = useState(initialNow.getMinutes())
  const dateValue = useMemo(() => {
    const d = new Date(initialNow)
    d.setHours(hours, minutes, 0, 0)
    return d
  }, [initialNow, hours, minutes])

  const namedOwls = owls.filter((o) => o.name.trim().length > 0)
  const selectableOwls = namedOwls.length > 0 ? namedOwls : owls

  const [owlId, setOwlId] = useState<string>(selectableOwls[0]?.id ?? '')
  const [editingTime, setEditingTime] = useState(false)
  const [branch, setBranch] = useState<string>(BRANCHES[0])
  const [customBranchEnabled, setCustomBranchEnabled] = useState(false)
  const [customBranch, setCustomBranch] = useState('')
  const [mood, setMood] = useState<Mood>('calm')
  const [hoots, setHoots] = useState(0)
  const [note, setNote] = useState('')

  const branchValue = customBranchEnabled ? customBranch.trim() : branch
  const pin = BRANCH_PINS[branch] ?? { x: 160, y: 100 }

  const stepTime = (minDelta: number) => {
    const total = hours * 60 + minutes + minDelta
    const wrapped = ((total % 1440) + 1440) % 1440
    setHours(Math.floor(wrapped / 60))
    setMinutes(wrapped % 60)
  }

  const setNow = () => {
    const d = new Date()
    setHours(d.getHours())
    setMinutes(d.getMinutes())
  }

  const canSave = owlId.length > 0 && branchValue.length > 0
  const handleSave = () => {
    if (!canSave) return
    onSave({
      id: uuid(),
      date: dateValue.toISOString(),
      owlId,
      branch: branchValue,
      mood,
      hoots,
      weather: 'clear',
      note: note.trim() ? note.trim() : undefined,
    })
  }

  return (
    <NocturnalShell>
      <div
        style={{
          padding: '14px 22px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: t.mono,
          fontSize: 10,
          color: t.textFaint,
          letterSpacing: '0.1em',
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
        <span>LOG SIGHTING</span>
        <span style={{ opacity: 0 }}>·</span>
      </div>

      <div style={{ padding: '20px 22px 0' }}>
        <div
          style={{
            fontFamily: t.mono,
            fontSize: 9,
            color: t.textFaint,
            letterSpacing: '0.2em',
            marginBottom: 10,
          }}
        >
          WHO
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          {selectableOwls.map((owl) => {
            const selected = owl.id === owlId
            return (
              <button
                key={owl.id}
                onClick={() => setOwlId(owl.id)}
                style={{
                  flex: 1,
                  background: selected
                    ? `linear-gradient(160deg, ${t.accent}33, ${t.bgCard})`
                    : t.bgCard,
                  border: selected
                    ? `1.5px solid ${t.accent}`
                    : `1px solid ${t.border}`,
                  borderRadius: 12,
                  padding: '14px 8px',
                  color: t.text,
                  fontFamily: t.display,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: selected ? `0 0 16px ${t.accent}33` : 'none',
                  transition: 'box-shadow 150ms ease',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    margin: '0 auto 8px',
                    background: `radial-gradient(circle at 30% 30%, ${t.accent}, ${t.accent}22 70%)`,
                  }}
                />
                {owl.name || 'Unnamed'}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '20px 22px 0' }}>
        <div
          style={{
            fontFamily: t.mono,
            fontSize: 9,
            color: t.textFaint,
            letterSpacing: '0.2em',
            marginBottom: 10,
          }}
        >
          WHEN
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => stepTime(-1)}
            style={stepBtnStyle}
            aria-label="One minute earlier"
          >
            −
          </button>
          {editingTime ? (
            <input
              type="time"
              autoFocus
              value={`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`}
              onChange={(e) => {
                const [h, m] = e.target.value.split(':').map(Number)
                if (!Number.isNaN(h) && !Number.isNaN(m)) {
                  setHours(h)
                  setMinutes(m)
                }
              }}
              onBlur={() => setEditingTime(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  ;(e.target as HTMLInputElement).blur()
                }
              }}
              style={{
                fontFamily: t.display,
                fontSize: 30,
                color: t.accent,
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${t.borderStrong}`,
                borderRadius: 8,
                padding: '4px 8px',
                outline: 'none',
                minWidth: 110,
                textAlign: 'center',
                colorScheme: 'dark',
              }}
            />
          ) : (
            <button
              onClick={() => setEditingTime(true)}
              style={{
                fontFamily: t.display,
                fontSize: 32,
                color: t.accent,
                lineHeight: 1,
                minWidth: 110,
                textAlign: 'center',
                background: 'none',
                border: 'none',
                cursor: 'text',
                padding: 0,
              }}
              aria-label="Edit time"
            >
              {fmtTime(dateValue)}
            </button>
          )}
          <button
            onClick={() => stepTime(1)}
            style={stepBtnStyle}
            aria-label="One minute later"
          >
            +
          </button>
          <button
            onClick={setNow}
            style={{
              marginLeft: 'auto',
              padding: '6px 14px',
              borderRadius: 999,
              background: t.bgCard,
              border: `1px solid ${t.borderStrong}`,
              color: t.text,
              fontFamily: t.mono,
              fontSize: 11,
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}
          >
            NOW
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 22px 0' }}>
        <div
          style={{
            fontFamily: t.mono,
            fontSize: 9,
            color: t.textFaint,
            letterSpacing: '0.2em',
            marginBottom: 10,
          }}
        >
          WHERE
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginBottom: 10,
          }}
        >
          {BRANCHES.map((b) => {
            const active = !customBranchEnabled && b === branch
            return (
              <button
                key={b}
                onClick={() => {
                  setBranch(b)
                  setCustomBranchEnabled(false)
                }}
                style={chipStyle(active)}
              >
                {b}
              </button>
            )
          })}
          <button
            onClick={() => setCustomBranchEnabled((v) => !v)}
            style={chipStyle(customBranchEnabled)}
          >
            + custom
          </button>
        </div>
        {customBranchEnabled && (
          <input
            value={customBranch}
            onChange={(e) => setCustomBranch(e.target.value)}
            placeholder="describe the spot"
            style={{
              width: '100%',
              background: t.bgCard,
              border: `1px solid ${t.borderStrong}`,
              borderRadius: 10,
              padding: '8px 12px',
              color: t.text,
              fontFamily: t.sans,
              fontSize: 13,
              outline: 'none',
              marginBottom: 10,
            }}
          />
        )}
        <div
          style={{
            height: 160,
            background: t.bgCard,
            borderRadius: 14,
            border: `1px solid ${t.border}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 320 180">
            <line x1="160" y1="180" x2="160" y2="60" stroke={t.textFaint} strokeWidth="6" />
            <line x1="160" y1="120" x2="80" y2="80" stroke={t.textFaint} strokeWidth="3" />
            <line x1="160" y1="100" x2="240" y2="60" stroke={t.textFaint} strokeWidth="3" />
            <line x1="160" y1="80" x2="120" y2="40" stroke={t.textFaint} strokeWidth="3" />
            <line x1="160" y1="80" x2="200" y2="40" stroke={t.textFaint} strokeWidth="3" />
            <line x1="160" y1="140" x2="270" y2="100" stroke={t.textFaint} strokeWidth="3" />
            {!customBranchEnabled && (
              <>
                <circle cx={pin.x} cy={pin.y} r="9" fill={t.accent} />
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r="9"
                  fill="none"
                  stroke={t.accent}
                  strokeOpacity="0.5"
                  strokeWidth="3"
                >
                  <animate attributeName="r" from="9" to="18" dur="1.5s" repeatCount="indefinite" />
                  <animate
                    attributeName="stroke-opacity"
                    from="0.5"
                    to="0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}
          </svg>
        </div>
      </div>

      <div style={{ padding: '20px 22px 0', display: 'flex', gap: 10 }}>
        <div
          style={{
            flex: 1,
            background: t.bgCard,
            borderRadius: 12,
            padding: 12,
            border: `1px solid ${t.border}`,
          }}
        >
          <div
            style={{
              fontFamily: t.mono,
              fontSize: 9,
              color: t.textFaint,
              letterSpacing: '0.15em',
            }}
          >
            HOOTS
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              marginTop: 6,
            }}
          >
            <div
              style={{
                fontFamily: t.display,
                fontSize: 32,
                color: t.accent,
                lineHeight: 1,
                flex: 1,
              }}
            >
              {hoots}
            </div>
            <button
              onClick={() => setHoots((h) => Math.max(0, h - 1))}
              style={tinyStepBtnStyle}
            >
              −
            </button>
            <button onClick={() => setHoots((h) => h + 1)} style={tinyStepBtnStyle}>
              +
            </button>
          </div>
        </div>
        <div
          style={{
            flex: 1.4,
            background: t.bgCard,
            borderRadius: 12,
            padding: 12,
            border: `1px solid ${t.border}`,
          }}
        >
          <div
            style={{
              fontFamily: t.mono,
              fontSize: 9,
              color: t.textFaint,
              letterSpacing: '0.15em',
            }}
          >
            VIBE
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              marginTop: 6,
            }}
          >
            {MOODS.map((m) => {
              const active = mood === m
              return (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  style={{
                    ...chipStyle(active),
                    fontSize: 10,
                    padding: '3px 8px',
                  }}
                >
                  {m}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 22px 0' }}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="called twice, then silent. squirrel froze on the fence."
          rows={3}
          style={{
            width: '100%',
            background: t.bgCard,
            borderRadius: 12,
            padding: 12,
            border: `1px solid ${t.border}`,
            fontSize: 13,
            color: t.text,
            fontStyle: 'italic',
            fontFamily: t.sans,
            outline: 'none',
            resize: 'none',
          }}
        />
      </div>

      <div style={{ height: 100 }} />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px 22px 22px',
          display: 'flex',
          gap: 10,
          background: `linear-gradient(to top, ${t.bg} 75%, ${t.bg}ee 90%, transparent)`,
          zIndex: 2,
        }}
      >
        <button
          onClick={onOpenJournal}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 12,
            background: t.bgCard,
            border: `1px solid ${t.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: t.sans,
            fontSize: 14,
            fontWeight: 500,
            color: t.text,
            cursor: 'pointer',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="3" y1="4" x2="11" y2="4" />
            <line x1="3" y1="7" x2="11" y2="7" />
            <line x1="3" y1="10" x2="11" y2="10" />
          </svg>
          Sighting journal
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            flex: 1.4,
            height: 48,
            borderRadius: 12,
            background: t.accent,
            color: t.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: t.sans,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '0.01em',
            border: 'none',
            cursor: canSave ? 'pointer' : 'not-allowed',
            opacity: canSave ? 1 : 0.5,
            boxShadow: canSave
              ? `0 0 24px ${t.accent}55, 0 4px 12px rgba(0,0,0,0.3)`
              : 'none',
          }}
        >
          Save sighting
        </button>
      </div>
    </NocturnalShell>
  )
}

const stepBtnStyle = {
  width: 40,
  height: 40,
  borderRadius: 999,
  background: t.bgCard,
  border: `1px solid ${t.border}`,
  color: t.text,
  fontSize: 20,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
} as const

const tinyStepBtnStyle = {
  width: 28,
  height: 28,
  borderRadius: 999,
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${t.border}`,
  color: t.text,
  fontSize: 14,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
} as const

function chipStyle(active: boolean) {
  return {
    padding: '5px 10px',
    borderRadius: 999,
    fontSize: 11,
    background: active ? t.accent : 'transparent',
    color: active ? t.bg : t.textSoft,
    border: `1px solid ${active ? t.accent : t.border}`,
    cursor: 'pointer',
    fontFamily: t.sans,
  } as const
}
