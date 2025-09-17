"use client"

import { useState } from "react"
import { SignUpPage } from "@/components/sign-up"
import { DottedSurface } from "@/components/dotted-surface"
import { useAuth } from "@/lib/supabase/auth-context"
import { supabase } from "@/lib/supabase/client"

export default function SignUpPageWrapper() {
  const { signUp, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const name = formData.get('name') as string
      
      const { error } = await signUp(email, password, name)
      
      if (error) {
        setError(error.message || 'Failed to create account')
      } else {
        // Redirect to sign in page on successful sign up
        window.location.href = "/sign-in"
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/sign-in`
        }
      })
      
      if (error) {
        setError(error.message || 'Failed to sign up with Google')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }
  }

  const handleResetPassword = () => {
    console.log("Reset password")
  }

  const handleSignIn = () => {
    window.location.href = "/sign-in"
  }

  return (
    <>
      <DottedSurface />
      <SignUpPage
        title={<span className="font-light text-foreground tracking-tighter">Create Account</span>}
        description="Join our restaurant management platform"
        onSignUp={handleSignUp}
        onGoogleSignUp={handleGoogleSignUp}
        onResetPassword={handleResetPassword}
        onSignIn={handleSignIn}
      />
      {error && (
        <div className="fixed bottom-4 right-4 p-4 bg-red-500 text-white rounded-md">
          {error}
        </div>
      )}
    </>
  )
}