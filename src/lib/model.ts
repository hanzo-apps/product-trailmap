import type { BaseRecord } from '@hanzo/base/react'

/**
 * The roadmap's shared vocabulary — one place for the horizon lanes, the status
 * ladder, and the theme palette cards colour against. Pure values (no I/O): the
 * board, detail, and editor all import from here so they speak one language.
 *
 * `initiatives` and `themes` are the two Base collections (see schema.sql).
 * DEFAULT_THEMES seeds the picker and the colour map so a fresh roadmap is
 * legible before a single theme row is saved.
 */

export type Horizon = 'now' | 'next' | 'later'
export type Status = 'planned' | 'building' | 'shipped'

/** One row of the `initiatives` collection. */
export interface Initiative extends BaseRecord {
  title: string
  summary: string
  horizon: Horizon
  status: Status
  theme: string
}

/** One row of the `themes` collection (name → colour). */
export interface Theme extends BaseRecord {
  name: string
  color: string
}

export interface Lane {
  key: Horizon
  label: string
  blurb: string
  tint: string // soft header fill
  edge: string // header hairline
  ink: string // header text
  accent: string // lane accent
}

/** The three horizon lanes, left → right: mint / sky / lilac. */
export const LANES: Lane[] = [
  { key: 'now', label: 'Now', blurb: 'Shipping this cycle', tint: '#E3F6EE', edge: '#C4ECDC', ink: '#0C5A41', accent: '#22B588' },
  { key: 'next', label: 'Next', blurb: 'Lined up right after', tint: '#E7F0FE', edge: '#D2E2FC', ink: '#134A97', accent: '#4C8DF6' },
  { key: 'later', label: 'Later', blurb: 'On the horizon', tint: '#F1EAFC', edge: '#E2D6F8', ink: '#492D84', accent: '#9A6BF2' },
]

export const HORIZONS: Horizon[] = ['now', 'next', 'later']

export function lane(key: Horizon): Lane {
  return LANES.find((l) => l.key === key) ?? LANES[0]
}

export interface Step {
  key: Status
  label: string
  dot: string
  fill: number // 0..1, how full the progress dot reads
}

/** The status ladder a card climbs; `fill` drives the progress dot. */
export const STEPS: Step[] = [
  { key: 'planned', label: 'Planned', dot: '#B8C2D0', fill: 0.12 },
  { key: 'building', label: 'Building', dot: '#F5A524', fill: 0.62 },
  { key: 'shipped', label: 'Shipped', dot: '#22B588', fill: 1 },
]

export function step(key: Status): Step {
  return STEPS.find((s) => s.key === key) ?? STEPS[0]
}

/** Built-in themes — the picker's defaults and the colour map's fallback. */
export const DEFAULT_THEMES: { name: string; color: string }[] = [
  { name: 'Growth', color: '#22B588' },
  { name: 'Platform', color: '#4C8DF6' },
  { name: 'Delight', color: '#9A6BF2' },
  { name: 'Quality', color: '#F5A524' },
  { name: 'Trust', color: '#EC5B8C' },
]

/**
 * Resolve a theme name to its colour — a saved theme wins, then a built-in,
 * then a stable pastel derived from the name so nothing renders colourless.
 */
export function themeColor(name: string, saved: Theme[] = []): string {
  const hit = saved.find((t) => t.name === name) ?? DEFAULT_THEMES.find((t) => t.name === name)
  if (hit) return hit.color
  if (!name) return '#C9D2DE'
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
  return `hsl(${h} 58% 70%)`
}

/** Merge built-in and saved theme names into one ordered, de-duped picker set. */
export function themeChoices(saved: Theme[] = []): { name: string; color: string }[] {
  const out = [...DEFAULT_THEMES]
  for (const t of saved) {
    if (!out.some((d) => d.name === t.name)) out.push({ name: t.name, color: t.color })
  }
  return out
}
