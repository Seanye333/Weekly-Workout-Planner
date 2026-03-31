import { useState } from 'react'
import { MUSCLE_GROUP_COLORS } from '../../utils/constants'
import Modal from '../common/Modal'
import TemplateForm from './TemplateForm'

export default function TemplateCard({ template, exercises, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleUpdate(data) {
    setLoading(true)
    await onUpdate(template.id, data)
    setLoading(false)
    setEditing(false)
  }

  return (
    <>
      <div className="card flex flex-col gap-3 hover:border-gray-700 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-white">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-gray-400 mt-0.5">{template.description}</p>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="text-gray-500 hover:text-indigo-400 transition-colors p-1"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(template.id)}
              className="text-gray-500 hover:text-red-400 transition-colors p-1"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {template.exercises?.slice(0, 5).map((ex, i) => (
            <span
              key={i}
              className={`badge ${MUSCLE_GROUP_COLORS[ex.muscleGroup] || 'bg-gray-700 text-gray-300'}`}
            >
              {ex.exerciseName}
            </span>
          ))}
          {template.exercises?.length > 5 && (
            <span className="badge bg-gray-700 text-gray-400">
              +{template.exercises.length - 5} more
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500">
          {template.exercises?.length || 0} exercise{template.exercises?.length !== 1 ? 's' : ''}
        </p>
      </div>

      {editing && (
        <Modal title="Edit Template" onClose={() => setEditing(false)} wide>
          <TemplateForm
            initial={template}
            exercises={exercises}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
            loading={loading}
          />
        </Modal>
      )}
    </>
  )
}
