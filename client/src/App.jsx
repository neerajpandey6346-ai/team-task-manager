import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AuthContext from './context/AuthContext'
import ToastContext from './context/ToastContext'
import Spinner from './components/Spinner'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Tasks from './pages/Tasks'
import TeamMembers from './pages/TeamMembers'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// Layout
import Layout from './components/Layout'

// Import context hook
import { useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} 
      />

      {/* Protected Routes */}
      <Route element={<Layout />}>
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/projects" 
          element={<ProtectedRoute><Projects /></ProtectedRoute>} 
        />
        <Route 
          path="/projects/:id" 
          element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} 
        />
        <Route 
          path="/tasks" 
          element={<ProtectedRoute><Tasks /></ProtectedRoute>} 
        />
        <Route 
          path="/team" 
          element={<ProtectedRoute><TeamMembers /></ProtectedRoute>} 
        />
        <Route 
          path="/profile" 
          element={<ProtectedRoute><Profile /></ProtectedRoute>} 
        />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthContext>
        <ToastContext>
          <AppRoutes />
          <Toaster position="top-right" />
        </ToastContext>
      </AuthContext>
    </BrowserRouter>
  )
}

export default App