import { useState } from 'react'
import { User, Lock, Camera, CheckCircle, AlertCircle, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const AVATARS = [
  { id: 'blue',   bg: 'from-blue-500 to-indigo-600',    label: 'Blue' },
  { id: 'purple', bg: 'from-purple-500 to-pink-600',    label: 'Purple' },
  { id: 'green',  bg: 'from-emerald-400 to-teal-600',   label: 'Green' },
  { id: 'orange', bg: 'from-orange-400 to-rose-500',    label: 'Orange' },
  { id: 'cyan',   bg: 'from-cyan-400 to-blue-500',      label: 'Cyan' },
  { id: 'rose',   bg: 'from-rose-400 to-red-600',       label: 'Rose' },
]

function Toast({ message, type }) {
  if (!message) return null
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-medium animate-fade-in ${
      type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
    }`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      {message}
    </div>
  )
}

function Profile() {
  const { user, apiFetch, updateUser } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || 'blue')
  const [profileLoading, setProfileLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [toast, setToast] = useState({ message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500)
  }

  const selectedAvatar = AVATARS.find(a => a.id === avatar) || AVATARS[0]

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      const response = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, avatar })
      })
      const data = await response.json()
      if (response.ok) {
        updateUser(data.data.user)
        showToast('Profile updated successfully!', 'success')
      } else {
        showToast(data.message || 'Failed to update profile', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error')
      return
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error')
      return
    }
    setPasswordLoading(true)
    try {
      const response = await apiFetch('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      })
      const data = await response.json()
      if (response.ok) {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        showToast('Password changed successfully!', 'success')
      } else {
        showToast(data.message || 'Failed to change password', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal details and security settings.</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedAvatar.bg} flex items-center justify-center text-white font-bold text-3xl shadow-lg`}>
            {(name || user?.name || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{user?.name}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
            <span className={`mt-1.5 inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              user?.role === 'admin'
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            }`}>{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <span className="flex items-center gap-2"><Camera className="w-4 h-4" /> Avatar Color</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {AVATARS.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAvatar(a.id)}
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${a.bg} transition-all duration-200 shadow-md ${
                    avatar === a.id ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  title={a.label}
                >
                  {avatar === a.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Your avatar initial will be shown in your selected color.</p>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700/50">
            <button type="submit" disabled={profileLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-lg shadow-indigo-500/20">
              <Save className="w-4 h-4" />
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="glass-card space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700/50">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Change Password</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Keep your account secure with a strong password.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                  confirmPassword && confirmPassword !== newPassword
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
                placeholder="Re-enter new password"
              />
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-rose-500 mt-1">Passwords don't match</p>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700/50">
            <button type="submit" disabled={passwordLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60 shadow-lg shadow-amber-500/20">
              <Lock className="w-4 h-4" />
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}

export default Profile