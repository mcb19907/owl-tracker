export const tokens = {
  bg: '#0a0e1a',
  bgRaised: '#131829',
  bgCard: '#1a2138',
  border: 'rgba(180,200,255,0.08)',
  borderStrong: 'rgba(180,200,255,0.18)',
  text: '#e8ecf6',
  textSoft: 'rgba(232,236,246,0.65)',
  textFaint: 'rgba(232,236,246,0.35)',
  glow: '#9bb4ff',
  accent: '#c9a96e',
  sans: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  display: '"Fraunces", "Cormorant Garamond", serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const

export const SHELL_W = 360
export const SHELL_H = 740

export const BRANCHES = [
  'East fork',
  'High crown',
  'Low oak limb',
  'Garage-side perch',
  'South branch',
  'Trunk hollow',
] as const

export const MOODS = [
  'calm',
  'alert',
  'hunting',
  'preening',
  'calling',
  'sleepy',
  'curious',
] as const

export const WEATHERS = [
  'clear',
  'cloudy',
  'foggy',
  'drizzle',
  'crisp',
  'windy',
] as const
