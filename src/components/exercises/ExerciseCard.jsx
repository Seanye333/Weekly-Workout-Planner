import { useState } from 'react'
import { MUSCLE_GROUP_COLORS } from '../../utils/constants'
import Modal from '../common/Modal'
import ExerciseForm from './ExerciseForm'

export default function ExerciseCard({ exercise, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const badgeClass = MUSCLE_GROUP_COLORS[exercise.muscleGroup] || 'bg-gray-700 text-gray-300'

  async function handleUpdate(data) {
    setLoading(true)
    await onUpdate(exercise.id, data)
    setLoading(false)
    setEditing(false)
  }

  return (
    <>
      <div className="card flex flex-col gap-3 hover:border-gray-700 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">{exercise.name}</h3>
            <span className={`badge mt-1 ${badgeClass}`}>{exercise.muscleGroup}</span>
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="text-gray-500 hover:text-indigo-400 transition-colors p-1"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(exercise.id)}
              className="text-gray-500 hover:text-red-400 transition-colors p-1"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="flex gap-4 text-sm text-gray-400">
          <span>{exercise.defaultSets} sets</span>
          <span>×</span>
          <span>{exercise.defaultReps} reps</span>
          {exercise.defaultWeight > 0 && (
            <>
              <span>@</span>
              <span>{exercise.defaultWeight} {exercise.weightUnit}</span>
            </>
          )}
        </div>

        {exercise.description && (
          <p className="text-xs text-gray-500 leading-relaxed">{exercise.description}</p>
        )}
      </div>

      {editing && (
        <Modal title="Edit Exercise" onClose={() => setEditing(false)}>
          <ExerciseForm
            initial={exercise}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
            loading={loading}
          />
        </Modal>
      )}
    </>
  )
}
