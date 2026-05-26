import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { loginApi, registerApi, type AuthResponse } from '../api/auth'

interface User {
  id: string
  name: string
  email: string
  role: 'client' | 'agent'
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: 'client' | 'agent') => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function parseToken(token: string): { id: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (!payload.exp) return false
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

function loadUserFromStorage(): { user: User; token: string } | null {
  const token = localStorage.getItem('token')
  const name = localStorage.getItem('name')
  const role = localStorage.getItem('role') as 'client' | 'agent' | null
  const userId = localStorage.getItem('userId')
  const email = localStorage.getItem('email')

  if (!token || !name || !role || !userId) return null
  if (isTokenExpired(token)) {
    localStorage.clear()
    return null
  }

  return {
    user: { id: userId, name, email: email || '', role },
    token,
  }
}

function saveToStorage(token: string, user: Omit<User, 'id'>, userId: string) {
  localStorage.setItem('token', token)
  localStorage.setItem('name', user.name)
  localStorage.setItem('role', user.role)
  localStorage.setItem('email', user.email)
  localStorage.setItem('userId', userId)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = loadUserFromStorage()
    if (stored) {
      setUser(stored.user)
      setToken(stored.token)
    }
    setIsLoading(false)
  }, [])

  const handleAuthResponse = useCallback((res: { data: AuthResponse }) => {
    const payload = parseToken(res.data.token)
    if (!payload) throw new Error('Invalid token')

    const newUser: User = {
      id: payload.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.user.role,
    }

    saveToStorage(res.data.token, res.data.user, payload.id)
    setUser(newUser)
    setToken(res.data.token)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginApi(email, password)
    handleAuthResponse(res)
  }, [handleAuthResponse])

  const register = useCallback(async (name: string, email: string, password: string, role: 'client' | 'agent') => {
    const res = await registerApi(name, email, password, role)
    handleAuthResponse(res)
  }, [handleAuthResponse])

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
