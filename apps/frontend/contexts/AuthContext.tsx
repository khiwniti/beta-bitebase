"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { markUserAsFirstTime, clearUserSessionData } from '../utils/tourUtils'

// Custom User interface to match our backend
interface User {
  id: number
  email: string
  role: string
  name?: string
  uid?: string // For compatibility with existing code
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData?: any) => Promise<void>
  signInWithGoogle: (accountType?: string) => Promise<{ isNewUser: boolean }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Backend API base URL
  const API_BASE = 'http://localhost:8081/api'

  useEffect(() => {
    setMounted(true)

    // Check for existing token on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('bitebase_token')
      if (token) {
        // Verify token with backend
        fetch(`${API_BASE}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Invalid token')
        })
        .then(data => {
          setUser({
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            name: data.user.name,
            uid: data.user.id.toString() // For compatibility
          })
          setLoading(false)
        })
        .catch(() => {
          localStorage.removeItem('bitebase_token')
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading BiteBase...</p>
        </div>
      </div>
    )
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data = await response.json()
      
      // Store token
      localStorage.setItem('bitebase_token', data.token)
      
      // Set user
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
        uid: data.user.id.toString()
      })
      
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          password,
          firstName: userData?.firstName || userData?.name || email.split('@')[0],
          lastName: userData?.lastName || 'User',
          phone: userData?.phone || ''
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Registration failed')
      }

      const data = await response.json()
      
      // Store token
      localStorage.setItem('bitebase_token', data.token)
      
      // Set user
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
        uid: data.user.id.toString()
      })
      
      // Mark as first-time user for tour
      markUserAsFirstTime()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signInWithGoogle = async (accountType?: string) => {
    setLoading(true)
    try {
      // For now, we'll simulate Google sign-in by creating a demo account
      // In production, you would integrate with Google OAuth
      const demoEmail = `demo.${Date.now()}@bitebase.ai`
      const demoPassword = 'demo123456'
      
      await signUp(demoEmail, demoPassword, { 
        name: 'Demo User',
        role: accountType || 'user'
      })
      
      return { isNewUser: true }
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      // Clear token and user data
      localStorage.removeItem('bitebase_token')
      setUser(null)
      
      // Clear user session data on logout
      clearUserSessionData()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
