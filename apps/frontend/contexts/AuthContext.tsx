"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { markUserAsFirstTime, clearUserSessionData } from '../utils/tourUtils'

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

  useEffect(() => {
    setMounted(true)

    // Only initialize Firebase auth on client side
    if (typeof window !== 'undefined') {
      // Dynamically import Firebase auth to ensure it only runs on client
      import('../lib/firebase').then(({ auth }) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user)
          setLoading(false)
        })

        return unsubscribe
      }).catch((error) => {
        console.error('Failed to initialize Firebase auth:', error)
        setLoading(false)
      })
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
      const { auth } = await import('../lib/firebase')
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    setLoading(true)
    try {
      const { auth } = await import('../lib/firebase')
      const result = await createUserWithEmailAndPassword(auth, email, password)
      // Mark as first-time user for tour
      markUserAsFirstTime()
      // In a real app, you would save userData to Firestore here
      console.log('User created with additional data:', userData)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signInWithGoogle = async (accountType?: string) => {
    setLoading(true)
    try {
      const { auth } = await import('../lib/firebase')
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // Check if this is a new user
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime

      if (isNewUser) {
        // Mark as first-time user for tour
        markUserAsFirstTime()
        if (accountType) {
          // In a real app, you would save accountType to Firestore here
          console.log('New Google user with account type:', accountType)
        }
      }

      return { isNewUser }
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      const { auth } = await import('../lib/firebase')
      await signOut(auth)
      // Clear user session data on logout
      clearUserSessionData()
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
