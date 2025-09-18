"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SignInPage } from "@/components/sign-in"
import { useAuth } from "@/lib/supabase/auth-context"
import { supabase } from "@/lib/supabase/client"
import { ThemeToggle } from "@/components/theme-toggle"
import { DottedSurface } from "@/components/dotted-surface"

export default function SignInPageWrapper() {
  const { signIn } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error.message || 'Failed to sign in')
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setError('Supabase is not configured')
      return
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
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
    router.push("/reset-password")
  }

  const handleCreateAccount = () => {
    router.push("/sign-up")
  }

  return (
    <>
      <DottedSurface />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
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