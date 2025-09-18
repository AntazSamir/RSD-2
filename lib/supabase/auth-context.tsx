'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
        setLoading(false)
        
        // Listen for auth changes
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (_event, session) => {
            setUser(session?.user || null)
            setLoading(false)
          }
        )
        
        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setLoading(false)
      }
    }
    
    checkSession()
  }, [])

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      })
      
      if (error) throw error
      
      if (data.user) {
        setUser(data.user)
      }
      
      return { error }
    } catch (error: any) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      if (data.user) {
        setUser(data.user)
      }
      
      return { error }
    } catch (error: any) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      return { error }
    } catch (error: any) {
      return { error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      // First, use Supabase's built-in reset password functionality
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/set-new-password`
      })
      
      if (error) throw error
      
      // Send custom email using our API route
      try {
        const response = await fetch('/api/send-password-reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            customerName: email.split('@')[0], // Use email prefix as name
            resetLink: `${window.location.origin}/set-new-password`
          }),
        })
        
        if (!response.ok) {
          console.error('Failed to send custom password reset email:', await response.text())
        }
      } catch (emailError) {
        console.error('Failed to send custom password reset email:', emailError)
        // Don't throw here as the Supabase reset still worked
      }
      
      return { error }
    } catch (error: any) {
      return { error }
    }
  }

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}