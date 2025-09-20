import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: { username: string; password: string }) => Promise<void>
  register: (userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<void>
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  checkAuth: () => Promise<void>
  initAuth: () => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

// Helper functions for localStorage
const getStoredAuth = () => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('auth-storage')
  return stored ? JSON.parse(stored) : null
}

const setStoredAuth = (data: { user: User | null; token: string | null; isAuthenticated: boolean }) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth-storage', JSON.stringify(data))
}

const clearStoredAuth = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth-storage')
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initAuth: () => {
    const stored = getStoredAuth()
    if (stored) {
      set({
        user: stored.user,
        token: stored.token,
        isAuthenticated: stored.isAuthenticated,
      })
      // Verify token is still valid
      get().checkAuth()
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Login failed')
      }

      const data = await response.json()
      
      const authData = {
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      }
      
      set({
        ...authData,
        isLoading: false,
        error: null,
      })
      
      setStoredAuth(authData)
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      })
      throw error
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Registration failed')
      }

      const data = await response.json()
      
      const authData = {
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      }
      
      set({
        ...authData,
        isLoading: false,
        error: null,
      })
      
      setStoredAuth(authData)
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      })
      throw error
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    })
    clearStoredAuth()
  },

  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  checkAuth: async () => {
    const { token } = get()
    if (!token) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Token verification failed')
      }

      const data = await response.json()
      if (data.valid) {
        const authData = {
          user: data.user,
          token,
          isAuthenticated: true,
        }
        set(authData)
        setStoredAuth(authData)
      } else {
        get().logout()
      }
    } catch (error) {
      get().logout()
    }
  },
}))