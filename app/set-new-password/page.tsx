"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SetNewPasswordPage() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)

  // Check if the reset token is valid
  useEffect(() => {
    const checkToken = async () => {
      try {
        // Get the hash fragment from the URL (where Supabase puts the token)
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        const accessToken = params.get('access_token')
        
        if (accessToken) {
          // Try to set the session to verify the token
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: params.get('refresh_token') || ''
          })
          
          if (error) {
            setIsValidToken(false)
            setError("Invalid or expired reset token")
          } else {
            setIsValidToken(true)
          }
        } else {
          setIsValidToken(false)
          setError("No reset token found in URL")
        }
      } catch (err) {
        setIsValidToken(false)
        setError("Failed to validate reset token")
        console.error(err)
      }
    }
    
    checkToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    
    setIsSubmitting(true)
    setMessage(null)
    setError(null)
    
    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) {
        setError(error.message || "Failed to update password")
      } else {
        setMessage("Password updated successfully! Redirecting to sign in...")
        // Redirect to sign in page after a short delay
        setTimeout(() => {
          window.location.href = "/sign-in"
        }, 2000)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Verifying Reset Token</h1>
            <p className="text-muted-foreground mt-2">
              Please wait while we verify your password reset token...
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Invalid Reset Token</h1>
            <p className="text-muted-foreground mt-2">
              {error || "The password reset link is invalid or has expired."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.href = "/reset-password"}
                className="rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Request New Reset Link
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Set New Password</h1>
          <p className="text-muted-foreground mt-2">
            Please enter your new password below.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-muted-foreground mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter new password"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Confirm new password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
        
        {message && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-500 text-center">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}