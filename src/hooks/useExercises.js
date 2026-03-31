import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export function useExercises() {
  const { user } = useAuth()
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'users', user.uid, 'exercises'),
      orderBy('createdAt', 'asc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setExercises(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [user])

  async function addExercise(data) {
    await addDoc(collection(db, 'users', user.uid, 'exercises'), {
      ...data,
      createdAt: serverTimestamp(),
    })
  }

  async function updateExercise(id, data) {
    await updateDoc(doc(db, 'users', user.uid, 'exercises', id), data)
  }

  async function deleteExercise(id) {
    await deleteDoc(doc(db, 'users', user.uid, 'exercises', id))
  }

  return { exercises, loading, addExercise, updateExercise, deleteExercise }
}
