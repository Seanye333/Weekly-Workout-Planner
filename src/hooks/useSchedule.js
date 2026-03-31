import { useState, useEffect } from 'react'
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import { getWeekId, getWeekStart } from '../utils/dateHelpers'
import { DAYS_OF_WEEK } from '../utils/constants'

function emptyWeek(weekStart) {
  const days = {}
  DAYS_OF_WEEK.forEach((d) => (days[d] = { workouts: [] }))
  return {
    weekStart: weekStart.toISOString().slice(0, 10),
    days,
    updatedAt: null,
  }
}

export function useSchedule(weekStart) {
  const { user } = useAuth()
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(true)

  const weekId = getWeekId(weekStart)

  useEffect(() => {
    if (!user) return
    const ref = doc(db, 'users', user.uid, 'schedule', weekId)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setSchedule({ id: snap.id, ...snap.data() })
      } else {
        setSchedule(emptyWeek(weekStart))
      }
      setLoading(false)
    })
    return unsub
  }, [user, weekId])

  async function addWorkout(dayKey, workoutEntry) {
    const ref = doc(db, 'users', user.uid, 'schedule', weekId)
    const current = schedule || emptyWeek(weekStart)
    const dayWorkouts = current.days?.[dayKey]?.workouts || []
    const updated = {
      ...current.days,
      [dayKey]: { workouts: [...dayWorkouts, workoutEntry] },
    }
    await setDoc(
      ref,
      {
        weekStart: weekStart.toISOString().slice(0, 10),
        days: updated,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
  }

  async function removeWorkout(dayKey, index) {
    const ref = doc(db, 'users', user.uid, 'schedule', weekId)
    const dayWorkouts = [...(schedule?.days?.[dayKey]?.workouts || [])]
    dayWorkouts.splice(index, 1)
    await updateDoc(ref, {
      [`days.${dayKey}.workouts`]: dayWorkouts,
      updatedAt: serverTimestamp(),
    })
  }

  async function markComplete(dayKey, index, isCompleted = true) {
    const ref = doc(db, 'users', user.uid, 'schedule', weekId)
    const dayWorkouts = [...(schedule?.days?.[dayKey]?.workouts || [])]
    dayWorkouts[index] = { ...dayWorkouts[index], isCompleted }
    await updateDoc(ref, {
      [`days.${dayKey}.workouts`]: dayWorkouts,
      updatedAt: serverTimestamp(),
    })
  }

  return { schedule, loading, addWorkout, removeWorkout, markComplete }
}
