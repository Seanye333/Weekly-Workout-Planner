/**
 * All functions take an array of workoutLog documents and return
 * data shaped for Recharts.
 */

/**
 * Count workouts per week for the last N weeks
 * Returns [{ week: "W12", count: 3 }, ...]
 */
export function getWeeklyFrequency(logs, weeks = 8) {
  const map = {}
  logs.forEach((log) => {
    const d = log.loggedAt?.toDate ? log.loggedAt.toDate() : new Date(log.loggedAt)
    const wk = getISOWeek(d)
    map[wk] = (map[wk] || 0) + 1
  })

  const result = []
  const now = new Date()
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const wk = getISOWeek(d)
    result.push({ week: `W${wk.split('-W')[1]}`, count: map[wk] || 0 })
  }
  return result
}

/**
 * Total volume (sets × reps × weight) per week
 * Returns [{ week: "W12", volume: 4500 }, ...]
 */
export function getVolumeOverTime(logs, weeks = 8) {
  const map = {}
  logs.forEach((log) => {
    const d = log.loggedAt?.toDate ? log.loggedAt.toDate() : new Date(log.loggedAt)
    const wk = getISOWeek(d)
    let vol = 0
    log.exercises?.forEach((ex) => {
      ex.sets?.forEach((s) => {
        if (s.completed) vol += (s.reps || 0) * (s.weight || 0)
      })
    })
    map[wk] = (map[wk] || 0) + vol
  })

  const result = []
  const now = new Date()
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const wk = getISOWeek(d)
    result.push({ week: `W${wk.split('-W')[1]}`, volume: Math.round(map[wk] || 0) })
  }
  return result
}

/**
 * Muscle group distribution (pie chart)
 * Returns [{ name: "Legs", value: 12 }, ...]
 */
export function getMuscleDistribution(logs) {
  const map = {}
  logs.forEach((log) => {
    log.exercises?.forEach((ex) => {
      const mg = ex.muscleGroup || 'Other'
      map[mg] = (map[mg] || 0) + 1
    })
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))
}

/**
 * Average workout duration per week
 * Returns [{ week: "W12", duration: 42 }, ...]
 */
export function getDurationTrend(logs, weeks = 8) {
  const map = {}
  const countMap = {}
  logs.forEach((log) => {
    if (!log.durationMinutes) return
    const d = log.loggedAt?.toDate ? log.loggedAt.toDate() : new Date(log.loggedAt)
    const wk = getISOWeek(d)
    map[wk] = (map[wk] || 0) + log.durationMinutes
    countMap[wk] = (countMap[wk] || 0) + 1
  })

  const result = []
  const now = new Date()
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const wk = getISOWeek(d)
    const avg = countMap[wk] ? Math.round(map[wk] / countMap[wk]) : 0
    result.push({ week: `W${wk.split('-W')[1]}`, duration: avg })
  }
  return result
}

/**
 * Progress for a specific exercise: best weight per week
 * Returns [{ week: "W12", weight: 80 }, ...]
 */
export function getExerciseProgress(logs, exerciseName) {
  const map = {}
  logs.forEach((log) => {
    const ex = log.exercises?.find(
      (e) => e.exerciseName?.toLowerCase() === exerciseName?.toLowerCase()
    )
    if (!ex) return
    const d = log.loggedAt?.toDate ? log.loggedAt.toDate() : new Date(log.loggedAt)
    const wk = getISOWeek(d)
    const best = Math.max(0, ...(ex.sets?.map((s) => s.weight || 0) || [0]))
    if (!map[wk] || best > map[wk]) map[wk] = best
  })

  return Object.entries(map)
    .sort()
    .map(([wk, weight]) => ({ week: `W${wk.split('-W')[1]}`, weight }))
}

/**
 * Summary stats: total workouts, total volume, most frequent muscle, longest streak
 */
export function getSummaryStats(logs) {
  const totalWorkouts = logs.length

  let totalVolume = 0
  logs.forEach((log) => {
    log.exercises?.forEach((ex) => {
      ex.sets?.forEach((s) => {
        if (s.completed) totalVolume += (s.reps || 0) * (s.weight || 0)
      })
    })
  })

  const muscleCounts = {}
  logs.forEach((log) => {
    log.exercises?.forEach((ex) => {
      const mg = ex.muscleGroup || 'Other'
      muscleCounts[mg] = (muscleCounts[mg] || 0) + 1
    })
  })
  const topMuscle =
    Object.entries(muscleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

  // Streak: consecutive days with at least one workout
  const logDays = new Set(
    logs.map((log) => {
      const d = log.loggedAt?.toDate ? log.loggedAt.toDate() : new Date(log.loggedAt)
      return d.toISOString().slice(0, 10)
    })
  )
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (logDays.has(d.toISOString().slice(0, 10))) streak++
    else break
  }

  return { totalWorkouts, totalVolume: Math.round(totalVolume), topMuscle, streak }
}

// Internal helper
function getISOWeek(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`
}
