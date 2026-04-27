import { tokens } from '../tokens'
import type { Owl, Sighting } from '../types'
import { NocturnalShell } from '../components/NocturnalShell'
import { EditableField } from '../components/EditableField'
import {
  fmtTime,
  lastSightingFor,
  moonGlyph,
  moonName,
  moonPhaseFor,
  relDate,
  streakFor,
} from '../helpers'

const t = tokens

type Props = {
  owls: Owl[]
  sightings: Sighting[]
  onRenameOwl: (idx: number, field: 'name' | 'trait', value: string) => void
  onOpenLog: () => void
}

export function Home({ owls, sightings, onRenameOwl, onOpenLog }: Props) {
  const now = new Date()
  const phase = moonPhaseFor(now)
  const sunset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 42)
  const sunrise = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 18)

  const nowLabel = fmtTime(now)
  const longDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <NocturnalShell>
      <div
        style={{
          padding: '14px 22px 0',
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: t.mono,
          fontSize: 10,
          color: t.textFaint,
          letterSpacing: '0.1em',
        }}
      >
        <span>{nowLabel}</span>
        <span>NIGHT MODE · ON</span>
      </div>

      <div style={{ padding: '24px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', width: 68, height: 68, flexShrink: 0 }}>
            <div
              style={{
                position: 'absolute',
                inset: -14,
                background: `radial-gradient(circle, ${t.accent}33, transparent 70%)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: '#f0e6c8',
                boxShadow: `inset -10px -8px 0 #d4c294, 0 0 30px ${t.accent}55`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 18,
                left: 22,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#c4b487',
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 36,
                left: 14,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#c4b487',
                opacity: 0.5,
              }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: t.display,
                fontSize: 24,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              {longDate}
            </div>
            <div style={{ fontSize: 12, color: t.textSoft, marginTop: 6 }}>
              {moonGlyph(phase)} {moonName(phase).toLowerCase()} · sunset{' '}
              {fmtTime(sunset)} · sunrise {fmtTime(sunrise)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 22px 0' }}>
        <div
          style={{
            fontFamily: t.mono,
            fontSize: 10,
            color: t.textFaint,
            letterSpacing: '0.2em',
            marginBottom: 12,
          }}
        >
          THE TRIO
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {owls.map((owl, i) => {
            const streak = streakFor(owl.id, sightings, now)
            const last = lastSightingFor(owl.id, sightings)
            return (
              <div
                key={owl.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 14px',
                  background: t.bgCard,
                  borderRadius: 12,
                  border: `1px solid ${t.border}`,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: t.accent,
                    boxShadow: last ? `0 0 8px ${t.accent}` : 'none',
                    opacity: last ? 1 : 0.4,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <EditableField
                      value={owl.name}
                      placeholder="✎ tap to name"
                      hintColor={t.accent}
                      onChange={(v) => onRenameOwl(i, 'name', v)}
                      style={{
                        fontFamily: t.display,
                        fontSize: 22,
                        lineHeight: 1.1,
                        letterSpacing: '-0.01em',
                        color: owl.name ? t.text : t.textFaint,
                      }}
                    />
                    {streak > 0 && (
                      <span
                        style={{
                          fontFamily: t.mono,
                          fontSize: 11,
                          color: t.accent,
                          letterSpacing: '0.06em',
                        }}
                      >
                        {streak}n
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: 2 }}>
                    <EditableField
                      value={owl.trait}
                      placeholder="trait?"
                      hintColor={t.accent}
                      onChange={(v) => onRenameOwl(i, 'trait', v)}
                      style={{
                        fontSize: 12,
                        fontStyle: 'italic',
                        color: t.textSoft,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: t.mono,
                      fontSize: 10,
                      color: t.textFaint,
                      letterSpacing: '0.06em',
                      marginTop: 6,
                    }}
                  >
                    {last
                      ? `${relDate(new Date(last.date), now)} · ${last.branch}`
                      : 'No sightings yet'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ height: 110 }} />

      <div
        style={{
          position: 'absolute',
          bottom: 26,
          right: 22,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: t.mono,
            fontSize: 10,
            color: t.textSoft,
            letterSpacing: '0.08em',
            background: 'rgba(20,26,44,0.7)',
            padding: '6px 10px',
            borderRadius: 999,
            border: `1px solid ${t.border}`,
            backdropFilter: 'blur(6px)',
          }}
        >
          Log a sighting
        </div>
        <button
          onClick={onOpenLog}
          aria-label="Log a sighting"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: t.accent,
            color: t.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 24px ${t.accent}55, 0 4px 12px rgba(0,0,0,0.3)`,
            fontSize: 28,
            fontWeight: 300,
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
          }}
        >
          +
        </button>
      </div>
    </NocturnalShell>
  )
}
