import { useState, useEffect } from 'react'
import { 
  FolderOpen, CheckSquare, Clock, AlertCircle, 
  TrendingUp, Calendar, ArrowRight, User, 
  CheckCircle2, ListTodo, Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie
} from 'recharts'

function Dashboard() {
  const { user, apiFetch } = useAuth()
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    assignedToMe: 0,
    completionPercentage: 0
  })
  const [chartData, setChartData] = useState({
    statusData: [],
    priorityData: []
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [statsRes, chartRes, activityRes] = await Promise.all([
          apiFetch('/api/dashboard/stats'),
          apiFetch('/api/dashboard/charts'),
          apiFetch('/api/dashboard/activity')
        ])

        if (statsRes.ok) {
          const statsResult = await statsRes.json()
          setStats(statsResult.data.stats)
        }

        if (chartRes.ok) {
          const chartResult = await chartRes.json()
          setChartData({
            statusData: chartResult.data.statusData,
            priorityData: chartResult.data.priorityData
          })
        }

        if (activityRes.ok) {
          const activityResult = await activityRes.json()
          setRecentActivity(activityResult.data.activities)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [apiFetch])

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderOpen, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Completed Tasks', value: stats.completedTasks, icon: CheckSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Pending Tasks', value: stats.pendingTasks, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Overdue Tasks', value: stats.overdueTasks, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ]

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6']

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-xl border-none shadow-xl text-xs font-medium">
          <p className="text-slate-800 dark:text-white mb-1">{payload[0].name}</p>
          <p className="text-indigo-500">{`${payload[0].value} Tasks`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-white mb-2">
            Welcome back, <span className="text-gradient">{user?.name}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="flex items-center gap-3 glass-card py-3 px-5 border-indigo-500/10">
          <div className="relative w-12 h-12 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle
                 cx="24"
                 cy="24"
                 r="20"
                 stroke="currentColor"
                 strokeWidth="4"
                 fill="transparent"
                 className="text-slate-200 dark:text-slate-700"
               />
               <circle
                 cx="24"
                 cy="24"
                 r="20"
                 stroke="currentColor"
                 strokeWidth="4"
                 fill="transparent"
                 strokeDasharray={125.6}
                 strokeDashoffset={125.6 - (125.6 * stats.completionPercentage) / 100}
                 className="text-indigo-500 transition-all duration-1000"
               />
             </svg>
             <span className="absolute text-[10px] font-bold text-slate-800 dark:text-white">
               {stats.completionPercentage}%
             </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Overall Progress</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Completion Rate</p>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label} 
              className="glass-card flex flex-col relative overflow-hidden group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-3xl transition-all duration-500 opacity-30 group-hover:opacity-50 ${stat.bg}`}></div>
              
              <div className="flex items-center gap-4 mb-4 z-10">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} />
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
              
              <div className="flex items-end justify-between z-10">
                <p className="text-4xl font-bold text-slate-800 dark:text-white">
                  {loading ? <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-10 w-16 rounded-lg inline-block"></span> : stat.value}
                </p>
                {stat.label === 'Overdue Tasks' && stat.value > 0 && (
                   <span className="badge badge-danger animate-bounce mb-1">Action Needed</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Status Chart */}
        <div className="lg:col-span-2 glass-card flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-indigo-500" size={20} />
              Task Distribution
            </h3>
            <Link to="/tasks" className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 group">
              View All Tasks <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                  {chartData.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Pie Chart */}
        <div className="glass-card flex flex-col h-[400px]">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <AlertCircle className="text-indigo-500" size={20} />
            Task Priorities
          </h3>
          <div className="flex-1 w-full h-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {chartData.priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend inside or near the pie */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalTasks}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Total</p>
               </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {chartData.priorityData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }}></div>
                <span className="text-xs font-medium text-slate-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Activity className="text-indigo-500" size={20} />
              Recent Activity
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">LIVE UPDATES</span>
          </div>
          
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-500 text-sm italic">No recent activity found.</p>
              </div>
            ) : (
              recentActivity.map((task, index) => (
                <div 
                  key={task.id} 
                  className="flex items-center gap-4 p-3 rounded-2xl bg-white/30 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/30 transition-all group"
                >
                  <div className={`p-2 rounded-xl flex-shrink-0 ${
                    task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    task.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-500' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {task.status === 'completed' ? <CheckCircle2 size={18} /> : <ListTodo size={18} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-indigo-400">{task.project?.title}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User size={10} /> {task.assignedUser?.name || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Updated</span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {new Date(task.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assigned to Me summary */}
        <div className="glass-card bg-gradient-to-br from-indigo-600 to-purple-700 border-none">
           <div className="relative h-full flex flex-col z-10 text-white">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Your Tasks</h3>
                <p className="text-indigo-100 text-sm">Focus on what matters today.</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center text-center py-6">
                 <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-4 shadow-xl backdrop-blur-md border border-white/30">
                    <CheckSquare size={40} />
                 </div>
                 <p className="text-5xl font-black mb-2">{stats.assignedToMe}</p>
                 <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs">Tasks Assigned to You</p>
              </div>
              
              <Link 
                to="/tasks" 
                className="mt-6 w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-center hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Start Working
              </Link>
           </div>
           
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4">
              <CheckCircle2 size={120} />
           </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard