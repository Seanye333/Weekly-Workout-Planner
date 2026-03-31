import { useState } from 'react'
import { useTemplates } from '../hooks/useTemplates'
import { useExercises } from '../hooks/useExercises'
import TemplateCard from '../components/templates/TemplateCard'
import TemplateForm from '../components/templates/TemplateForm'
import Modal from '../components/common/Modal'
import Spinner from '../components/common/Spinner'

export default function TemplatesPage() {
  const { templates, loading, addTemplate, updateTemplate, deleteTemplate } = useTemplates()
  const { exercises } = useExercises()
  const [showAdd, setShowAdd] = useState(false)
  const [addLoading, setAddLoading] = useState(false)

  async function handleAdd(data) {
    setAddLoading(true)
    await addTemplate(data)
    setAddLoading(false)
    setShowAdd(false)
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this template?')) {
      await deleteTemplate(id)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Workout Templates</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {templates.length} template{templates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          + New Template
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : templates.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No templates yet.</p>
          <p className="text-sm">Create a template from your exercise library to quickly add workouts to your schedule.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              exercises={exercises}
              onUpdate={updateTemplate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="New Template" onClose={() => setShowAdd(false)} wide>
          <TemplateForm
            exercises={exercises}
            onSubmit={handleAdd}
            onCancel={() => setShowAdd(false)}
            loading={addLoading}
          />
        </Modal>
      )}
    </div>
  )
}
