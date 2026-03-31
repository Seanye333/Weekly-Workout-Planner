import { useState } from 'react'
import { MUSCLE_GROUPS, WEIGHT_UNITS } from '../../utils/constants'

const defaultData = {
  name: '',
  muscleGroup: 'Chest',
  description: '',
  defaultSets: 3,
  defaultReps: 10,
  defaultWeight: 0,
  weightUnit: 'kg',
}

export default function ExerciseForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...defaultData, ...initial })

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSubmit({
      ...form,
      defaultSets: Number(form.defaultSets),
      defaultReps: Number(form.defaultReps),
      defaultWeight: Number(form.defaultWeight),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Exercise Name *</label>
        <input
          className="input"
          placeholder="e.g. Barbell Squat"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label">Muscle Group</label>
        <select
          className="input"
          value={form.muscleGroup}
          onChange={(e) => set('muscleGroup', e.target.value)}
        >
          {MUSCLE_GROUPS.map((mg) => (
            <option key={mg}>{mg}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Description (optional)</label>
        <textarea
          className="input resize-none"
          rows={2}
          placeholder="Form tips, notes..."
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label">Default Sets</label>
          <input
            type="number"
            min={1}
            className="input"
            value={form.defaultSets}
            onChange={(e) => set('defaultSets', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Default Reps</label>
          <input
            type="number"
            min={1}
            className="input"
            value={form.defaultReps}
            onChange={(e) => set('defaultReps', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Default Weight</label>
          <input
            type="number"
            min={0}
            step={0.5}
            className="input"
            value={form.defaultWeight}
            onChange={(e) => set('defaultWeight', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label">Weight Unit</label>
        <div className="flex gap-4">
          {WEIGHT_UNITS.map((u) => (
            <label key={u} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="weightUnit"
                value={u}
                checked={form.weightUnit === u}
                onChange={() => set('weightUnit', u)}
                className="accent-indigo-500"
              />
              <span className="text-gray-300">{u}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1" disabled={loading}>
          {loading ? 'Saving...' : 'Save Exercise'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
