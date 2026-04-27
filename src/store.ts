import { useEffect, useState, useCallback } from 'react'
import type { AppState, Owl, Sighting } from './types'

const KEY = 'nocturnal:v1'

const FIRST_RUN: AppState = {
  schemaVersion: 1,
  owls: [
    { id: 'owl-1', name: '', trait: '', hue: 28 },
    { id: 'owl-2', name: '', trait: '', hue: 200 },
    { id: 'owl-3', name: '', trait: '', hue: 320 },
  ],
  sightings: [],
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return FIRST_RUN
    const parsed = JSON.parse(raw) as Partial<AppState>
    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.owls)) return FIRST_RUN
    return {
      schemaVersion: 1,
      owls: parsed.owls as Owl[],
      sightings: (parsed.sightings ?? []) as Sighting[],
    }
  } catch {
    return FIRST_RUN
  }
}

function save(s: AppState) {
  localStorage.setItem(KEY, JSON.stringify(s))
}

export function useStore() {
  const [state, setState] = useState<AppState>(() => load())

  useEffect(() => {
    save(state)
  }, [state])

  const renameOwl = useCallback(
    (idx: number, field: 'name' | 'trait', value: string) => {
      setState((s) => {
        const owls = s.owls.slice()
        owls[idx] = { ...owls[idx], [field]: value }
        return { ...s, owls }
      })
    },
    [],
  )

  const addSighting = useCallback((sighting: Sighting) => {
    setState((s) => ({
      ...s,
      sightings: [sighting, ...s.sightings].sort((a, b) =>
        a.date < b.date ? 1 : -1,
      ),
    }))
  }, [])

  return { state, renameOwl, addSighting }
}
