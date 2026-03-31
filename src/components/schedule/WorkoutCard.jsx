import { useNavigate } from 'react-router-dom'

export default function WorkoutCard({ workout, dayKey, workoutIndex, onRemove }) {
  const navigate = useNavigate()

  function startWorkout() {
    navigate('/log', { state: { workout, dayKey, workoutIndex } })
  }

  return (
    <div
      className={`rounded-lg border px-3 py-2 text-sm flex flex-col gap-1.5 ${
        workout.isCompleted
          ? 'bg-green-950 border-green-800'
          : 'bg-gray-800 border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`font-medium truncate ${workout.isCompleted ? 'text-green-300 line-through' : 'text-white'}`}>
          {workout.name || workout.templateName || 'Workout'}
        </span>
        <button
          onClick={() => onRemove(workoutIndex)}
          className="text-gray-500 hover:text-red-400 transition-colors shrink-0 text-xs"
        >
          ✕
        </button>
      </div>

      {workout.exercises?.length > 0 && (
        <p className="text-xs text-gray-400">
          {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
        </p>
      )}

      {!workout.isCompleted && (
        <button
          onClick={startWorkout}
          className="mt-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded transition-colors text-center"
        >
          Start →
        </button>
      )}

      {workout.isCompleted && (
        <span className="text-xs text-green-400">✓ Completed</span>
      )}
    </div>
  )
}
