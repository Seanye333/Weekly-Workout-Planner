import { useState } from 'react'
import Modal from '../common/Modal'

export default function AddWorkoutModal({ templates, dayLabel, onAdd, onClose }) {
  const [tab, setTab] = useState('template')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [customName, setCustomName] = useState('')

  function handleAdd() {
    if (tab === 'template' && selectedTemplate) {
      onAdd({
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        name: selectedTemplate.name,
        exercises: selectedTemplate.exercises || [],
        isCompleted: false,
        scheduledAt: new Date().toISOString(),
      })
    } else if (tab === 'custom' && customName.trim()) {
      onAdd({
        templateId: null,
        templateName: null,
        name: customName.trim(),
        exercises: [],
        isCompleted: false,
        scheduledAt: new Date().toISOString(),
      })
    }
    onClose()
  }

  const canAdd = tab === 'template' ? !!selectedTemplate : !!customName.trim()

  return (
    <Modal title={`Add Workout — ${dayLabel}`} onClose={onClose}>
      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-4 -mx-6 px-6">
        {['template', 'custom'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              tab === t
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {t === 'template' ? 'From Template' : 'Custom Name'}
          </button>
        ))}
      </div>

      {tab === 'template' && (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {templates.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">
              No templates yet. Create one in the Templates page.
            </p>
          )}
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t)}
              className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                selectedTemplate?.id === t.id
                  ? 'border-indigo-500 bg-indigo-950'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
            >
              <p className="font-medium text-white">{t.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t.exercises?.length || 0} exercises
                {t.description ? ` · ${t.description}` : ''}
              </p>
            </button>
          ))}
        </div>
      )}

      {tab === 'custom' && (
        <div>
          <label className="label">Workout Name</label>
          <input
            className="input"
            placeholder="e.g. Morning Run"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            autoFocus
          />
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button onClick={handleAdd} className="btn-primary flex-1" disabled={!canAdd}>
          Add to Schedule
        </button>
        <button onClick={onClose} className="btn-secondary">Cancel</button>
      </div>
    </Modal>
  )
}
