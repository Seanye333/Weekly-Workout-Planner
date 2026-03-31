import { useState } from 'react'
import { useExercises } from '../hooks/useExercises'
import { MUSCLE_GROUPS } from '../utils/constants'
import ExerciseCard from '../components/exercises/ExerciseCard'
import ExerciseForm from '../components/exercises/ExerciseForm'
import Modal from '../components/common/Modal'
import Spinner from '../components/common/Spinner'

export default function ExercisesPage() {
  const { exercises, loading, addExercise, updateExercise, deleteExercise } = useExercises()
  const [showAdd, setShowAdd] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  async function handleAdd(data) {
    setAddLoading(true)
    await addExercise(data)
    setAddLoading(false)
    setShowAdd(false)
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this exercise?')) {
      await deleteExercise(id)
    }
  }

  const filtered = exercises.filter((ex) => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || ex.muscleGroup === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Exercise Library</h1>
          <p className="text-gray-400 text-sm mt-0.5">{exercises.length} exercises</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          + Add Exercise
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="input sm:max-w-xs"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input sm:max-w-48"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Muscles</option>
          {MUSCLE_GROUPS.map((mg) => (
            <option key={mg}>{mg}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          {exercises.length === 0
            ? 'No exercises yet. Add your first one!'
            : 'No exercises match your search.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onUpdate={updateExercise}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="Add Exercise" onClose={() => setShowAdd(false)}>
          <ExerciseForm
            onSubmit={handleAdd}
            onCancel={() => setShowAdd(false)}
            loading={addLoading}
          />
        </Modal>
      )}
    </div>
  )
}
