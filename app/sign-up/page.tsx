"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SignUpPage } from "@/components/sign-up"
import { useAuth } from "@/lib/supabase/auth-context"
import { supabase } from "@/lib/supabase/client"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignUpPageWrapper() {
  const { signUp } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
        router.push("/dashboard")
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }
  }

  const handleGoogleSignUp = async () => {
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
        setError(error.message || 'Failed to sign up with Google')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    }
  }

  const handleResetPassword = () => {
    router.push("/reset-password")
  }

  const handleSignIn = () => {
    router.push("/sign-in")
  }

  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
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