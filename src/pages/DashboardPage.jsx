import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSchedule } from '../hooks/useSchedule'
import { useWorkoutLog } from '../hooks/useWorkoutLog'
import { getWeekStart, getDayKey, formatFullDate, formatDate } from '../utils/dateHelpers'
import Spinner from '../components/common/Spinner'

const quickLinks = [
  { to: '/schedule', icon: '📅', label: 'Schedule', desc: 'Plan your week' },
  { to: '/exercises', icon: '💪', label: 'Exercises', desc: 'Manage library' },
  { to: '/templates', icon: '📋', label: 'Templates', desc: 'Build routines' },
  { to: '/progress', icon: '📈', label: 'Progress', desc: 'View analytics' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const weekStart = getWeekStart()
  const { schedule, loading: schedLoading } = useSchedule(weekStart)
  const { logs, loading: logsLoading } = useWorkoutLog()

  const today = new Date()
  const todayKey = getDayKey(today)
  const todayWorkouts = schedule?.days?.[todayKey]?.workouts || []
  const recentLogs = logs.slice(0, 3)

  const greeting = getGreeting()

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          {greeting}, {user?.displayName?.split(' ')[0] || 'Athlete'} 👋
        </h1>
        <p className="text-gray-400 mt-1">{formatFullDate(today)}</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="card hover:border-indigo-600 transition-colors text-center flex flex-col items-center gap-2"
          >
            <span className="text-3xl">{l.icon}</span>
            <span className="font-semibold text-white text-sm">{l.label}</span>
            <span className="text-xs text-gray-500">{l.desc}</span>
          </Link>
        ))}
      </div>

      {/* Today's workouts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Today's Workouts</h2>
          <Link to="/schedule" className="text-sm text-indigo-400 hover:text-indigo-300">
            View schedule →
          </Link>
        </div>
        {schedLoading ? (
          <Spinner size="sm" />
        ) : todayWorkouts.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            <p>No workouts planned for today.</p>
            <Link to="/schedule" className="text-indigo-400 hover:text-indigo-300 text-sm mt-1 inline-block">
              Add one to your schedule →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {todayWorkouts.map((w, i) => (
              <div key={i} className={`card flex items-center justify-between ${w.isCompleted ? 'opacity-60' : ''}`}>
                <div>
                  <p className={`font-medium ${w.isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                    {w.name || w.templateName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {w.exercises?.length || 0} exercises
                  </p>
                </div>
                {w.isCompleted ? (
                  <span className="text-green-400 text-sm">✓ Done</span>
                ) : (
                  <Link
                    to="/log"
                    state={{ workout: w, dayKey: todayKey, workoutIndex: i }}
                    className="btn-primary text-sm py-1.5"
                  >
                    Start
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent logs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Recent Workouts</h2>
          <Link to="/history" className="text-sm text-indigo-400 hover:text-indigo-300">
            View all →
          </Link>
        </div>
        {logsLoading ? (
          <Spinner size="sm" />
        ) : recentLogs.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            <p>No workouts logged yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentLogs.map((log) => {
              const date = log.loggedAt?.toDate ? log.loggedAt.toDate() : new Date(log.date)
              return (
                <div key={log.id} className="card flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{log.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(date)}
                      {log.durationMinutes ? ` · ${log.durationMinutes} min` : ''}
                    </p>
                  </div>
                  <span className="text-green-400 text-sm">✓</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
