import type { MOODS, WEATHERS } from './tokens'

export type Mood = (typeof MOODS)[number]
export type Weather = (typeof WEATHERS)[number]

export type Owl = {
  id: string
  name: string
  trait: string
  hue: number
}

export type Sighting = {
  id: string
  date: string
  owlId: string
  branch: string
  mood: Mood
  hoots: number
  weather: Weather
  note?: string
}

export type AppState = {
  schemaVersion: 1
  owls: Owl[]
  sightings: Sighting[]
}

export type Screen = 'home' | 'log' | 'timeline' | 'calendar'
