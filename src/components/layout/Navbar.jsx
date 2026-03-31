import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/schedule', label: 'Schedule', icon: '📅' },
  { to: '/exercises', label: 'Exercises', icon: '💪' },
  { to: '/templates', label: 'Templates', icon: '📋' },
  { to: '/history', label: 'History', icon: '📝' },
  { to: '/progress', label: 'Progress', icon: '📈' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/auth')
  }

  return (
    <nav className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <NavLink to="/" className="text-indigo-400 font-bold text-lg tracking-tight">
          WorkoutPlanner
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-gray-400">{user?.displayName || user?.email}</span>
          <button onClick={handleLogout} className="btn-secondary text-sm py-1.5">
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900 px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <span>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
          <div className="border-t border-gray-800 mt-2 pt-2 flex items-center justify-between">
            <span className="text-sm text-gray-400">{user?.displayName}</span>
            <button onClick={handleLogout} className="btn-secondary text-sm py-1.5">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
