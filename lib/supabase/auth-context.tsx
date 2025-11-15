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
    // If Supabase is not configured, skip session checks
    if (!supabase) {
      setLoading(false)
      return
    }

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
        setLoading(false)

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
    if (!supabase) {
      return { error: new Error('Supabase is not configured') }
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined
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
    if (!supabase) {
      return { error: new Error('Supabase is not configured') }
    }
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
    if (!supabase) {
      return { error: new Error('Supabase is not configured') }
    }
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      // Redirect to sign in page after sign out
      window.location.href = "/sign-in"
      return { error }
    } catch (error: any) {
      return { error }
    }
  }

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured') }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { error: new Error('Please enter a valid email address') }
    }
    
    try {
      // Use Supabase's built-in reset password functionality
      // This will send the password reset email via Supabase
      const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/set-new-password`
      })
      
      if (error) {
        // Provide more helpful error messages based on error type
        let errorMessage = error.message || 'Failed to send password reset email'
        
        // Handle specific Supabase error codes
        if (error.status === 500 || error.message?.includes('500')) {
          errorMessage = 'Email service is temporarily unavailable. Please check your Supabase email configuration or try again later.'
        } else if (error.status === 429) {
          errorMessage = 'Too many requests. Please wait a few minutes before trying again.'
        } else if (error.message?.includes('rate limit')) {
          errorMessage = 'Too many password reset requests. Please wait before trying again.'
        } else if (error.message?.includes('not found') || error.message?.includes('user')) {
          // Don't reveal if user exists for security, but provide helpful message
          errorMessage = 'If an account exists with this email, a password reset link will be sent.'
        }
        
        return { error: new Error(errorMessage) }
      }
      
      // Success - Supabase will send the email
      // Optionally send custom email using our API route (non-blocking)
      // This is a nice-to-have feature, but Supabase's email will work even if this fails
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
          // Log but don't fail - Supabase email was already sent
          const errorText = await response.text()
          console.warn('Custom email not sent (Brevo may not be configured):', errorText)
        }
      } catch (emailError) {
        // Log but don't fail - Supabase email was already sent
        console.warn('Custom email not sent (Brevo may not be configured):', emailError)
      }
      
      return { error: null }
    } catch (error: any) {
      // Handle unexpected errors
      let errorMessage = 'An unexpected error occurred. Please try again.'
      
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.status === 500) {
        errorMessage = 'Email service is temporarily unavailable. Please check your Supabase email configuration.'
      }
      
      return { error: new Error(errorMessage) }
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