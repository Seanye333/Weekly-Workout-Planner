import { useState } from 'react'
import { MUSCLE_GROUP_COLORS } from '../../utils/constants'

export default function TemplateForm({ initial = {}, exercises, onSubmit, onCancel, loading }) {
  const [name, setName] = useState(initial.name || '')
  const [description, setDescription] = useState(initial.description || '')
  const [selected, setSelected] = useState(initial.exercises || [])
  const [search, setSearch] = useState('')

  const filtered = exercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.find((s) => s.exerciseId === ex.id)
  )

  function addExercise(ex) {
    setSelected((prev) => [
      ...prev,
      {
        exerciseId: ex.id,
        exerciseName: ex.name,
        muscleGroup: ex.muscleGroup,
        sets: ex.defaultSets,
        reps: ex.defaultReps,
        weight: ex.defaultWeight,
        weightUnit: ex.weightUnit,
        order: prev.length,
      },
    ])
    setSearch('')
  }

  function removeExercise(index) {
    setSelected((prev) => prev.filter((_, i) => i !== index))
  }

  function updateExercise(index, field, value) {
    setSelected((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: Number(value) } : ex))
    )
  }

  function moveUp(index) {
    if (index === 0) return
    setSelected((prev) => {
      const arr = [...prev]
      ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
      return arr
    })
  }

  function moveDown(index) {
    if (index === selected.length - 1) return
    setSelected((prev) => {
      const arr = [...prev]
      ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
      return arr
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || selected.length === 0) return
    onSubmit({ name, description, exercises: selected.map((ex, i) => ({ ...ex, order: i })) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Template Name *</label>
        <input
          className="input"
          placeholder="e.g. Push Day A"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label">Description (optional)</label>
        <input
          className="input"
          placeholder="Optional notes"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Exercise picker */}
      <div>
        <label className="label">Add Exercises</label>
        <input
          className="input"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && filtered.length > 0 && (
          <div className="mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
            {filtered.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => addExercise(ex)}
                className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <span className="text-white text-sm">{ex.name}</span>
                <span className={`badge ${MUSCLE_GROUP_COLORS[ex.muscleGroup]}`}>
                  {ex.muscleGroup}
                </span>
              </button>
            ))}
          </div>
        )}
        {search && filtered.length === 0 && (
          <p className="text-sm text-gray-500 mt-1">No matching exercises found.</p>
        )}
      </div>

      {/* Selected exercises */}
      {selected.length > 0 && (
        <div className="space-y-2">
          <label className="label">Exercises ({selected.length})</label>
          {selected.map((ex, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white text-sm">{ex.exerciseName}</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveUp(i)} className="text-gray-500 hover:text-white px-1">↑</button>
                  <button type="button" onClick={() => moveDown(i)} className="text-gray-500 hover:text-white px-1">↓</button>
                  <button type="button" onClick={() => removeExercise(i)} className="text-gray-500 hover:text-red-400 px-1">✕</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Sets</label>
                  <input
                    type="number"
                    min={1}
                    className="input py-1 text-sm"
                    value={ex.sets}
                    onChange={(e) => updateExercise(i, 'sets', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Reps</label>
                  <input
                    type="number"
                    min={1}
                    className="input py-1 text-sm"
                    value={ex.reps}
                    onChange={(e) => updateExercise(i, 'reps', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Weight ({ex.weightUnit})</label>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    className="input py-1 text-sm"
                    value={ex.weight}
                    onChange={(e) => updateExercise(i, 'weight', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-2">
          Search and add at least one exercise.
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="btn-primary flex-1"
          disabled={loading || !name.trim() || selected.length === 0}
        >
          {loading ? 'Saving...' : 'Save Template'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
