import { createContext, useContext } from 'react'
import toast from 'react-hot-toast'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastContext')
  }
  return context
}

function ToastContextProvider({ children }) {
  const showSuccess = (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right'
    })
  }

  const showError = (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right'
    })
  }

  const showInfo = (message) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️'
    })
  }

  return (
    <ToastContext.Provider value={{
      showSuccess,
      showError,
      showInfo
    }}>
      {children}
    </ToastContext.Provider>
  )
}

export default ToastContextProvider