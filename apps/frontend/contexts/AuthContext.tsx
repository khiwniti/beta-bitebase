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
  // For demo purposes, set a mock user and skip authentication
  const [user, setUser] = useState<User | null>({
    id: 1,
    email: 'demo@bitebase.com',
    role: 'owner',
    name: 'Demo User',
    uid: '1',
    displayName: 'Demo User'
  })
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(true)

  // Backend API base URL
  const API_BASE = 'https://work-2-iedxpnjtcfddboej.prod-runtime.all-hands.dev/api'

  // Skip hydration check for demo

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
