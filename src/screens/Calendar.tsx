import { useMemo, useState } from 'react'
import { tokens } from '../tokens'
import type { Owl, Sighting } from '../types'
import { NocturnalShell } from '../components/NocturnalShell'
import { HistoryHeader } from '../components/HistoryHeader'
import { computeBadges, dayKey, fmtTime } from '../helpers'

const t = tokens

type Props = {
  owls: Owl[]
  sightings: Sighting[]
  onBack: () => void
  onSwitch: (next: 'timeline' | 'calendar') => void
}

const WEEKS = 14

export function Calendar({ owls, sightings, onBack, onSwitch }: Props) {
  const today = useMemo(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
    [],
  )

  const { counts, byDay } = useMemo(() => {
    const counts: Record<string, number> = {}
    const byDay: Record<string, Sighting[]> = {}
    for (const s of sightings) {
      const k = dayKey(new Date(s.date))
      counts[k] = (counts[k] ?? 0) + 1
      ;(byDay[k] = byDay[k] ?? []).push(s)
    }
    return { counts, byDay }
  }, [sightings])

  const todayKey = dayKey(today)
  const [selected, setSelected] = useState<string | null>(todayKey)

  const grid = useMemo(() => {
    const rows: { date: Date; key: string; count: number; future: boolean }[][] = []
    const todayDow = today.getDay()
    for (let w = WEEKS - 1; w >= 0; w--) {
      const row: { date: Date; key: string; count: number; future: boolean }[] = []
      for (let d = 0; d < 7; d++) {
        const offset = w * 7 + (6 - d) - (6 - todayDow)
        const date = new Date(today)
        date.setDate(today.getDate() - offset)
        const key = dayKey(date)
        row.push({
          date,
          key,
          count: counts[key] ?? 0,
          future: date.getTime() > today.getTime(),
        })
      }
      rows.push(row)
    }
    return rows
  }, [today, counts])

  const selectedDate = selected
    ? new Date(`${selected}T12:00:00`)
    : null
  const selectedSightings = selected ? byDay[selected] ?? [] : []
  const badges = useMemo(() => computeBadges(sightings), [sightings])

  return (
    <NocturnalShell>
      <HistoryHeader active="calendar" onBack={onBack} onSwitch={onSwitch} />

      <div style={{ padding: '0 22px' }}>
        <div
          style={{
            fontFamily: t.display,
            fontSize: 28,
            marginTop: 14,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Your owl
          <br />
          <span style={{ color: t.accent }}>constellation</span>
        </div>
      </div>

      <div style={{ padding: '20px 22px 0' }}>
        {grid.map((row, wi) => (
          <div key={wi} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            {row.map((cell) => {
              const intensity = Math.min(4, cell.count)
              const isSelected = cell.key === selected
              const isToday = cell.key === todayKey
              const bg = cell.future
                ? 'transparent'
                : intensity === 0
                  ? t.bgCard
                  : `color-mix(in oklab, ${t.accent} ${30 + intensity * 18}%, ${t.bg})`
              const glow = isSelected
                ? `0 0 0 2px ${t.accent}, 0 0 12px ${t.accent}aa`
                : intensity >= 3
                  ? `0 0 8px ${t.accent}aa`
                  : 'none'
              return (
                <button
                  key={cell.key}
                  onClick={() => {
                    if (cell.future) return
                    setSelected(isSelected ? null : cell.key)
                  }}
                  disabled={cell.future}
                  style={{
                    flex: 1,
                    aspectRatio: '1',
                    background: bg,
                    borderRadius: 4,
                    boxShadow: glow,
                    border: cell.future
                      ? `1px dashed ${t.border}`
                      : `1px solid ${t.border}`,
                    position: 'relative',
                    cursor: cell.future ? 'default' : 'pointer',
                    transition: 'box-shadow 150ms ease',
                    padding: 0,
                  }}
                >
                  {isToday && !isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        border: `1.5px solid ${t.accent}`,
                        borderRadius: 4,
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {selected && selectedDate && (
        <div style={{ padding: '16px 22px 0' }}>
          <div
            style={{
              background: t.bgCard,
              borderRadius: 12,
              border: `1px solid ${t.border}`,
              padding: 14,
              animation: 'slideIn 200ms ease-out',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <div
                style={{
                  fontFamily: t.display,
                  fontSize: 18,
                  letterSpacing: '-0.01em',
                }}
              >
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div
                style={{
                  fontFamily: t.mono,
                  fontSize: 10,
                  color: t.accent,
                  letterSpacing: '0.15em',
                }}
              >
                {selectedSightings.length === 0
                  ? 'QUIET'
                  : `${selectedSightings.length} SIGHTING${selectedSightings.length > 1 ? 'S' : ''}`}
              </div>
            </div>
            {selectedSightings.length === 0 ? (
              <div
                style={{
                  fontSize: 12,
                  color: t.textFaint,
                  fontStyle: 'italic',
                  marginTop: 8,
                }}
              >
                No owls logged. The forest was still.
              </div>
            ) : (
              <div
                style={{
                  marginTop: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {selectedSightings.map((x, i) => {
                  const owl = owls.find((o) => o.id === x.owlId)
                  return (
                    <div
                      key={x.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        paddingTop: i > 0 ? 8 : 0,
                        borderTop: i > 0 ? `1px solid ${t.border}` : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 999,
                          background: t.accent,
                          boxShadow: `0 0 6px ${t.accent}`,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>
                          {owl?.name || 'Unnamed owl'}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: t.textSoft,
                            fontStyle: 'italic',
                            marginTop: 1,
                          }}
                        >
                          {x.note || `${x.hoots} hoots · ${x.mood}`}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: t.mono,
                          fontSize: 10,
                          color: t.textFaint,
                        }}
                      >
                        {fmtTime(new Date(x.date))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: '24px 22px 30px' }}>
        <div
          style={{
            fontFamily: t.mono,
            fontSize: 10,
            color: t.textFaint,
            letterSpacing: '0.2em',
            marginBottom: 10,
          }}
        >
          BADGES
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {badges.map((b) => (
            <div
              key={b.id}
              style={{
                flex: 1,
                padding: '10px 6px',
                textAlign: 'center',
                background: t.bgCard,
                borderRadius: 10,
                border: `1px solid ${t.border}`,
                opacity: b.earned ? 1 : 0.4,
              }}
            >
              <div style={{ fontSize: 16, color: t.accent, lineHeight: 1 }}>
                {b.glyph}
              </div>
              <div style={{ fontSize: 10, marginTop: 4 }}>{b.name}</div>
              <div
                style={{
                  fontSize: 9,
                  color: t.textFaint,
                  fontFamily: t.mono,
                  marginTop: 2,
                }}
              >
                ×{b.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </NocturnalShell>
  )
}
