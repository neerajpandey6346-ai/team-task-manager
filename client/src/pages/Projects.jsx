import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Folder, Calendar, Users, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Projects() {
  const { user, apiFetch } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ title: '', description: '' })

  const fetchProjects = async () => {
    try {
      const response = await apiFetch('/api/projects')
      if (response.ok) {
        const result = await response.json()
        setProjects(result.data.projects || [])
      }
    } catch (error) {
      console.error('Failed to fetch projects', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await apiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        setShowModal(false)
        setFormData({ title: '', description: '' })
        fetchProjects()
      } else {
        const err = await response.json()
        setError(err.message || 'Failed to create project')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Projects</h1>
        {user?.role === 'admin' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus className="w-5 h-5 mr-1" /> New Project
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-48 animate-pulse bg-slate-100 dark:bg-slate-800/50"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Folder className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h2 className="text-xl font-medium text-slate-800 dark:text-white mb-2">No projects yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Get started by creating your first project.</p>
          {user?.role === 'admin' && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary inline-flex">
              <Plus className="w-5 h-5 mr-1" /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link 
              key={project.id} 
              to={`/projects/${project.id}`}
              className="glass-card group hover:scale-[1.02] transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Folder className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-1">{project.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">{project.description}</p>
              
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700/50 pt-4 mt-auto">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{project.members?.length || 0} Members</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md animate-slide-up">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Create New Project</h2>
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm">{error}</div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="E.g., Website Redesign"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="What is this project about?"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <button type="button" onClick={() => { setShowModal(false); setError('') }} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects