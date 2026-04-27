import type { Sighting, Weather } from './types'

export function dayKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fmtTime(d: Date): string {
  let h = d.getHours()
  const m = d.getMinutes()
  const ampm = h >= 12 ? 'pm' : 'am'
  h = h % 12 || 12
  return `${h}:${m.toString().padStart(2, '0')}${ampm}`
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function relDate(d: Date, now: Date = new Date()): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const that = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = Math.floor((today.getTime() - that.getTime()) / 86400000)
  if (diff === 0) return 'Tonight'
  if (diff === 1) return 'Last night'
  if (diff < 7) return `${diff}d ago`
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`
  return fmtDate(d)
}

const MOON_CYCLE = 29.53
const MOON_REF = new Date(2026, 0, 8)

export function moonPhaseFor(d: Date): number {
  const age = (d.getTime() - MOON_REF.getTime()) / 86400000
  const p = ((age % MOON_CYCLE) + MOON_CYCLE) % MOON_CYCLE / MOON_CYCLE
  return p
}

export function moonGlyph(p: number): string {
  if (p < 0.03 || p > 0.97) return '🌑'
  if (p < 0.22) return '🌒'
  if (p < 0.28) return '🌓'
  if (p < 0.47) return '🌔'
  if (p < 0.53) return '🌕'
  if (p < 0.72) return '🌖'
  if (p < 0.78) return '🌗'
  return '🌘'
}

export function moonName(p: number): string {
  if (p < 0.03 || p > 0.97) return 'New moon'
  if (p < 0.22) return 'Waxing crescent'
  if (p < 0.28) return 'First quarter'
  if (p < 0.47) return 'Waxing gibbous'
  if (p < 0.53) return 'Full moon'
  if (p < 0.72) return 'Waning gibbous'
  if (p < 0.78) return 'Last quarter'
  return 'Waning crescent'
}

export function weatherGlyph(w: Weather): string {
  return (
    { clear: '✦', cloudy: '☁', foggy: '∽', drizzle: '𑗅', crisp: '✦', windy: '~' }[
      w
    ] || '·'
  )
}

export function streakFor(
  owlId: string,
  sightings: Sighting[],
  now: Date = new Date(),
): number {
  const seen = new Set<string>()
  for (const s of sightings) {
    if (s.owlId === owlId) seen.add(dayKey(new Date(s.date)))
  }
  if (seen.size === 0) return 0
  let anchor: Date | null = null
  for (let d = 0; d < 365; d++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - d)
    if (seen.has(dayKey(day))) {
      anchor = day
      break
    }
  }
  if (!anchor) return 0
  let streak = 0
  for (let d = 0; d < 365; d++) {
    const day = new Date(
      anchor.getFullYear(),
      anchor.getMonth(),
      anchor.getDate() - d,
    )
    if (seen.has(dayKey(day))) streak++
    else break
  }
  return streak
}

export function lastSightingFor(
  owlId: string,
  sightings: Sighting[],
): Sighting | undefined {
  let best: Sighting | undefined
  for (const s of sightings) {
    if (s.owlId !== owlId) continue
    if (!best || s.date > best.date) best = s
  }
  return best
}

export type Badge = {
  id: string
  name: string
  desc: string
  count: number
  glyph: string
  earned: boolean
}

export function computeBadges(sightings: Sighting[]): Badge[] {
  const dayCounts: Record<string, Set<string>> = {}
  for (const s of sightings) {
    const k = dayKey(new Date(s.date))
    if (!dayCounts[k]) dayCounts[k] = new Set()
    dayCounts[k].add(s.owlId)
  }
  const allThree = Object.values(dayCounts).filter((s) => s.size === 3).length
  const totalNights = Object.keys(dayCounts).length
  const totalHoots = sightings.reduce((a, s) => a + s.hoots, 0)
  return [
    {
      id: 'trifecta',
      name: 'Full house',
      desc: 'All three in one night',
      count: allThree,
      glyph: '◉◉◉',
      earned: allThree > 0,
    },
    {
      id: 'nights',
      name: 'Night watcher',
      desc: `${totalNights} nights logged`,
      count: totalNights,
      glyph: '☾',
      earned: totalNights >= 50,
    },
    {
      id: 'hoots',
      name: 'Hoot collector',
      desc: `${totalHoots} hoots tallied`,
      count: totalHoots,
      glyph: '♪',
      earned: totalHoots >= 200,
    },
    {
      id: 'firstNight',
      name: 'First night',
      desc: 'Your first sighting',
      count: sightings.length > 0 ? 1 : 0,
      glyph: '✦',
      earned: sightings.length > 0,
    },
  ]
}

export function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
