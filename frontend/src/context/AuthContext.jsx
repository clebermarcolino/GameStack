import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem('gv_token'))
  const [user, setUser]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('gv_user')) } catch { return null }
  })

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(config => {
      const t = localStorage.getItem('gv_token')
      if (t) config.headers['Authorization'] = `Bearer ${t}`
      return config
    })
    return () => axios.interceptors.request.eject(interceptor)
  }, [])

  function saveSession(token, user) {
    localStorage.setItem('gv_token', token)
    localStorage.setItem('gv_user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  function logout() {
    localStorage.removeItem('gv_token')
    localStorage.removeItem('gv_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, saveSession, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
