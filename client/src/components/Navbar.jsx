import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User, Bell, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function Navbar() {
  const { user, logout } = useAuth()
  const { showSuccess } = useToast()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await logout()
    showSuccess('Logged out successfully')
    navigate('/login')
  }

  const AVATAR_COLORS = {
    blue:   'from-blue-500 to-indigo-600',
    purple: 'from-purple-500 to-pink-600',
    green:  'from-emerald-400 to-teal-600',
    orange: 'from-orange-400 to-rose-500',
    cyan:   'from-cyan-400 to-blue-500',
    rose:   'from-rose-400 to-red-600',
  }

  const avatarGradient = AVATAR_COLORS[user?.avatar] || AVATAR_COLORS.blue

  return (
    <nav className="glass-nav sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center sm:hidden gap-2">
             <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="hidden sm:block">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl transition-all">
              <Bell size={20} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`w-9 h-9 bg-gradient-to-br ${avatarGradient} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md hover:shadow-indigo-500/30 transition-all hover:scale-105`}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-3 w-48 glass-panel rounded-xl py-2 z-50 animate-fade-in border border-white/20 dark:border-slate-700">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <User size={16} className="text-indigo-500 dark:text-cyan-400" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar