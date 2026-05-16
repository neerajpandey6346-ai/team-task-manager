import { useState, useEffect } from 'react'
import { Users, Mail, Trash2, ShieldCheck, UserCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ConfirmDialog from '../components/ConfirmDialog'

const AVATAR_GRADIENTS = {
  blue:   'from-blue-500 to-indigo-600',
  purple: 'from-purple-500 to-pink-600',
  green:  'from-emerald-400 to-teal-600',
  orange: 'from-orange-400 to-rose-500',
  cyan:   'from-cyan-400 to-blue-500',
  rose:   'from-rose-400 to-red-600',
}

function TeamMembers() {
  const { user, apiFetch } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)
  const [toast, setToast] = useState({ msg: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ open: false, member: null })

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: '' }), 3000)
  }

  const fetchUsers = async () => {
    try {
      const response = await apiFetch('/api/users')
      if (response.ok) {
        const result = await response.json()
        setMembers(result.data.users || [])
      }
    } catch (err) {
      console.error('Failed to fetch users', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const askRemove = (member) => setConfirmDialog({ open: true, member })
  const closeConfirm = () => setConfirmDialog({ open: false, member: null })

  const handleRemove = async () => {
    const { member } = confirmDialog
    closeConfirm()
    if (!member) return
    setRemovingId(member.id)
    try {
      const response = await apiFetch(`/api/users/${member.id}`, { method: 'DELETE' })
      if (response.ok) {
        showToast(`${member.name} has been removed from the team.`, 'success')
        fetchUsers()
      } else {
        const err = await response.json()
        showToast(err.message || 'Failed to remove member.', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
    } finally {
      setRemovingId(null)
    }
  }

  const getGradient = (avatar) => AVATAR_GRADIENTS[avatar] || AVATAR_GRADIENTS.blue

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Team Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {members.length} {members.length === 1 ? 'member' : 'members'} in your workspace
          </p>
        </div>
      </div>

      {/* Stats bar */}
      {!loading && members.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card py-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {members.filter(m => m.role === 'admin').length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admins</p>
            </div>
          </div>
          <div className="glass-card py-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <UserCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {members.filter(m => m.role === 'member').length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Members</p>
            </div>
          </div>
        </div>
      )}

      {/* Members grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card h-28 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Users className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h2 className="text-xl font-medium text-slate-800 dark:text-white">No team members found</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="glass-card group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              {/* Glow accent */}
              <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${getGradient(member.avatar)}`} />

              <div className="flex items-center gap-4 relative z-10">
                {/* Avatar */}
                <div className={`w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${getGradient(member.avatar)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {member.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-800 dark:text-white truncate">{member.name}</h3>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      member.role === 'admin'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>
              </div>

              {/* Admin remove button — shown only to admin, hidden for self */}
              {user?.role === 'admin' && member.id !== user.id && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/50 flex justify-end">
                  <button
                    onClick={() => askRemove(member)}
                    disabled={removingId === member.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 hover:border-rose-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {removingId === member.id ? 'Removing...' : 'Remove Member'}
                  </button>
                </div>
              )}

              {/* "You" badge */}
              {member.id === user?.id && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/50 flex justify-end">
                  <span className="text-xs text-indigo-500 font-medium px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    You
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast.msg && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-medium animate-fade-in ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Confirm remove dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.open}
        title="Remove Team Member?"
        message={`Remove "${confirmDialog.member?.name}" from the team? Their account will be deactivated and they will no longer be able to log in.`}
        confirmText="Yes, Remove"
        variant="danger"
        onConfirm={handleRemove}
        onCancel={closeConfirm}
      />
    </div>
  )
}

export default TeamMembers