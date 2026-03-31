import { useState, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useWorkoutLog } from '../hooks/useWorkoutLog'
import {
  getWeeklyFrequency,
  getVolumeOverTime,
  getMuscleDistribution,
  getDurationTrend,
  getExerciseProgress,
  getSummaryStats,
} from '../utils/analyticsHelpers'
import Spinner from '../components/common/Spinner'

const PIE_COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6']

function StatCard({ label, value, sub }) {
  return (
    <div className="card text-center">
      <p className="text-3xl font-bold text-indigo-400">{value}</p>
      <p className="text-sm font-medium text-white mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function ProgressPage() {
  const { fetchAllLogs } = useWorkoutLog()
  const [allLogs, setAllLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [exerciseName, setExerciseName] = useState('')

  useEffect(() => {
    fetchAllLogs().then((l) => { setAllLogs(l); setLoading(false) })
  }, [])

  if (loading) return <Spinner />

  if (allLogs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        <p className="text-lg">No workout data yet.</p>
        <p className="text-sm mt-1">Log some workouts to see your progress charts.</p>
      </div>
    )
  }

  const stats = getSummaryStats(allLogs)
  const freqData = getWeeklyFrequency(allLogs)
  const volData = getVolumeOverTime(allLogs)
  const muscleData = getMuscleDistribution(allLogs)
  const durationData = getDurationTrend(allLogs)
  const progressData = exerciseName ? getExerciseProgress(allLogs, exerciseName) : []

  // Unique exercise names for the picker
  const exerciseNames = [...new Set(allLogs.flatMap((l) => l.exercises?.map((e) => e.exerciseName) || []))]

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">Progress</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Workouts" value={stats.totalWorkouts} />
        <StatCard label="Total Volume" value={`${stats.totalVolume.toLocaleString()}`} sub="kg×reps" />
        <StatCard label="Top Muscle" value={stats.topMuscle} />
        <StatCard label="Current Streak" value={`${stats.streak}d`} sub="days in a row" />
      </div>

      {/* Weekly frequency */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">Workouts per Week</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={freqData}>
            <XAxis dataKey="week" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, color: '#fff' }} />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Volume over time */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">Weekly Volume (kg × reps)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={volData}>
            <XAxis dataKey="week" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, color: '#fff' }} />
            <Line type="monotone" dataKey="volume" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Muscle distribution + duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">Muscle Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={muscleData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name }) => name}>
                {muscleData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">Avg. Workout Duration (min)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={durationData}>
              <XAxis dataKey="week" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, color: '#fff' }} />
              <Line type="monotone" dataKey="duration" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exercise progress */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">Exercise Progress</h2>
        <select
          className="input max-w-xs mb-4"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        >
          <option value="">Select an exercise...</option>
          {exerciseNames.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        {progressData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressData}>
              <XAxis dataKey="week" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, color: '#fff' }} />
              <Line type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }} name="Best Weight (kg)" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          exerciseName && <p className="text-gray-500 text-sm">Not enough data for this exercise.</p>
        )}
      </div>
    </div>
  )
}
