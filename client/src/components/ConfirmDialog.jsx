import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

/**
 * Reusable in-app confirmation dialog.
 *
 * Props:
 *  isOpen      — boolean to show/hide
 *  title       — dialog heading
 *  message     — body text
 *  confirmText — label for the confirm button (default "Confirm")
 *  cancelText  — label for the cancel button  (default "Cancel")
 *  variant     — "danger" | "warning" | "info"  (default "danger")
 *  onConfirm   — called when user clicks confirm
 *  onCancel    — called when user clicks cancel or backdrop
 */
function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onCancel?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const colors = {
    danger:  { icon: 'text-rose-500',   iconBg: 'bg-rose-500/10',   btn: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30' },
    warning: { icon: 'text-amber-500',  iconBg: 'bg-amber-500/10',  btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/30' },
    info:    { icon: 'text-indigo-500', iconBg: 'bg-indigo-500/10', btn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30' },
  }
  const c = colors[variant] || colors.danger

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel?.() }}
    >
      <div className="glass-card w-full max-w-sm animate-slide-up">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl ${c.iconBg} flex items-center justify-center mx-auto mb-5`}>
          <AlertTriangle className={`w-7 h-7 ${c.icon}`} />
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-2">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center leading-relaxed mb-7">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg transition-all duration-200 ${c.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
