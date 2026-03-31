import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Navbar from './components/layout/Navbar'

import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import SchedulePage from './pages/SchedulePage'
import ExercisesPage from './pages/ExercisesPage'
import TemplatesPage from './pages/TemplatesPage'
import LogWorkoutPage from './pages/LogWorkoutPage'
import HistoryPage from './pages/HistoryPage'
import ProgressPage from './pages/ProgressPage'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/log" element={<LogWorkoutPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/progress" element={<ProgressPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
