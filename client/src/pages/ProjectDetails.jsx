import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Folder, Users, CheckSquare, Trash2, Calendar, ArrowLeft, UserPlus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ConfirmDialog from '../components/ConfirmDialog'

function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, apiFetch } = useAuth()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddMember, setShowAddMember] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [addingMember, setAddingMember] = useState(false)
  const [memberError, setMemberError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', payload: null })

  const fetchProject = async () => {
    try {
      const response = await apiFetch(`/api/projects/${id}`)
      if (response.ok) {
        const result = await response.json()
        setProject(result.data.project)
      } else if (response.status === 404) {
        navigate('/projects')
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const response = await apiFetch('/api/users')
      if (response.ok) {
        const result = await response.json()
        setAllUsers(result.data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  useEffect(() => {
    fetchProject()
  }, [id])

  useEffect(() => {
    if (showAddMember) fetchAllUsers()
  }, [showAddMember])

  const confirmDelete = () => setConfirmDialog({ open: true, type: 'delete', payload: null })
  const confirmRemoveMember = (userId, memberName) => setConfirmDialog({ open: true, type: 'removeMember', payload: { userId, memberName } })
  const closeConfirm = () => setConfirmDialog({ open: false, type: '', payload: null })

  const handleDelete = async () => {
    closeConfirm()
    setDeleteError('')
    try {
      const response = await apiFetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (response.ok) {
        navigate('/projects')
      } else {
        const err = await response.json()
        setDeleteError(err.message || 'Failed to delete project')
      }
    } catch (error) {
      setDeleteError('Network error. Please try again.')
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!selectedUserId) return
    setAddingMember(true)
    setMemberError('')
    try {
      const response = await apiFetch(`/api/projects/${id}/members`, {
        method: 'POST',
        body: JSON.stringify({ userId: selectedUserId })
      })
      if (response.ok) {
        setShowAddMember(false)
        setSelectedUserId('')
        fetchProject()
      } else {
        const err = await response.json()
        setMemberError(err.message || 'Failed to add member')
      }
    } catch (error) {
      setMemberError('Network error. Please try again.')
    } finally {
      setAddingMember(false)
    }
  }

  const handleRemoveMember = async () => {
    const { userId } = confirmDialog.payload || {}
    closeConfirm()
    if (!userId) return
    try {
      const response = await apiFetch(`/api/projects/${id}/members/${userId}`, { method: 'DELETE' })
      if (response.ok) fetchProject()
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  // Users not yet in the project
  const availableUsers = allUsers.filter(
    u => !project?.members?.some(m => m.id === u.id)
  )

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse w-64"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>
    )
  }

  if (!project) return null

  const AVATAR_COLORS = {
    blue:   'from-blue-500 to-indigo-600',
    purple: 'from-purple-500 to-pink-600',
    green:  'from-emerald-400 to-teal-600',
    orange: 'from-orange-400 to-rose-500',
    cyan:   'from-cyan-400 to-blue-500',
    rose:   'from-rose-400 to-red-600',
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/projects" className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">{project.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
              project.status === 'archived' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
              'bg-amber-500/10 text-amber-500 border-amber-500/20'
            }`}>
              {project.status?.toUpperCase() || 'ACTIVE'}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{project.description}</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={confirmDelete} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all duration-200 text-sm font-medium border border-rose-500/20">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        )}
      </div>

      {deleteError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm">{deleteError}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-500" /> Tasks
            </h2>
            <Link to="/tasks" className="text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors">View All →</Link>
          </div>
          <div className="glass-card space-y-3">
            {!project.tasks?.length ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-10">No tasks in this project yet.</p>
            ) : (
              project.tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">{task.title}</h4>
                    {task.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    task.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                    task.status === 'review' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent'
                  }`}>
                    {task.status?.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" /> Team
            </h2>
            {user?.role === 'admin' && (
              <button onClick={() => { setShowAddMember(true); setMemberError('') }}
                className="flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                <UserPlus className="w-4 h-4" /> Add Member
              </button>
            )}
          </div>

          <div className="glass-card space-y-3">
            {!project.members?.length ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">No members yet.</p>
            ) : (
              project.members.map(member => (
                <div key={member.id} className="flex items-center gap-3 group">
                  <div className={`w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br ${AVATAR_COLORS[member.avatar] || AVATAR_COLORS.blue} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-white text-sm truncate">{member.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member.email}</p>
                  </div>
                  {user?.role === 'admin' && member.id !== user.id && (
                    <button onClick={() => confirmRemoveMember(member.id, member.name)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Project Info */}
          <div className="glass-card space-y-3">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Project Info</h3>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Created</span>
              <span className="font-medium text-slate-800 dark:text-white">{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Folder className="w-4 h-4" /> Tasks</span>
              <span className="font-medium text-slate-800 dark:text-white">{project.tasks?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Users className="w-4 h-4" /> Members</span>
              <span className="font-medium text-slate-800 dark:text-white">{project.members?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-sm animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add Team Member</h2>
              <button onClick={() => setShowAddMember(false)} className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {memberError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm">{memberError}</div>
            )}

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select User</label>
                {availableUsers.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 p-3 glass-card text-center">All users are already members!</p>
                ) : (
                  <select
                    required
                    value={selectedUserId}
                    onChange={e => setSelectedUserId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">-- Choose a member --</option>
                    {availableUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddMember(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={addingMember || !selectedUserId || availableUsers.length === 0}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  {addingMember ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={confirmDialog.open && confirmDialog.type === 'delete'}
        title="Delete Project?"
        message={`Are you sure you want to delete "${project?.title}"? All tasks will also be permanently deleted.`}
        confirmText="Yes, Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={closeConfirm}
      />
      <ConfirmDialog
        isOpen={confirmDialog.open && confirmDialog.type === 'removeMember'}
        title="Remove Member?"
        message={`Remove "${confirmDialog.payload?.memberName}" from this project? They will lose access to all project tasks.`}
        confirmText="Remove"
        variant="danger"
        onConfirm={handleRemoveMember}
        onCancel={closeConfirm}
      />
    </div>
  )
}

export default ProjectDetails