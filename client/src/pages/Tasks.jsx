import { useState, useEffect } from 'react'
import { Plus, CheckSquare, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ConfirmDialog from '../components/ConfirmDialog'

function Tasks() {
  const { user, apiFetch } = useAuth()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', projectId: '', priority: 'medium' })
  const [createError, setCreateError] = useState('')
  const [confirmDialog, setConfirmDialog] = useState({ open: false, task: null })

  const fetchTasks = async () => {
    try {
      const response = await apiFetch('/api/tasks')
      if (response.ok) {
        const result = await response.json()
        setTasks(result.data.tasks || [])
      }
    } catch (error) {
      console.error('Failed to fetch tasks', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await apiFetch('/api/projects')
      if (response.ok) {
        const result = await response.json()
        setProjects(result.data.projects || [])
        if (result.data.projects.length > 0) {
          setFormData(prev => ({ ...prev, projectId: result.data.projects[0].id }))
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects', error)
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchProjects()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateError('')
    try {
      const response = await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        setShowModal(false)
        setFormData({ title: '', description: '', projectId: projects[0]?.id || '', priority: 'medium' })
        fetchTasks()
      } else {
        const err = await response.json()
        setCreateError(err.message || 'Failed to create task')
      }
    } catch (error) {
      setCreateError('Network error. Please try again.')
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const response = await apiFetch(`/api/tasks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
      if (response.ok) fetchTasks()
    } catch (error) {
      console.error('Failed to update status', error)
    }
  }

  const confirmDelete = (task) => setConfirmDialog({ open: true, task })
  const closeConfirm = () => setConfirmDialog({ open: false, task: null })

  const handleDelete = async () => {
    const { task } = confirmDialog
    closeConfirm()
    if (!task) return
    try {
      const response = await apiFetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
      if (response.ok) fetchTasks()
    } catch (error) {
      console.error('Failed to delete task', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':  return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'in_progress': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
      case 'review':     return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      default:           return 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':   return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      default:       return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Tasks</h1>
          {!loading && (
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
            </p>
          )}
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => { setShowModal(true); setCreateError('') }} className="btn btn-primary">
            <Plus className="w-5 h-5 mr-1" /> New Task
          </button>
        )}
      </div>

      {/* Task list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-20 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-card text-center py-16">
          <CheckSquare className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h2 className="text-xl font-medium text-slate-800 dark:text-white mb-2">No tasks yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Create tasks to start tracking progress.</p>
          {user?.role === 'admin' && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary inline-flex">
              <Plus className="w-5 h-5 mr-1" /> Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="glass-card flex items-center justify-between group hover:scale-[1.005] transition-all duration-300 p-4 gap-4"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              {/* Left: icon + info */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 flex-shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{task.title}</h3>
                  <div className="flex items-center flex-wrap gap-2 mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {task.project?.title || 'Unknown project'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: status + delete */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <select
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border outline-none appearance-none cursor-pointer transition-colors ${getStatusColor(task.status)}`}
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>

                {user?.role === 'admin' && (
                  <button
                    onClick={() => confirmDelete(task)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md animate-slide-up">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Create New Task</h2>

            {createError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm">{createError}</div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="E.g., Design landing page"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project</label>
                <select
                  required
                  value={formData.projectId}
                  onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {projects.length === 0
                    ? <option value="">No projects yet — create one first</option>
                    : projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setCreateError('') }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!formData.projectId || projects.length === 0}
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.open}
        title="Delete Task?"
        message={`Are you sure you want to delete "${confirmDialog.task?.title}"? This cannot be undone.`}
        confirmText="Yes, Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={closeConfirm}
      />
    </div>
  )
}

export default Tasks