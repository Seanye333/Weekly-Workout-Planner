import { useState } from 'react'
import { useWorkoutLog } from '../hooks/useWorkoutLog'
import { MUSCLE_GROUP_COLORS } from '../utils/constants'
import { formatDate } from '../utils/dateHelpers'
import Spinner from '../components/common/Spinner'

export default function HistoryPage() {
  const { logs, loading, hasMore, fetchLogs } = useWorkoutLog()
  const [expanded, setExpanded] = useState({})

  function toggle(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading && logs.length === 0) return <Spinner />

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Workout History</h1>
        <span className="text-gray-400 text-sm">{logs.length} logged</span>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No workouts logged yet.</p>
          <p className="text-sm mt-1">Start a workout from the Schedule page.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const date = log.loggedAt?.toDate
              ? log.loggedAt.toDate()
              : new Date(log.loggedAt || log.date)
            const isOpen = expanded[log.id]

            return (
              <div key={log.id} className="card">
                {/* Summary row */}
                <button
                  onClick={() => toggle(log.id)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{log.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(date)}
                      {log.durationMinutes ? ` · ${log.durationMinutes} min` : ''}
                      {log.exercises?.length ? ` · ${log.exercises.length} exercises` : ''}
                    </p>
                  </div>
                  <span className="text-gray-500 text-lg shrink-0">{isOpen ? '▲' : '▼'}</span>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-gray-800 space-y-4">
                    {log.exercises?.map((ex, i) => (
                      <div key={i}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-white text-sm">{ex.exerciseName}</span>
                          <span className={`badge ${MUSCLE_GROUP_COLORS[ex.muscleGroup] || 'bg-gray-700 text-gray-300'}`}>
                            {ex.muscleGroup}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {ex.sets?.map((s, j) => (
                            <span
                              key={j}
                              className={`text-xs px-2 py-1 rounded-md ${
                                s.completed
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-gray-800 text-gray-400'
                              }`}
                            >
                              {s.reps}r × {s.weight}{s.weightUnit}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {log.notes && (
                      <p className="text-sm text-gray-400 italic border-t border-gray-800 pt-2">
                        "{log.notes}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => fetchLogs(false)}
            className="btn-secondary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
