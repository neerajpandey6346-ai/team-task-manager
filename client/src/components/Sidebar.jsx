import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Users,
  User,
  ChevronDown,
  Sparkles
} from 'lucide-react'
import { useState } from 'react'

function Sidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActive = (path) => location.pathname.startsWith(path)

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderOpen },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/profile', label: 'Profile', icon: User }
  ]

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} glass-panel border-r-0 border-y-0 rounded-none shadow-none z-20 transition-all duration-300 hidden sm:flex flex-col h-screen overflow-y-auto`}>
      <div className="p-4 flex items-center justify-between border-b border-white/10 dark:border-slate-700/50 mb-4 h-16">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">Taskify</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <ChevronDown size={20} className={`transition-transform text-slate-500 dark:text-slate-400 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`} />
        </button>
      </div>

      <nav className="px-3 space-y-1.5 flex-1">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            to={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${isActive(href)
                ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            title={isCollapsed ? label : ''}
          >
            <Icon size={20} className={isActive(href) ? 'text-indigo-500 dark:text-cyan-400' : ''} />
            {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar