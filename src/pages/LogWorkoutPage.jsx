import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useWorkoutLog } from '../hooks/useWorkoutLog'
import { useSchedule } from '../hooks/useSchedule'
import { getWeekStart } from '../utils/dateHelpers'
import { formatDuration } from '../utils/dateHelpers'

export default function LogWorkoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { workout, dayKey, workoutIndex } = location.state || {}
  const { createLog } = useWorkoutLog()
  const { markComplete } = useSchedule(getWeekStart())

  const [elapsed, setElapsed] = useState(0)
  const [sets, setSets] = useState(() =>
    (workout?.exercises || []).map((ex) => ({
      ...ex,
      sets: Array.from({ length: ex.sets || 1 }, (_, i) => ({
        setNumber: i + 1,
        reps: ex.reps || 0,
        weight: ex.weight || 0,
        weightUnit: ex.weightUnit || 'kg',
        completed: false,
      })),
    }))
  )
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Timer
  useEffect(() => {
    const id = setInterval(() => setElapsed((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  if (!workout) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 mb-4">No workout data. Start a workout from the Schedule.</p>
        <button onClick={() => navigate('/schedule')} className="btn-primary">
          Go to Schedule
        </button>
      </div>
    )
  }

  function toggleSet(exIndex, setIndex) {
    setSets((prev) =>
      prev.map((ex, i) =>
        i !== exIndex
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s, j) =>
                j !== setIndex ? s : { ...s, completed: !s.completed }
              ),
            }
      )
    )
  }

  function updateSet(exIndex, setIndex, field, value) {
    setSets((prev) =>
      prev.map((ex, i) =>
        i !== exIndex
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s, j) =>
                j !== setIndex ? s : { ...s, [field]: Number(value) }
              ),
            }
      )
    )
  }

  async function handleFinish() {
    setSaving(true)
    const logData = {
      name: workout.name || workout.templateName || 'Workout',
      templateId: workout.templateId || null,
      templateName: workout.templateName || null,
      durationMinutes: Math.round(elapsed / 60),
      notes,
      date: new Date().toISOString(),
      exercises: sets.map((ex) => ({
        exerciseName: ex.exerciseName,
        muscleGroup: ex.muscleGroup || 'Other',
        sets: ex.sets,
      })),
    }
    await createLog(logData)
    if (dayKey !== undefined && workoutIndex !== undefined) {
      await markComplete(dayKey, workoutIndex, true)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => navigate('/history'), 1200)
  }

  const completedSets = sets.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0)
  const totalSets = sets.reduce((acc, ex) => acc + ex.sets.length, 0)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {workout.name || workout.templateName || 'Workout'}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {completedSets}/{totalSets} sets completed
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold text-indigo-400">{formatDuration(elapsed)}</p>
          <p className="text-xs text-gray-500">elapsed</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-800 rounded-full h-2 mb-6">
        <div
          className="bg-indigo-500 rounded-full h-2 transition-all"
          style={{ width: totalSets ? `${(completedSets / totalSets) * 100}%` : '0%' }}
        />
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {sets.map((ex, exIndex) => (
          <div key={exIndex} className="card">
            <h3 className="font-semibold text-white mb-1">{ex.exerciseName}</h3>
            <p className="text-xs text-gray-500 mb-3">{ex.muscleGroup}</p>

            {/* Set table */}
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2 text-xs text-gray-500 font-medium px-1">
                <span>Set</span>
                <span className="col-span-2">Reps</span>
                <span className="col-span-1">Weight</span>
                <span className="text-center">Done</span>
              </div>
              {ex.sets.map((s, setIndex) => (
                <div
                  key={setIndex}
                  className={`grid grid-cols-5 gap-2 items-center rounded-lg px-1 py-1 transition-colors ${
                    s.completed ? 'bg-green-950/50' : ''
                  }`}
                >
                  <span className="text-sm text-gray-400">{s.setNumber}</span>
                  <input
                    type="number"
                    min={0}
                    className="input py-1 text-sm col-span-2"
                    value={s.reps}
                    onChange={(e) => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                  />
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    className="input py-1 text-sm"
                    value={s.weight}
                    onChange={(e) => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                  />
                  <div className="flex justify-center">
                    <button
                      onClick={() => toggleSet(exIndex, setIndex)}
                      className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                        s.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-600 text-transparent hover:border-green-500'
                      }`}
                    >
                      ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="mt-4">
        <label className="label">Notes (optional)</label>
        <textarea
          className="input resize-none"
          rows={2}
          placeholder="How did it go?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Finish */}
      <div className="mt-6 flex gap-3">
        {saved ? (
          <div className="btn-primary flex-1 text-center bg-green-600 hover:bg-green-600">
            ✓ Saved! Redirecting...
          </div>
        ) : (
          <button
            onClick={handleFinish}
            className="btn-primary flex-1"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Finish Workout'}
          </button>
        )}
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  )
}
