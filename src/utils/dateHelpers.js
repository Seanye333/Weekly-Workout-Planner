import { DAYS_OF_WEEK } from './constants'

/**
 * Returns the ISO week key for a given date, e.g. "2026-W12"
 */
export function getWeekId(date = new Date()) {
  const d = new Date(date)
  // Thursday in current week determines the year
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

/**
 * Returns the Monday (start) of the week containing `date`
 */
export function getWeekStart(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() || 7 // treat Sunday as 7
  d.setDate(d.getDate() - day + 1)
  return d
}

/**
 * Returns array of 7 Date objects for the week starting at `weekStart`
 */
export function getWeekDates(weekStart) {
  return DAYS_OF_WEEK.map((_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })
}

/**
 * Returns lowercase day key ("monday", "tuesday", ...) for a Date
 */
export function getDayKey(date) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

/**
 * Format a date as "Mar 21"
 */
export function formatShortDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Format a date as "Monday, March 21, 2026"
 */
export function formatFullDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format a date as "MM/DD/YYYY"
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US')
}

/**
 * Returns true if two dates fall on the same calendar day
 */
export function isSameDay(a, b) {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

/**
 * Format seconds into MM:SS
 */
export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Navigate weeks: offset = 1 (next) or -1 (prev)
 */
export function offsetWeek(weekStart, offset) {
  const d = new Date(weekStart)
  d.setDate(d.getDate() + offset * 7)
  return d
}
