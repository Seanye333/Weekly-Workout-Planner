import { useState } from 'react'
import { DAY_FULL_LABELS } from '../../utils/constants'
import { isSameDay, formatShortDate } from '../../utils/dateHelpers'
import WorkoutCard from './WorkoutCard'
import AddWorkoutModal from './AddWorkoutModal'

export default function DayColumn({ dayKey, date, workouts = [], templates, onAdd, onRemove }) {
  const [showAdd, setShowAdd] = useState(false)
  const isToday = isSameDay(date, new Date())

  return (
    <>
      <div className={`flex flex-col min-h-48 rounded-xl border p-3 gap-2 ${
        isToday ? 'border-indigo-500 bg-indigo-950/20' : 'border-gray-800 bg-gray-900'
      }`}>
        {/* Header */}
        <div className="text-center pb-1 border-b border-gray-800">
          <p className={`text-xs font-semibold uppercase tracking-wider ${isToday ? 'text-indigo-400' : 'text-gray-400'}`}>
            {DAY_FULL_LABELS[dayKey]}
          </p>
          <p className={`text-lg font-bold ${isToday ? 'text-indigo-300' : 'text-gray-200'}`}>
            {formatShortDate(date)}
          </p>
          {isToday && <span className="text-xs text-indigo-400 font-medium">Today</span>}
        </div>

        {/* Workouts */}
        <div className="flex flex-col gap-2 flex-1">
          {workouts.map((w, i) => (
            <WorkoutCard
              key={i}
              workout={w}
              dayKey={dayKey}
              workoutIndex={i}
              onRemove={onRemove}
            />
          ))}
        </div>

        {/* Add button */}
        <button
          onClick={() => setShowAdd(true)}
          className="w-full border border-dashed border-gray-700 hover:border-indigo-500 text-gray-500 hover:text-indigo-400 rounded-lg py-2 text-xs transition-colors"
        >
          + Add
        </button>
      </div>

      {showAdd && (
        <AddWorkoutModal
          templates={templates}
          dayLabel={DAY_FULL_LABELS[dayKey]}
          onAdd={(entry) => onAdd(dayKey, entry)}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  )
}
