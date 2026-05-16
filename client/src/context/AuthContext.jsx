import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthContext')
  }
  return context
}

function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (token && userData) {
          setUser(JSON.parse(userData))
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  // Central fetch helper that always attaches the Bearer token
  const apiFetch = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem('token')
    const hasBody = options.body !== undefined
    const headers = {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
    return fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    })
  }, [])

  const handleResponse = async (response) => {
    let data = null;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      console.error('Failed to parse response as JSON', e);
    }
    
    if (!response.ok) {
      throw new Error(data?.message || `Server error (${response.status}): The backend might be offline.`);
    }
    return data;
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      })

      const data = await handleResponse(response)

      if (data && data.data && data.data.token && data.data.user) {
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        setUser(data.data.user)
        setIsAuthenticated(true)
        return data.data
      } else {
        throw new Error('Invalid response format from server')
      }
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const data = await handleResponse(response)

      if (data && data.data && data.data.token && data.data.user) {
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        setUser(data.data.user)
        setIsAuthenticated(true)
        return data.data
      } else {
        throw new Error('Invalid response format from server')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      signup,
      login,
      logout,
      setUser,
      updateUser,
      apiFetch
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider