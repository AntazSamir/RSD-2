"use client"

import { useState } from "react"
import { SignInPage } from "@/components/sign-in"
import { DottedSurface } from "@/components/dotted-surface"
import { useAuth } from "@/lib/supabase/auth-context"
import { supabase } from "@/lib/supabase/client"

export default function SignInPageWrapper() {
  const { signIn, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error.message || 'Failed to sign in')
      } else {
        // Redirect to dashboard on successful sign in
        window.location.href = "/"
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })
      
      if (error) {
        setError(error.message || 'Failed to sign in with Google')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }
  }

  const handleResetPassword = () => {
    console.log("Reset password")
  }

  const handleCreateAccount = () => {
    window.location.href = "/sign-up"
  }

  return (
    <>
      <DottedSurface />
      <SignInPage
        title={<span className="font-light text-foreground tracking-tighter">Welcome Back</span>}
        description="Sign in to your restaurant management dashboard"
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
      {error && (
        <div className="fixed bottom-4 right-4 p-4 bg-red-500 text-white rounded-md">
          {error}
        </div>
      )}
    </>
  )
}