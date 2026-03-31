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

export function useTemplates() {
  const { user } = useAuth()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'users', user.uid, 'templates'),
      orderBy('createdAt', 'asc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setTemplates(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [user])

  async function addTemplate(data) {
    await addDoc(collection(db, 'users', user.uid, 'templates'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  async function updateTemplate(id, data) {
    await updateDoc(doc(db, 'users', user.uid, 'templates', id), {
      ...data,
      updatedAt: serverTimestamp(),
    })
  }

  async function deleteTemplate(id) {
    await deleteDoc(doc(db, 'users', user.uid, 'templates', id))
  }

  return { templates, loading, addTemplate, updateTemplate, deleteTemplate }
}
