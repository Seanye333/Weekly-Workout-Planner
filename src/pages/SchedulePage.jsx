import { useState } from 'react'
import { useSchedule } from '../hooks/useSchedule'
import { useTemplates } from '../hooks/useTemplates'
import { getWeekStart, getWeekDates, offsetWeek, formatShortDate } from '../utils/dateHelpers'
import { DAYS_OF_WEEK } from '../utils/constants'
import DayColumn from '../components/schedule/DayColumn'
import Spinner from '../components/common/Spinner'

export default function SchedulePage() {
  const [weekStart, setWeekStart] = useState(getWeekStart())
  const { schedule, loading, addWorkout, removeWorkout } = useSchedule(weekStart)
  const { templates } = useTemplates()

  const weekDates = getWeekDates(weekStart)
  const weekLabel = `${formatShortDate(weekDates[0])} – ${formatShortDate(weekDates[6])}`

  function goToToday() {
    setWeekStart(getWeekStart())
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Weekly Schedule</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekStart(offsetWeek(weekStart, -1))}
            className="btn-secondary px-3"
          >
            ‹ Prev
          </button>
          <button onClick={goToToday} className="btn-secondary px-3 text-sm">
            Today
          </button>
          <button
            onClick={() => setWeekStart(offsetWeek(weekStart, 1))}
            className="btn-secondary px-3"
          >
            Next ›
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4">{weekLabel}</p>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Desktop 7-column grid */}
          <div className="hidden lg:grid grid-cols-7 gap-3">
            {DAYS_OF_WEEK.map((dayKey, i) => (
              <DayColumn
                key={dayKey}
                dayKey={dayKey}
                date={weekDates[i]}
                workouts={schedule?.days?.[dayKey]?.workouts || []}
                templates={templates}
                onAdd={addWorkout}
                onRemove={(idx) => removeWorkout(dayKey, idx)}
              />
            ))}
          </div>

          {/* Mobile stacked */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DAYS_OF_WEEK.map((dayKey, i) => (
              <DayColumn
                key={dayKey}
                dayKey={dayKey}
                date={weekDates[i]}
                workouts={schedule?.days?.[dayKey]?.workouts || []}
                templates={templates}
                onAdd={addWorkout}
                onRemove={(idx) => removeWorkout(dayKey, idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
