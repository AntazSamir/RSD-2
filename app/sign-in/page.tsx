"use client"

import { useState } from "react"
import { SignInPage } from "@/components/sign-in"
import { DottedSurface } from "@/components/dotted-surface"

export default function SignInPageWrapper() {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 600))
      window.location.href = "/"
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    console.log("Google sign in")
    window.location.href = "/"
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
    </>
  )
}