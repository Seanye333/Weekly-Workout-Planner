import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

const PAGE_SIZE = 20

export function useWorkoutLog() {
  const { user } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastDoc, setLastDoc] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  async function fetchLogs(reset = false) {
    if (!user) return
    setLoading(true)
    const q = reset
      ? query(
          collection(db, 'users', user.uid, 'workoutLogs'),
          orderBy('loggedAt', 'desc'),
          limit(PAGE_SIZE)
        )
      : query(
          collection(db, 'users', user.uid, 'workoutLogs'),
          orderBy('loggedAt', 'desc'),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        )

    const snap = await getDocs(q)
    const newLogs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    setLogs((prev) => (reset ? newLogs : [...prev, ...newLogs]))
    setLastDoc(snap.docs[snap.docs.length - 1] || null)
    setHasMore(snap.docs.length === PAGE_SIZE)
    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchLogs(true)
  }, [user])

  async function fetchAllLogs() {
    if (!user) return []
    const q = query(
      collection(db, 'users', user.uid, 'workoutLogs'),
      orderBy('loggedAt', 'asc')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }

  async function createLog(logData) {
    if (!user) return
    const docRef = await addDoc(collection(db, 'users', user.uid, 'workoutLogs'), {
      ...logData,
      loggedAt: serverTimestamp(),
    })
    // Prepend to current list
    const newLog = { id: docRef.id, ...logData, loggedAt: { toDate: () => new Date() } }
    setLogs((prev) => [newLog, ...prev])
    return docRef.id
  }

  return { logs, loading, hasMore, fetchLogs, fetchAllLogs, createLog }
}
