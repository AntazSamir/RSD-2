"use client"

import { useState } from "react"
import { SignUpPage } from "@/components/sign-up"
import { DottedSurface } from "@/components/dotted-surface"

export default function SignUpPageWrapper() {
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 600))
      window.location.href = "/sign-in"
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    console.log("Google sign up")
    window.location.href = "/sign-in"
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
    </>
  )
}