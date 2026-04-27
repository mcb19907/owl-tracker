import { useMemo, useState } from 'react'
import { tokens } from '../tokens'
import type { Owl, Sighting } from '../types'
import { NocturnalShell } from '../components/NocturnalShell'
import { HistoryHeader } from '../components/HistoryHeader'
import { dayKey, fmtTime, relDate } from '../helpers'

const t = tokens

type Props = {
  owls: Owl[]
  sightings: Sighting[]
  onBack: () => void
  onSwitch: (next: 'timeline' | 'calendar') => void
}

export function Timeline({ owls, sightings, onBack, onSwitch }: Props) {
  const [filter, setFilter] = useState<string>('all')
  const now = useMemo(() => new Date(), [])

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? sightings
        : sightings.filter((s) => s.owlId === filter),
    [filter, sightings],
  )

  const nightCount = useMemo(() => {
    const nights = new Set<string>()
    for (const s of filtered) nights.add(dayKey(new Date(s.date)))
    return nights.size
  }, [filtered])

  return (
    <NocturnalShell>
      <HistoryHeader active="timeline" onBack={onBack} onSwitch={onSwitch} />

      <div style={{ padding: '0 22px' }}>
        <div
          style={{
            fontFamily: t.display,
            fontSize: 30,
            marginTop: 16,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {filtered.length} sighting{filtered.length === 1 ? '' : 's'},
          <br />
          <span style={{ color: t.accent }}>
            {nightCount} night{nightCount === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <div
        style={{
          padding: '14px 22px 0',
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
        }}
      >
        <FilterChip
          label="all"
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        {owls
          .filter((o) => o.name.trim().length > 0)
          .map((o) => (
            <FilterChip
              key={o.id}
              label={o.name.toLowerCase()}
              active={filter === o.id}
              onClick={() => setFilter(o.id)}
            />
          ))}
      </div>

      <div style={{ padding: '20px 22px 30px' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '32px 12px',
              textAlign: 'center',
              color: t.textFaint,
              fontStyle: 'italic',
              fontSize: 13,
            }}
          >
            {sightings.length === 0
              ? 'No sightings yet — tap + to log your first.'
              : 'No sightings for this owl yet.'}
          </div>
        ) : (
          filtered.map((x, i) => {
            const owl = owls.find((o) => o.id === x.owlId)
            const isLast = i === filtered.length - 1
            return (
              <div
                key={x.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  paddingBottom: 16,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 24,
                    flexShrink: 0,
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {!isLast && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 18,
                        bottom: -16,
                        width: 1,
                        background: t.border,
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: t.accent,
                      marginTop: 4,
                      boxShadow: i === 0 ? `0 0 12px ${t.accent}` : 'none',
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 8,
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ fontFamily: t.display, fontSize: 17 }}>
                      {owl?.name || 'Unnamed owl'}
                    </span>
                    <span
                      style={{
                        fontFamily: t.mono,
                        fontSize: 10,
                        color: t.textFaint,
                      }}
                    >
                      {relDate(new Date(x.date), now)} · {fmtTime(new Date(x.date))}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: t.textSoft,
                      marginTop: 3,
                    }}
                  >
                    {x.branch} · {x.mood} · {x.hoots} hoot{x.hoots === 1 ? '' : 's'}
                  </div>
                  {x.note && (
                    <div
                      style={{
                        fontSize: 12,
                        color: t.textSoft,
                        fontStyle: 'italic',
                        marginTop: 4,
                      }}
                    >
                      "{x.note}"
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </NocturnalShell>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 10px',
        borderRadius: 999,
        fontSize: 11,
        background: active ? t.accent : 'transparent',
        color: active ? t.bg : t.textSoft,
        border: `1px solid ${active ? t.accent : t.border}`,
        cursor: 'pointer',
        fontFamily: t.sans,
      }}
    >
      {label}
    </button>
  )
}
